import { Server, Socket } from 'socket.io';
import {
  getOrCreateConversation,
  saveUserMessage,
  saveSupportMessage,
  getConversationHistory,
  getAllOpenConversations,
  verifyConversationOwner,
  closeConversation,
  getAllConversations,
} from '../services/supportService';
import User from '../models/User';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build the Socket.IO room name for a conversation. */
const room = (conversationId: string) => `support:conversation:${conversationId}`;

/** Emit a structured error only to the originating socket. */
const emitError = (socket: Socket, code: string, message: string) => {
  socket.emit('support:error', { code, message });
};

// ---------------------------------------------------------------------------
// Per-user socket tracking (for online/offline presence)
// Maps userId -> Set of socketIds
// ---------------------------------------------------------------------------
const userSockets = new Map<string, Set<string>>();

const trackConnect = (userId: string, socketId: string) => {
  if (!userSockets.has(userId)) userSockets.set(userId, new Set());
  userSockets.get(userId)!.add(socketId);
};

const trackDisconnect = (userId: string, socketId: string) => {
  const sockets = userSockets.get(userId);
  if (sockets) {
    sockets.delete(socketId);
    if (sockets.size === 0) userSockets.delete(userId);
  }
};

const isUserOnline = (userId: string): boolean =>
  (userSockets.get(userId)?.size ?? 0) > 0;

// ---------------------------------------------------------------------------
// Main handler — called once per Socket.IO Server instance
// ---------------------------------------------------------------------------

