import { Request, Response } from "express";
import Product from "../model/Product.model";
import redis from "../lib/redis";
import cloudinary from "../lib/cloudinary";
import IProduct from "../types/product.type";

const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(201).json({ products });
    return;
  } catch (error) {
    console.log("Error in getting products", error);
    res.status(500).json({ message: `Error in getting products \n ${error}` });
  }
};

const getFeaturedProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const featuredProducts = await redis.get("featured_products");

    if (featuredProducts) {
      res.status(201).json(JSON.parse(featuredProducts));
      return;
    } else {
      const featuredProducts = await Product.find({ isFeatured: true }).lean(); // lean() returns a js object rather than a mongoose object, but we can't modify or save it.

      redis.set("featured_products", JSON.stringify(featuredProducts));
      res.status(201).json(featuredProducts);
      return;
    }
  } catch (error) {
    console.log("Error in getting featured products", error);
    res
      .status(500)
      .json({ message: `Error in getting featured products \n ${error}` });
  }
};

const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, category, isFeatured } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse?.secure_url
        : "",
      category,

      isFeatured,
    });

    res
      .status(200)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.log("Error in creating product", error);
    res.status(500).json({ message: `Error in creating product \n ${error}` });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const pid = req.params.id;
    const product = await Product.findById(pid);

    if (!product) {
      res.json({ message: "Product not found" });
      return;
    }

    if (product.image) {
      const publicId = product?.image?.split("/")?.pop()?.split(".")[0];
      await cloudinary.uploader.destroy(publicId!);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully" });
    return;
  } catch (error) {
    console.log("Error in deleting product", error);
    res.status(500).json({ message: `Error in deleting product \n ${error}` });
  }
};

const getRecommendedProduct = async (req: Request, res: Response) => {
  try {
    const recommendation = await Product.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]);

    res.status(201).json({ recommendation });
  } catch (error) {
    console.log("Error in getting recommended products", error);
    res
      .status(500)
      .json({ message: `Error in getting recommended products \n ${error}` });
  }
};

const getCategoryProducts = async (req: Request, res: Response) => {
  try {
    const categoryProduct = await Product.find({
      category: req.params.category,
    });
    res.status(201).json({ categoryProduct });
  } catch (error) {
    console.log("Error in getting category products", error);
    res
      .status(500)
      .json({ message: `Error in getting category products \n ${error}` });
  }
};

const toggleFeaturedProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = (await Product.findById(id)) as IProduct;
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    product.isFeatured = !product.isFeatured;
    const featuredProduct = await product.save();
    await updateFeaturedProductCache();

    res
      .status(201)
      .json({ message: "Product updated successfully", featuredProduct });
  } catch (error) {
    console.log("Error updating featured products", error);
    res
      .status(500)
      .json({ message: `Error updating featured products \n ${error}` });
  }
};

const updateFeaturedProductCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    return;
  } catch (error) {
    console.log(`Error updating featured products cache: ${error}`);
  }
};

export {
  getAllProducts,
  getFeaturedProduct,
  createProduct,
  deleteProduct,
  getRecommendedProduct,
  getCategoryProducts,
  toggleFeaturedProduct,
};
