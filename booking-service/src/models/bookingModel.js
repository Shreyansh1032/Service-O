import mongoose from "mongoose";

const seatSnapshotSchema = new mongoose.Schema(
  {
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
      index: true,
    },

    seatIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true,
      },
    ],

    seatSnapshot: {
      type: [seatSnapshotSchema],
      default: [],
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    bookingStatus: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "CANCELLED",
        "EXPIRED",
      ],
      default: "PENDING",
    },

    paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "SUCCESS",
        "FAILED",
        "REFUNDED",
      ],
      default: "PENDING",
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ userId: 1, createdAt: -1 });

bookingSchema.index({ bookingStatus: 1 });

bookingSchema.index({ paymentStatus: 1 });

bookingSchema.index({ expiresAt: 1 });

export default mongoose.model("Booking", bookingSchema);