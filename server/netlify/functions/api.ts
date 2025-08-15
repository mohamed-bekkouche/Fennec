// netlify/functions/api.ts
import serverless from "serverless-http";

export const handler = async (event: any, context: any) => {
  try {
    const { default: connectDB } = await import("../../src/config/database");
    const { default: app } = await import("../../src/app");

    if (process.env.SKIP_DB !== "1") {
      await connectDB(); // cached, won't reconnect each time
    }

    const expressHandler = serverless(app);
    return await expressHandler(event, context);
  } catch (err: any) {
    console.error("FUNCTION FATAL:", err?.message);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        error: "Function crashed",
        message: String(err?.message || err),
      }),
    };
  }
};
