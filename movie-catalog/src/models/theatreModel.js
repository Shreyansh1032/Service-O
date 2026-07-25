import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        city: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        totalScreens: {
            type: Number,
            required: true,
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Theatre", theatreSchema);