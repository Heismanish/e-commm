import mongoose from "mongoose";
import IOrder from "../types/order.type";

const OrderSchema = new mongoose.Schema<IOrder>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please add a user"],
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Please add a product"],
      },
      quantity: {
        type: Number,
        min: 1,
        required: true,
      },
      price: {
        type: Number,
        required: [true, "Please add a price"],
        min: 0,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  stripeSessionId: {
    type: String,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now() },
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
