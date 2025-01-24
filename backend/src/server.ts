import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import productRoute from "./routes/product.route";
import cartRoute from "./routes/cart.route";
import couponRoute from "./routes/coupon.route";
import paymentRoute from "./routes/payment.route";
import analyticsRoute from "./routes/analytics.route";
import cors from "cors";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;
const _dirname = path.resolve();
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Replace with your client URL
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/coupons", couponRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/analytics", analyticsRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
  try {
    connectDB();
  } catch (error: any) {
    console.log("Db connection error", error.message);
  }
});
