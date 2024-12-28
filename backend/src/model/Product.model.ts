import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
