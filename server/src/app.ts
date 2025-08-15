import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import connectDB from "./config/database";
import authRouter from "./routes/AuthRouter";
import productRouter from "./routes/ProductRouter";
import categoryRouter from "./routes/CategoryRouter";
import brandRouter from "./routes/BrandRouter";
import orderRouter from "./routes/OrderRouter";
import adminRouter from "./routes/AdminRouter";
import collectionRouter from "./routes/CollectionRouter";
import productImageRouter from "./routes/ProductImageRouter";
import couponRouter from "./routes/CouponRouter";
import suitElemntRouter from "./routes/SuitELementRouter";

dotenv.config();

const app = express();

// Parsers & cookies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ⚠️ Static uploads: read-only on Vercel. OK to serve committed files,
// but don't try to write here at runtime.
const UPLOADS_DIR = path.resolve("src/uploads");
app.use("/uploads", express.static(UPLOADS_DIR));

// CORS: don’t throw (throwing produces 500s). Prefer array form.
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://10.195.216.85:5173",
  process.env.ADMIN_ORIGIN || "http://192.168.136.13:5173",
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Health check
app.get("/api/data", (_req: Request, res: Response) => {
  res.json({ message: "API response" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/brands", brandRouter);
app.use("/api/collections", collectionRouter);
app.use("/api/product-images", productImageRouter);
app.use("/api/suit-elements", suitElemntRouter);
app.use("/api/coupons", couponRouter);

export default app;
