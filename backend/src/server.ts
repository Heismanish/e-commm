import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
  try {
    connectDB();
  } catch (error: any) {
    console.log("Db connection error", error.message);
  }
});
