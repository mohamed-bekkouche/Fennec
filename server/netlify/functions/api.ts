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
    console.log("🚀 Function called - Method:", event.httpMethod);
    console.log("🚀 Function called - Path:", event.path);
    console.log("🚀 Function called - Body:", event.body);
    console.log("🚀 Function called - isBase64Encoded:", event.isBase64Encoded);

    const app = await getApp();

    // Try with different serverless-http configuration
    const handler = serverless(app, {
      // Don't specify binary at all, let it handle automatically
      provider: "aws",
      // Add request transformation
      request: (request: any, event: any, context: any) => {
        // Log what's being passed to Express
        console.log("🔄 Request transformation - Body:", request.body);
        console.log("🔄 Request transformation - Headers:", request.headers);
      },
    });

    const result = await handler(event, context);
    console.log("✅ Function result status:", result.statusCode);
    return result;
  } catch (error) {
    console.error("❌ Function error:", error);
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
