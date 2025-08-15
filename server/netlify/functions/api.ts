// netlify/functions/api.ts
import serverless from "serverless-http";

export const handler = async (event: any, context: any) => {
  const { default: app } = await import("../../src/app");
  const { default: connectDB } = await import("../../src/config/database");

  await connectDB();

  // Parse the body manually for Netlify Functions
  if (event.body && event.isBase64Encoded) {
    event.body = Buffer.from(event.body, "base64").toString();
  }

  const expressHandler = serverless(app, {
    binary: [
      "application/x-www-form-urlencoded",
      "multipart/form-data",
      "application/octet-stream",
      "image/*",
    ],
  });

  return expressHandler(event, context);
};
