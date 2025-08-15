// server/api/index.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";

// Express apps are request handlers; delegate to it.
export default (req: VercelRequest, res: VercelResponse) =>
  (app as any)(req, res);
