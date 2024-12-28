import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import redis from "./redis";

function generateToken(user_id: mongoose.Types.ObjectId): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = jwt.sign(
    { user_id },
    process.env.JWT_ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { user_id },
    process.env.JWT_REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
}

async function setRefreshToken(
  refreshToken: string,
  user_id: mongoose.Types.ObjectId
) {
  await redis.set(
    `refreshToken:${user_id}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
}

export { generateToken, setRefreshToken };
