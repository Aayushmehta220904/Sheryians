import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = process.env.PORT || 5001;

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET are required.");
  process.exit(1);
}

connectDatabase()
  .then(() => app.listen(port, () => console.log(`StockPilot server running on http://localhost:${port}`)))
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
