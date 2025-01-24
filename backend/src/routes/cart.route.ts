import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {
  addToCart,
  removeAllFromCart,
  updateQuantity,
  getCartProducts,
  clearCart,
} from "../controllers/cart.controller";

const cartRouter = Router();

cartRouter.get("/", protectRoute, getCartProducts);
cartRouter.post("/", protectRoute, addToCart);
cartRouter.delete("/:id", protectRoute, removeAllFromCart);
cartRouter.put("/:id", protectRoute, updateQuantity);
cartRouter.delete("/", protectRoute, clearCart);

export default cartRouter;
