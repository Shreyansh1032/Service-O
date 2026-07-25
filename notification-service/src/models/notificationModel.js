import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    type: {
      type: String,
      enum: ["BOOKING_CONFIRMED"],
      required: true,
    },
    recipientEmail: { type: String, required: true },
    status: {
      type: String,
      enum: ["SENT", "FAILED"],
      required: true,
    },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);