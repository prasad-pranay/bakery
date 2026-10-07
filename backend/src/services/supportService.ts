import Conversation, { IConversation } from '../models/Conversation';
import Message, { IMessage } from '../models/Message';
import mongoose from 'mongoose';

/**
 * Find an existing open conversation for a user, or create a new one.
 * This guarantees that reconnects / multiple tabs always reuse the same conversation.
 */
export const getOrCreateConversation = async (
  userId: string
): Promise<IConversation> => {
  // Try to find an existing open conversation first
  let conversation = await Conversation.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    status: 'open',
  });

  if (!conversation) {
    conversation = await Conversation.create({
      userId: new mongoose.Types.ObjectId(userId),
      status: 'open',
    });
  }

  return conversation;
};

/**
 * Save a message from a regular user into their conversation.
 */
export const saveUserMessage = async (
  conversationId: string,
  userId: string,
  text: string
): Promise<IMessage> => {
  return Message.create({
    conversationId: new mongoose.Types.ObjectId(conversationId),
    senderId: userId,
    senderType: 'user',
    message: text.trim(),
  });
};

/**
 * Save a message from a support/admin agent into a conversation.
 */
export const saveSupportMessage = async (
  conversationId: string,
  text: string
): Promise<IMessage> => {
  // Touch updatedAt so the conversation floats to the top of admin dashboards
  await Conversation.findByIdAndUpdate(conversationId, { $set: { updatedAt: new Date() } });

  return Message.create({
    conversationId: new mongoose.Types.ObjectId(conversationId),
    senderId: 'admin',
    senderType: 'support',
    message: text.trim(),
  });
};

/**
 * Fetch the chronological message history for a conversation.
 */
export const getConversationHistory = async (
  conversationId: string
): Promise<IMessage[]> => {
  return Message.find({
    conversationId: new mongoose.Types.ObjectId(conversationId),
  })
    .sort({ createdAt: 1 })
    .lean();
};

/**
 * Fetch all open conversations — used by the support admin dashboard.
 */
export const getAllOpenConversations = async (): Promise<IConversation[]> => {
  return Conversation.find({ status: 'open' })
    .populate('userId', 'name email ')
    .sort({ updatedAt: -1 })
    .lean();
};
export const getAllConversations = async (): Promise<IConversation[]> => {
  return Conversation.find({})
    .populate('userId', 'name email ')
    .sort({ updatedAt: -1 })
    .lean();
};

/**
 * Verify that the given conversationId belongs to the given userId.
 * Used to prevent regular users from joining arbitrary conversations.
 */
export const verifyConversationOwner = async (
  conversationId: string,
  userId: string
): Promise<boolean> => {
  const conv = await Conversation.findById(conversationId).lean();
  if (!conv) return false;
  return conv.userId.toString() === userId;
};

/**
 * Close a conversation.
 */
export const closeConversation = async (conversationId: string): Promise<void> => {
  await Conversation.findByIdAndUpdate(conversationId, { status: 'closed' });
};
