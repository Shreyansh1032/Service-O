import mongoose from "mongoose";

const screenSchema = new mongoose.Schema(
    {
        theatre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Theatre",
            required: true,
        },

        screenNumber: {
            type: Number,
            required: true,
        },

        screenName: {
            type: String,
            default: "",
        },

        totalRows: {
            type: Number,
            required: true,
        },

        seatsPerRow: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Screen", screenSchema);