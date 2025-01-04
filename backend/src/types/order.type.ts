import mongoose from "mongoose";

export type productOrderType = {
  id: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
};

interface IOrder extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  createdAt: Date;
  stripeSessionId: string;
}

export default IOrder;
