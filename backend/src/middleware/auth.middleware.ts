import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User.model";
import token from "../types/token.type";
import { IUser } from "../types/user.type";

const protectRoute = async (
  req: Request, // request type of express has been modified globally
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      res.status(401).json({ message: "Unauthorized: Access token not found" });
    }

    try {
      const decoded: token = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET!
      ) as token;

      const user = (await User.findById(decoded.user_id).select(
        "-password"
      )) as IUser; // filter the pasword

      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      req.user = user;

      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({
          message: "Unauthorized: Access token has expired",
        });
        throw error;
      }
    }
  } catch (error) {
    console.log(`Error in protectRoute middleware: ${error}`);
    res.json({
      message: `Error in protectRoute: Unauthorized - Invalid access token`,
    });
    return;
  }
};
const adminRoute = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req?.user?.role !== "admin") {
      res
        .status(401)
        .json({ message: "Access Denied - Only admin can access" });
    } else {
      next();
    }
  } catch (error) {
    console.log(`Error in adminRoute middleware: ${error}`);
    res.status(500).json({
      message:
        "Error in adminRoute middleware: Access Denied - Only admin can access",
    });
  }
};

export { protectRoute, adminRoute };
