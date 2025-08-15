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

app.use(cookieParser());

// Read-only in production. Serving committed files is fine; don’t write here at runtime.
const UPLOADS_DIR = path.resolve("src/uploads");
app.use("/uploads", express.static(UPLOADS_DIR));

// In your app.ts - Updated CORS section
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "",
  process.env.ADMIN_ORIGIN || "",
  process.env.PROD_CLIENT_ORIGIN || "", // Your Vercel frontend URL
  process.env.PROD_ADMIN_ORIGIN || "",
  "http://localhost:3000", // For local development
  "http://localhost:5173", // Vite default port
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

// Add explicit body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/api/data", (_req: Request, res: Response) => {
  res.json({ message: "API response" });
});

// Add this to your app.ts for debugging
app.post("/api/test", (req: Request, res: Response) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Content-Type:", req.get("Content-Type"));

  res.json({
    message: "Test successful",
    body: req.body,
    contentType: req.get("Content-Type"),
  });
});

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
