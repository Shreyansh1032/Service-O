import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Screen",
    },

    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },

    row: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["REGULAR", "PREMIUM", "RECLINER"],
      default: "REGULAR",
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "LOCKED", "BOOKED"],
      default: "AVAILABLE",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

seatSchema.index({ screenId: 1, seatNumber: 1 }, { unique: true });

export default mongoose.model("Seat", seatSchema);