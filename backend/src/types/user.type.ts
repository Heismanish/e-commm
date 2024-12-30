import mongoose from "mongoose";

// type of the user:
export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  cartItems: {
    quantity: number;
    products: mongoose.Schema.Types.ObjectId;
  }[];
  role: "customer" | "admin";
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
}
