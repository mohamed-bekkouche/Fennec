// netlify/functions/api.ts
const serverless = require("serverless-http");

let cachedApp: any = null;

const getApp = async () => {
  if (cachedApp) return cachedApp;

  const { default: app } = await import("../../src/app");
  const { default: connectDB } = await import("../../src/config/database");

  await connectDB();
  cachedApp = app;
  return cachedApp;
};

exports.handler = async (event: any, context: any) => {
  try {
    // Pre-process the body to ensure proper parsing
    if (event.body) {
      // If body is base64 encoded, decode it first
      if (event.isBase64Encoded) {
        event.body = Buffer.from(event.body, "base64").toString("utf-8");
      }

      // If it's a JSON string, keep it as string for Express to parse
      const contentType =
        event.headers["content-type"] || event.headers["Content-Type"] || "";
      if (contentType.includes("application/json")) {
        // Make sure it's a string, not already parsed
        if (typeof event.body === "object") {
          event.body = JSON.stringify(event.body);
        }
      }
    }

    const app = await getApp();
    const handler = serverless(app, {
      // Configure serverless-http to handle bodies properly
      binary: false,
      request: (request: any, event: any) => {
        // Ensure proper content-type handling
        if (event.headers["content-type"]) {
          request.headers["content-type"] = event.headers["content-type"];
        }
      },
    });

    const result = await handler(event, context);
    return result;
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Function error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
