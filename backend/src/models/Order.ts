import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  userId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  coupon?: mongoose.Types.ObjectId;
  deliveryFee: number;
  total: number;
  shippingAddress: any;
  paymentMethod: any;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "REFUNDED";
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  shippingAddress: { type: Schema.Types.Mixed, required: true },
  paymentMethod: { type: Schema.Types.Mixed },
  paymentStatus: { 
    type: String, 
    enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
    default: "PENDING"
  },
  orderStatus: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "PROCESSING", "READY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REFUNDED"],
    default: "PENDING"
  }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
