import mongoose, { Document, Schema } from 'mongoose';

const paymentMethodSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    paymentMethodId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: "",
    },
    last4: {
      type: String,
      required: true,
    },
    expiryMonth: {
      type: Number,
      required: true,
    },
    expiryYear: {
      type: Number,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  cart: { productId: mongoose.Types.ObjectId, quantity: number }[];
  orders: mongoose.Types.ObjectId[];
  savedAddresses: any[];
  savedPaymentMethods: any[];
  usedCoupons: mongoose.Types.ObjectId[];
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  cart: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, min: 1 }
  }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  savedAddresses: [{
    id: { type: String },
    label: { type: String },
    name: { type: String },
    phone: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    isDefault: { type: Boolean, default: false }
  }],
  savedPaymentMethods: [
    {
      provider: {
        type: String,
      },
      paymentMethodId: {
        type: String,
      },
      type: {
        type: String,
      },
      brand: {
        type: String,
      },
      last4: {
        type: String,
      },
      expiryMonth: {
        type: Number,
      },
      expiryYear: {
        type: Number,
      },
      isDefault: {
        type: Boolean,
      },
    },
  ],
  usedCoupons: [{ type: Schema.Types.ObjectId, ref: 'Coupon' }],
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
