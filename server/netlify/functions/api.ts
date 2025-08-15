// netlify/functions/api.ts
import serverless from "serverless-http";

export const handler = async (event: any, context: any) => {
  const { default: app } = await import("../../src/app");
  const { default: connectDB } = await import("../../src/config/database");
  await connectDB();

  // ✅ let serverless-http decode these encodings from base64
  const expressHandler = serverless(app, {
    binary: [
      "application/x-www-form-urlencoded",
      "multipart/form-data",
      "text/plain",
    ],
  });

  return expressHandler(event, context);
};
