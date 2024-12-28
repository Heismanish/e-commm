import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

interface token extends JwtPayload {
  user_id: mongoose.Types.ObjectId;
}

export default token;
