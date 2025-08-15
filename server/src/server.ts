import app from "./app";
import connectDB from "./config/database";

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB(); // Make sure this caches a single connection
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
})();
