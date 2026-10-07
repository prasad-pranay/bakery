import mongoose, { Document, Schema } from 'mongoose';

export type Category = "Cookies" | "Cake" | "Pastries" | "Croissant" | "Bagel" | "Bread";

export interface IProductReview {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
  userId?: mongoose.Types.ObjectId;
}

export interface IProduct extends Document {
  name: string;
  category: Category;
  price: number;
  description: string;
  tags: string[];
  image: string;
  accent: string;
  note: string;
  ingredients: string[];
  rating: number;
  reviewCount: number;
  reviews: IProductReview[];
  count: number;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["Cookies", "Cake", "Pastries", "Croissant", "Bagel", "Bread"],
    required: true
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  image: { type: String, required: true },
  accent: { type: String, required: true },
  note: { type: String, default: "" },
  ingredients: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  count: { type: Number, required: true, min: 0 },
  reviews: [{
    id: { type: Number },
    name: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    text: { type: String },
    date: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
