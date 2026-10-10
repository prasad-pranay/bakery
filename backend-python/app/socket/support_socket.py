from flask import request
from flask_socketio import SocketIO, emit, join_room, leave_room, disconnect
from app.socket.socket_auth import authenticate_socket
from app.services.support_service import (
    get_or_create_conversation,
    save_user_message,
    save_support_message,
    get_conversation_history,
    getAllOpenConversations,
    getAllConversations,
    verify_conversation_owner,
    close_conversation
)
from app.db import get_db
from app.utils.serializers import serialize_doc, to_object_id

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def room(conversation_id: str) -> str:
    """Build the Socket.IO room name for a conversation."""
    return f"support:conversation:{conversation_id}"

def emit_error(code: str, message: str):
    """Emit a structured error only to the originating socket."""
    emit('support:error', {'code': code, 'message': message})

# ---------------------------------------------------------------------------
# Per-user socket tracking (for online/offline presence)
# Maps userId -> set of socket sids
# ---------------------------------------------------------------------------
user_sockets = {}
# Maps socket sid -> {'userId': str, 'isAdmin': bool, 'conversationId': str, 'adminConversationId': str}
socket_data = {}

def track_connect(user_id: str, sid: str):
    if user_id not in user_sockets:
        user_sockets[user_id] = set()
    user_sockets[user_id].add(sid)

def track_disconnect(user_id: str, sid: str):
    if user_id in user_sockets:
        user_sockets[user_id].discard(sid)
        if len(user_sockets[user_id]) == 0:
            del user_sockets[user_id]

def is_user_online(user_id: str) -> bool:
    return len(user_sockets.get(user_id, set())) > 0

