import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';

/**
 * Socket.IO authentication middleware.
 *
 * Reads the 'token' HTTP-only cookie from the socket handshake headers,
 * verifies it using the same JWT_SECRET as the Express middleware,
 * and attaches the authenticated identity to socket.data:
 *
 *   socket.data.userId  - string user ID (or 'admin' for support/admin users)
 *   socket.data.isAdmin - boolean, true if this is a support/admin socket
 *
 * Rejects the connection if no valid token is found.
 */
export const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    // Parse the 'token' cookie from the raw handshake headers.
    // Socket.IO does not auto-parse cookies, so we do it manually.
    const rawCookie: string = socket.handshake.headers.cookie || '';
    const tokenMatch = rawCookie.match(/(?:^|;\s*)token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return next(new Error('UNAUTHENTICATED'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // Admin/support token: { admin: true }
    if (decoded.admin === true) {
      socket.data.userId = 'admin';
      socket.data.isAdmin = true;
      return next();
    }

    // Regular user token: { id: userId, admin: false }
    if (!decoded.id) {
      return next(new Error('UNAUTHENTICATED'));
    }

    const user = await User.findById(decoded.id).select('_id').lean();
    if (!user) {
      return next(new Error('UNAUTHENTICATED'));
    }

    socket.data.userId = (user._id as any).toString();
    socket.data.isAdmin = false;
    next();
  } catch (err) {
    next(new Error('UNAUTHENTICATED'));
  }
};
