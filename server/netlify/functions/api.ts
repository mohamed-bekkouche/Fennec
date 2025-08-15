// netlify/functions/api.ts
import serverless from "serverless-http";

export const handler = async (event: any, context: any) => {
  try {
    // Lazily import AFTER envs are available so we can catch errors
    const { getAes256Key } = await import("../../src/utils/Crypto");
    // Validate the key without logging it
    const key = getAes256Key();

    const { default: connectDB } = await import("../../src/config/database");
    const { default: app } = await import("../../src/app");

    // --- Diagnostics (safe) ---
    const cryptoLen = (process.env.CRYPTO_KEY || "").replace(/\s+/g, "").length;
    const hasMongo = !!process.env.MONGODB_URI;
    const skipDb = process.env.SKIP_DB === "1";
    console.log({ cryptoLen, hasMongo, skipDb });
    // --------------------------

    if (!skipDb) {
      await connectDB(); // make sure this function caches the connection!
    }

    const expressHandler = serverless(app);
    return await expressHandler(event, context);
  } catch (err: any) {
    console.error("FUNCTION FATAL:", err?.message, err?.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Function crashed",
        message: String(err?.message || err),
      }),
    };
  }
};
