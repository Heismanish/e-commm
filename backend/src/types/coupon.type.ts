import mongoose from "mongoose";

interface ICoupon extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  discountPercentage: number;
  isActive: Boolean;
  expirationDate: Date;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

export default ICoupon;
