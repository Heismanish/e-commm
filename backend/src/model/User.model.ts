import mongoose from "mongoose";
import Product from "./Product.model";
import bcrypt from "bcryptjs";
import { IUser } from "../types/user.type";

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  cartItems: [
    {
      quantity: {
        type: Number,
        default: 1,
      },
      products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
      },
    },
  ],
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// hashing the password before saving, better than doing it during signin process as it adds up to consistency of the data and keeps the hashing and signup logic seperate and keep our code modular.
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next(); // only hash if password is modified
    const salt: string = await bcrypt.genSalt(10); // default salt value is 10.
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    console.log("Error while saving new user:", error.message);
    next(error); // to be handled by the caller function
  }
});

// comparing the input password each time to match with saved password for user:
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<Boolean> {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema);
export default User;
