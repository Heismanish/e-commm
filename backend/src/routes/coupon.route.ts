import { Router } from "express";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller";
import { protectRoute } from "../middleware/auth.middleware";

const couponRoute = Router();

couponRoute.get("/", protectRoute, getCoupon);
couponRoute.post("/validate", protectRoute, validateCoupon);

export default couponRoute;
