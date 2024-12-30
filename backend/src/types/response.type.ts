import { Response } from "express";
import mongoose from "mongoose";
import { IUser } from "./user.type";

interface IResponse extends Response {
  user?: mongoose.Document<Partial<IUser> | null>;
}

export default IResponse;
