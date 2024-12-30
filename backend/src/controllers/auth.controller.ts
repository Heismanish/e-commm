import { NextFunction, Request, Response } from "express";
import User from "../model/User.model";
import { generateToken, setRefreshToken } from "../lib/generateToken";
import redis from "../lib/redis";
import jwt from "jsonwebtoken";
import token from "../types/token.type";
import { IUser } from "../types/user.type";
import mongoose, { ObjectId } from "mongoose";

function setCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF
    maxAge: 1000 * 60 * 15, // millisecond format
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF
    maxAge: 1000 * 60 * 60 * 24 * 7, // millisecond format
  });
}

const singup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please add all fields" });
      return;
    }

    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = new User({
      name,
      email,
      password,
    });
    const savedUser: IUser = await newUser.save();

    const { accessToken, refreshToken } = generateToken(
      savedUser._id as mongoose.Types.ObjectId
    ); // {refreshToken, accessToken}

    await setRefreshToken(
      refreshToken,
      savedUser._id as mongoose.Types.ObjectId
    );
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({ message: "User created successfully", savedUser });
    return;
  } catch (error) {
    console.log("Error in signup", error);
    res.status(500).json({ message: `Error in signup \n ${error}` });
  }
};

/**
 * Logs in a user with their email and password.
 *
 * This function will look for a user in the database with the given email.
 * If the user is not found, it will return a 400 status with a message of "User not found".
 * If a user is found, it will compare the given password with the user's stored hashed password.
 * If the passwords do not match, it will return a 400 status with a message of "Invalid credentials".
 * If the passwords match, it will generate a new access token and refresh token and set them as cookies in the response.
 * It will then return a 201 status with a message of "Login successful" and the user object.
 *
 * @param {Request} req - The request object containing the email and password in the body.
 * @param {Response} res - The response object that will be sent back to the client.
 * @returns {Promise<void>}
 */
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser: IUser | null = await User.findOne({ email });
    if (!existingUser) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const { accessToken, refreshToken } = generateToken(
      existingUser._id as mongoose.Types.ObjectId
    ); // {refreshToken, accessToken}

    await setRefreshToken(
      refreshToken,
      existingUser._id as mongoose.Types.ObjectId
    );
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({ message: "Login successful", existingUser });
    return;
  } catch (error) {
    console.log("Error in login", error);
    res.status(500).json({ message: `Error in login \n ${error}` });
  }
};

/**
 * Logs out the current user by ending their session.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns void
 */
const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token not found" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET!
    ) as token;

    await redis.del(`refreshToken:${decoded.user_id}`);
    console.log(decoded.user_id);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
    return;
  } catch (error) {
    console.log("Error in logout", error);
    res.status(500).json({ message: `Error in logout \n ${error}` });
  }
};

// 1. destructure refrshtoken from body
// 2. decode  user_id from the token and fetch token stored on redis for that user
// 3. verify the token
// 4. if valid then, generate a new access token ans set it to the cookie
const accessToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token not found" });
      return;
    }

    const decode: token = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET!
    ) as token;

    const redisToken = await redis.get(`refreshToken:${decode.user_id}`);

    if (refreshToken != redisToken) {
      res.status(400).json({ message: "Refresh token not found" });
      return;
    }

    const accessToken = jwt.sign(
      { user_id: decode.user_id },
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Access token generated successfully" });
    return;
  } catch (error) {
    console.log("Error while generating new access token", error);
    res
      .status(500)
      .json({ message: `Error while generating new access token \n ${error}` });
  }
};

const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      res.status(400).json({ message: "Access token not found" });
      return;
    }

    const decode: token = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET!
    ) as token;

    const user = await User.findById(decode.user_id);
    res.status(200).json({
      message: "Profile fetched successfully",
      name: user?.name,
      email: user?.email,
      role: user?.role,
      cartItems: user?.cartItems,
      createdAt: user?.createdAt,
    });
    return;
  } catch (error) {
    console.log("Error in profile", error);
    res.status(500).json({ message: `Error in profile \n ${error}` });
  }
};
export { singup, login, logout, accessToken, profile };
