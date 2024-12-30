import { Request } from "express";
import { IUser } from "./user.type";

interface IRequest extends Request {
  user?: IUser; // Make it optional as middleware may not always set it
}

export default IRequest;
