import { Request, Response } from "express";
import Coupon from "../model/Coupon.model";

const getCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res
        .status(401)
        .json({ message: "Unauthorized: User not found in request" });
      return;
    }

    const coupon = await Coupon.findOne({
      userId: userId,
      isActive: true,
    });

    if (!coupon) {
      res
        .status(404)
        .json({ message: "No inactive coupon found for the user" });
      return;
    }

    res.status(200).json({ message: "Coupon retrieved successfully", coupon });
  } catch (error) {
    console.log(`Error in getting coupon:`, error);
    res.json({ message: `Error in getting coupon \n ${error}` });
  }
};

const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    console.log(code);
    const coupon = await Coupon.findOne({
      code: code,
      isActive: true,
      userId: req?.user?._id,
    });

    if (!coupon) {
      res.status(404).json({ message: "Coupon not found" });
      return;
    }
    if (coupon && coupon?.expirationDate.getTime() < new Date().getTime()) {
      coupon.isActive = false;
      await coupon?.save();
      res.status(400).json({ message: "Coupon expired" });
      return;
    } else {
      res.status(200).json({
        message: "Coupon is valid",
        code: coupon?.code,
        discountPercentage: coupon?.discountPercentage,
      });
      return;
    }
  } catch (error) {
    console.log(`Error in validating coupon:`, error);
    res.status(500).json({ message: `Error in validating coupon \n ${error}` });
  }
};

export { getCoupon, validateCoupon };
