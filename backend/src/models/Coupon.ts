import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscount?: number;
  expiresAt: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ["PERCENTAGE", "FIXED"], required: true },
  discountValue: { type: Number, required: true },
  minimumOrderValue: { type: Number, default: 0 },
  maximumDiscount: { type: Number },
  expiresAt: { type: Date, required: true },
  usageLimit: { type: Number, required: true },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ICoupon>('Coupon', CouponSchema);
