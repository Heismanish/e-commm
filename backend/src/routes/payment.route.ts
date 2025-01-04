import { NextFunction, Request, Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller";

const paymentRoute = Router();

paymentRoute.post(
  "/create-checkout-session",
  protectRoute,
  createCheckoutSession
);
paymentRoute.post("/checkout-success", protectRoute, checkoutSuccess);

export default paymentRoute;
