import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Notification Service running on ${PORT}`);
});