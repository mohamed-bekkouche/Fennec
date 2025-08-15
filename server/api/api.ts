// api/index.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";

// Delegate requests to your Express app
export default function handler(req: VercelRequest, res: VercelResponse) {
  return (app as any)(req, res);
}
