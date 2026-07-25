import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import "./config/redis.js"; 

connectDB();

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Seat Service running on ${PORT}`);
});