# ---------------------------------------------------------------------------
# Event Registration
# ---------------------------------------------------------------------------
def register_support_handlers(socketio: SocketIO):

    @socketio.on('connect')
    def handle_connect():
        sid = request.sid
        try:
            user_id, is_admin = authenticate_socket(request.environ)
        except ValueError as err:
            print(f"[socket] Auth error for {sid}: {err}")
            return False  # Rejects the socket.io connection with UNAUTHENTICATED

        socket_data[sid] = {
            'userId': user_id,
            'isAdmin': is_admin,
            'conversationId': None,
            'adminConversationId': None
        }

        if not is_admin:
            # ── REGULAR USER ──────────────────────────────────────────────────
            track_connect(user_id, sid)
            try:
                conv = get_or_create_conversation(user_id)
                conv_id = str(conv['_id'])
                socket_data[sid]['conversationId'] = conv_id

                join_room(room(conv_id))

                # Send history only to this socket
                history = get_conversation_history(conv_id)
                emit('support:history', history)

                # Broadcast to others in the room that this user is online
                emit('support:status', {'online': True, 'userId': user_id}, to=room(conv_id), include_self=False)

                # Notify admins that user came online
                socketio.emit('support:user_status', {
                    'conversationId': conv_id,
                    'userId': user_id,
                    'online': True
                }, to='support:admin')

            except Exception as err:
                print(f"[socket] Error setting up user conversation: {err}")
                emit_error('SERVER_ERROR', 'Failed to initialise support session')
                disconnect()
                return
        else:
            # ── ADMIN / SUPPORT ───────────────────────────────────────────────
            join_room('support:admin')

    @socketio.on('disconnect')
    def handle_disconnect():
        sid = request.sid
        data = socket_data.pop(sid, None)
        if not data:
            return

        user_id = data.get('userId')
        is_admin = data.get('isAdmin')
        conv_id = data.get('conversationId')

        if not is_admin and user_id:
            track_disconnect(user_id, sid)
            still_online = is_user_online(user_id)

            if not still_online and conv_id:
                emit('support:status', {'online': False, 'userId': user_id}, to=room(conv_id), include_self=False)
                socketio.emit('support:user_status', {
                    'conversationId': conv_id,
                    'userId': user_id,
                    'online': False
                }, to='support:admin')

    # ── REGULAR USER & ADMIN MESSAGING ───────────────────────────────────────
    @socketio.on('support:message')
    def handle_message(payload):
        sid = request.sid
        data = socket_data.get(sid, {})
        is_admin = data.get('isAdmin', False)
        user_id = data.get('userId')

        if not is_admin:
            # User message
            conv_id = data.get('conversationId')
            if not conv_id:
                return emit_error('SERVER_ERROR', 'No active conversation')

            text = payload.get('message', '').strip() if isinstance(payload, dict) else ''
            if not text:
                return emit_error('INVALID_MESSAGE', 'Message cannot be empty')
            if len(text) > 5000:
                return emit_error('INVALID_MESSAGE', 'Message is too long')

            try:
                saved = save_user_message(conv_id, user_id, text)
                socketio.emit('support:message', saved, to=room(conv_id))
            except Exception as err:
                print(f"[socket] support:message error: {err}")
                emit_error('SERVER_ERROR', 'Failed to send message')
        else:
            # Admin message
            conv_id = payload.get('conversationId', '').strip() if isinstance(payload, dict) else ''
            text = payload.get('message', '').strip() if isinstance(payload, dict) else ''

            if not conv_id:
                return emit_error('INVALID_PAYLOAD', 'conversationId is required')
            if not text:
                return emit_error('INVALID_MESSAGE', 'Message cannot be empty')
            if len(text) > 5000:
                return emit_error('INVALID_MESSAGE', 'Message is too long')

            try:
                saved = save_support_message(conv_id, text)
                socketio.emit('support:message', saved, to=room(conv_id))
            except Exception as err:
                print(f"[socket] admin support:message error: {err}")
                emit_error('SERVER_ERROR', 'Failed to send message')

    @socketio.on('support:typing')
    def handle_typing(payload):
        sid = request.sid
        data = socket_data.get(sid, {})
        is_admin = data.get('isAdmin', False)
        user_id = data.get('userId')

        if not is_admin:
            conv_id = data.get('conversationId')
            if not conv_id:
                return
            typing = payload.get('typing') is True if isinstance(payload, dict) else False
            emit('support:typing', {'typing': typing, 'userId': user_id}, to=room(conv_id), include_self=False)
        else:
            conv_id = payload.get('conversationId', '').strip() if isinstance(payload, dict) else ''
            typing = payload.get('typing') is True if isinstance(payload, dict) else False
            if not conv_id:
                return
            emit('support:typing', {'typing': typing, 'userId': 'support'}, to=room(conv_id), include_self=False)

    @socketio.on('support:leave')
    def handle_user_leave():
        sid = request.sid
        data = socket_data.get(sid, {})
        conv_id = data.get('conversationId')
        if conv_id:
            leave_room(room(conv_id))

    # ── ADMIN SPECIFIC EVENTS ─────────────────────────────────────────────────
    @socketio.on('support:admin:get_conversations')
    def handle_admin_get_conversations():
        sid = request.sid
        data = socket_data.get(sid, {})
        if not data.get('isAdmin'):
            return

        try:
            conversations = getAllConversations()
            emit('support:admin:conversations', conversations)
        except Exception as err:
            print(f"[socket] support:admin:get_conversations error: {err}")
            emit_error('SERVER_ERROR', 'Failed to fetch conversations')

    @socketio.on('support:admin:join')
    def handle_admin_join(payload):
        sid = request.sid
        data = socket_data.get(sid, {})
        if not data.get('isAdmin'):
            return

        conv_id = payload.get('conversationId', '').strip() if isinstance(payload, dict) else ''
        if not conv_id:
            return emit_error('INVALID_PAYLOAD', 'conversationId is required')

        try:
            history = get_conversation_history(conv_id)
            join_room(room(conv_id))
            data['adminConversationId'] = conv_id

            # Send history only to this admin socket
            emit('support:history', history)

            # Notify user in room that support joined
            emit('support:status', {'online': True, 'userId': 'support'}, to=room(conv_id), include_self=False)
        except Exception as err:
            print(f"[socket] support:admin:join error: {err}")
            emit_error('SERVER_ERROR', 'Failed to join conversation')

    @socketio.on('support:admin:leave')
    def handle_admin_leave(payload):
        sid = request.sid
        data = socket_data.get(sid, {})
        if not data.get('isAdmin'):
            return

        conv_id = payload.get('conversationId', '').strip() if isinstance(payload, dict) else ''
        if conv_id:
            leave_room(room(conv_id))
            emit('support:status', {'online': False, 'userId': 'support'}, to=room(conv_id), include_self=False)

    @socketio.on('support:admin:close_conversation')
    def handle_admin_close_conversation(payload):
        sid = request.sid
        data = socket_data.get(sid, {})
        if not data.get('isAdmin'):
            return

        conv_id = payload.get('conversationId', '').strip() if isinstance(payload, dict) else ''
        if not conv_id:
            return emit_error('INVALID_PAYLOAD', 'conversationId is required')

        try:
            close_conversation(conv_id)
            socketio.emit('support:status', {
                'closed': True,
                'message': 'Your support conversation has been closed.'
            }, to=room(conv_id))
        except Exception as err:
            print(f"[socket] support:admin:close_conversation error: {err}")
            emit_error('SERVER_ERROR', 'Failed to close conversation')
