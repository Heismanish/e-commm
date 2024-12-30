import { Request, Response, Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProduct,
  getRecommendedProduct,
  getCategoryProducts,
  toggleFeaturedProduct,
} from "../controllers/product.controller";
import { adminRoute, protectRoute } from "../middleware/auth.middleware";

const productRoute = Router();

productRoute.get("/test", (req: Request, res: Response) => {
  res.send("product routes working");
});

productRoute.get("/", protectRoute, adminRoute, getAllProducts);
productRoute.get("/featured", getFeaturedProduct);
productRoute.get("/recommended", getRecommendedProduct);
productRoute.get("/category/:category", getCategoryProducts);
productRoute.post("/", protectRoute, adminRoute, createProduct);
productRoute.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
productRoute.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default productRoute;
