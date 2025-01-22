import mongoose from "mongoose";
import IProduct from "../types/product.type";

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    min: 0,
  },
  image: {
    type: String,
    required: [true, "Please add an image"],
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
