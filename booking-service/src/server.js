import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { startBookingExpiryJob } from "./services/bookingExpiryJob.js";

connectDB();
startBookingExpiryJob();

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Booking Service running on ${PORT}`);
});