export const registerSupportHandlers = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    const userId: string = socket.data.userId;
    const isAdmin: boolean = socket.data.isAdmin;


    // -----------------------------------------------------------------------
    // CONNECTION SETUP
    // -----------------------------------------------------------------------

    if (!isAdmin) {
      // ── REGULAR USER ──────────────────────────────────────────────────────

      const userData = await User.find({ _id: userId });

      trackConnect(userId, socket.id);

      let conversationId: string;

      try {
        const conversation = await getOrCreateConversation(userId);
        conversationId = (conversation._id as any).toString();

        // Join the isolated room for this conversation
        socket.join(room(conversationId));

        // Store on the socket for use in event handlers
        socket.data.conversationId = conversationId;

        // Send history only to this socket (not the whole room)
        const history = await getConversationHistory(conversationId);
        socket.emit('support:history', history);

        // Tell everyone in the room this user is online
        socket.to(room(conversationId)).emit('support:status', { online: true, userId });

        // Notify admins that a user came online (they listen on 'support:admin')
        io.to('support:admin').emit('support:user_status', {
          conversationId,
          userId: userId,
          // user: { _id: userId, name: userData[0].name, email: userData[0].email, avatar: '' },
          online: true,
        });
      } catch (err) {
        console.error('[socket] Error setting up user conversation:', err);
        emitError(socket, 'SERVER_ERROR', 'Failed to initialise support session');
        socket.disconnect(true);
        return;
      }

      // ── USER EVENTS ───────────────────────────────────────────────────────

      /**
       * support:message
       * Payload: { message: string }
       */
      socket.on('support:message', async (payload: any) => {
        try {
          const text: string =
            typeof payload?.message === 'string' ? payload.message.trim() : '';

          if (!text) {
            return emitError(socket, 'INVALID_MESSAGE', 'Message cannot be empty');
          }

          if (text.length > 5000) {
            return emitError(socket, 'INVALID_MESSAGE', 'Message is too long');
          }

          const saved = await saveUserMessage(conversationId, userId, text);

          // Broadcast to everyone in the conversation room (user + any support agent)
          io.to(room(conversationId)).emit('support:message', saved);
        } catch (err) {
          console.error('[socket] support:message error:', err);
          emitError(socket, 'SERVER_ERROR', 'Failed to send message');
        }
      });

      /**
       * support:typing
       * Payload: { typing: boolean }
       */
      socket.on('support:typing', (payload: any) => {
        const typing = payload?.typing === true;
        // Broadcast only to OTHER sockets in the same room (support agents)
        socket.to(room(conversationId)).emit('support:typing', { typing, userId });
      });

      /**
       * support:leave
       * Client explicitly signals it is leaving (optional; disconnect handles cleanup too)
       */
      socket.on('support:leave', () => {
        socket.leave(room(conversationId));
      });

      // ── DISCONNECT ────────────────────────────────────────────────────────

      socket.on('disconnect', () => {
        trackDisconnect(userId, socket.id);
        const stillOnline = isUserOnline(userId);

        // Only broadcast offline if ALL of the user's sockets disconnected
        if (!stillOnline) {
          socket.to(room(conversationId)).emit('support:status', { online: false, userId });
          io.to('support:admin').emit('support:user_status', {
            conversationId,
            userId,
            online: false,
          });
        }
      });
    } else {
      // ── ADMIN / SUPPORT ───────────────────────────────────────────────────

      // Join the special admin room so they receive user_status broadcasts
      socket.join('support:admin');

      /**
       * support:admin:get_conversations
       * Ask for the list of all open conversations (dashboard load)
       */
      socket.on('support:admin:get_conversations', async () => {
        try {
          const conversations = await getAllConversations();
          socket.emit('support:admin:conversations', conversations);
        } catch (err) {
          console.error('[socket] support:admin:get_conversations error:', err);
          emitError(socket, 'SERVER_ERROR', 'Failed to fetch conversations');
        }
      });

      /**
       * support:admin:join
       * Payload: { conversationId: string }
       * Admin joins a specific customer conversation room.
       */
      socket.on('support:admin:join', async (payload: any) => {
        try {
          const convId: string =
            typeof payload?.conversationId === 'string'
              ? payload.conversationId.trim()
              : '';

          if (!convId) {
            return emitError(socket, 'INVALID_PAYLOAD', 'conversationId is required');
          }

          // Validate: conversation must actually exist
          const history = await getConversationHistory(convId);

          socket.join(room(convId));
          socket.data.adminConversationId = convId;

          // Send history only to this admin socket
          socket.emit('support:history', history);

          // Notify user that support joined
          socket.to(room(convId)).emit('support:status', {
            online: true,
            userId: 'support',
          });
        } catch (err) {
          console.error('[socket] support:admin:join error:', err);
          emitError(socket, 'SERVER_ERROR', 'Failed to join conversation');
        }
      });

      /**
       * support:message
       * Payload: { conversationId: string, message: string }
       * Admin sends a message into a specific conversation.
       */
      socket.on('support:message', async (payload: any) => {
        try {
          const convId: string =
            typeof payload?.conversationId === 'string'
              ? payload.conversationId.trim()
              : '';
          const text: string =
            typeof payload?.message === 'string' ? payload.message.trim() : '';

          if (!convId) {
            return emitError(socket, 'INVALID_PAYLOAD', 'conversationId is required');
          }
          if (!text) {
            return emitError(socket, 'INVALID_MESSAGE', 'Message cannot be empty');
          }
          if (text.length > 5000) {
            return emitError(socket, 'INVALID_MESSAGE', 'Message is too long');
          }

          const saved = await saveSupportMessage(convId, text);

          // Deliver to everyone in that specific conversation room
          io.to(room(convId)).emit('support:message', saved);
        } catch (err) {
          console.error('[socket] admin support:message error:', err);
          emitError(socket, 'SERVER_ERROR', 'Failed to send message');
        }
      });

      /**
       * support:typing
       * Payload: { conversationId: string, typing: boolean }
       */
      socket.on('support:typing', (payload: any) => {
        const convId: string =
          typeof payload?.conversationId === 'string'
            ? payload.conversationId.trim()
            : '';
        const typing = payload?.typing === true;

        if (!convId) return;

        // Only broadcast to sockets INSIDE the room (not back to the admin sending it)
        socket.to(room(convId)).emit('support:typing', { typing, userId: 'support' });
      });

      /**
       * support:admin:leave
       * Payload: { conversationId: string }
       * Admin leaves a specific conversation room.
       */
      socket.on('support:admin:leave', (payload: any) => {
        const convId: string =
          typeof payload?.conversationId === 'string'
            ? payload.conversationId.trim()
            : '';
        if (convId) {
          socket.leave(room(convId));
          socket.to(room(convId)).emit('support:status', {
            online: false,
            userId: 'support',
          });
        }
      });

      /**
       * support:admin:close_conversation
       * Payload: { conversationId: string }
       */
      socket.on('support:admin:close_conversation', async (payload: any) => {
        try {
          const convId: string =
            typeof payload?.conversationId === 'string'
              ? payload.conversationId.trim()
              : '';

          if (!convId) {
            return emitError(socket, 'INVALID_PAYLOAD', 'conversationId is required');
          }

          await closeConversation(convId);

          // Notify the user their conversation was closed
          io.to(room(convId)).emit('support:status', {
            closed: true,
            message: 'Your support conversation has been closed.',
          });
        } catch (err) {
          console.error('[socket] support:admin:close_conversation error:', err);
          emitError(socket, 'SERVER_ERROR', 'Failed to close conversation');
        }
      });

      // Disconnect — admin sockets don't need special tracking
      socket.on('disconnect', () => {
        // nothing extra needed; Socket.IO removes from rooms automatically
      });
    }
  });
};
