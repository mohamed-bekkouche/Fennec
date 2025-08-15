import app from "./app";
import connectDB from "./config/database";

const PORT = process.env.PORT || 8000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
