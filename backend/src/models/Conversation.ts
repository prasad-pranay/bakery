import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  assignedTo?: string; // support/admin identifier
  status: 'open' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
ConversationSchema.index({ userId: 1 });
ConversationSchema.index({ status: 1 });
ConversationSchema.index({ updatedAt: -1 });
ConversationSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
