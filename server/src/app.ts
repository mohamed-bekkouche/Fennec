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

app.use((req: Request, res: Response, next) => {
  // Handle Buffer body from serverless-http
  if (req.body && typeof req.body === "object" && req.body.type === "Buffer") {
    const bufferData = Buffer.from(req.body.data);
    const bodyString = bufferData.toString("utf-8");

    const contentType = req.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      try {
        req.body = JSON.parse(bodyString);
        console.log("✅ Successfully parsed JSON body:", req.body);
      } catch (e) {
        console.error("❌ Failed to parse JSON:", e);
        console.log("Raw body string:", bodyString);
        req.body = {};
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Parse form data
      const params = new URLSearchParams(bodyString);
      req.body = Object.fromEntries(params);
      console.log("✅ Successfully parsed form data:", req.body);
    } else {
      req.body = bodyString;
    }
  }

  next();
});
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read-only in production. Serving committed files is fine; don’t write here at runtime.
const UPLOADS_DIR = path.resolve("src/uploads");
app.use("/uploads", express.static(UPLOADS_DIR));

// CORS: use an allow-list (avoid throwing to prevent 500s)
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "",
  process.env.ADMIN_ORIGIN || "",
  process.env.PROD_CLIENT_ORIGIN || "", // e.g. https://your-frontend.netlify.app
  process.env.PROD_ADMIN_ORIGIN || "",
].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));

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
