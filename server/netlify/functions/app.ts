import type { IncomingMessage, ServerResponse } from "http";
import app from "../../src/app";
import connectDB from "../../src/config/database";

// Tip: cache the DB connection inside connectDB() to avoid reconnecting every request
export async function handler(req: IncomingMessage, res: ServerResponse) {
  await connectDB();
  (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(
    req,
    res
  );
}
