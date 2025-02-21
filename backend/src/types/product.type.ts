import mongoose from "mongoose";

export default interface IProduct extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  countInStock: number;
  isFeatured: boolean;
  createdAt: Date;
}
