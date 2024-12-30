import { IUser } from "./user.type";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // add user property to the Request interface
    }
  }
}
