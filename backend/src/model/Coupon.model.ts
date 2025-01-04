import mongoose from "mongoose";

import ICoupon from "../types/coupon.type";
import User from "./User.model";

const CouponSchema = new mongoose.Schema<ICoupon>({
  code: {
    type: String,
    required: [true, "Please add a code"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  discountPercentage: {
    type: Number,
    required: [true, "Please add a discount percentage"],
    min: 0,
    max: 100,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expirationDate: {
    type: Date,
    required: [true, "Please add a expiration data"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: [true, "Please add a user"],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;
