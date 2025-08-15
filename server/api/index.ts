// api/index.ts
import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/app";
import connectDB from "../src/config/database";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  await connectDB();
  // Express apps are request handlers; call it directly
  (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(
    req,
    res
  );
}
