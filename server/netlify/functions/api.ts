// netlify/functions/api.ts
import serverless from "serverless-http";
import app from "../../src/app";
import connectDB from "../../src/config/database";

// cache DB connection across invocations
let dbReady: Promise<unknown> | null = null;
function ensureDB() {
  if (!dbReady) dbReady = connectDB();
  return dbReady;
}

const expressHandler = serverless(app);

// Netlify handler signature: (event, context) => Promise<ResponseLike>
export const handler = async (event: any, context: any) => {
  await ensureDB();
  return expressHandler(event, context);
};
