import Theatre from "../models/theatreModel.js";

export const createTheatre = async (data) => {
    return await Theatre.create(data);
};

export const getAllTheatres = async () => {
    return await Theatre.find();
};

export const getTheatreById = async (id) => {
    const theatre = await Theatre.findById(id);

    if (!theatre) {
        throw new Error("Theatre not found");
    }

    return theatre;
};

export const updateTheatre = async (id, data) => {
    const theatre = await Theatre.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!theatre) {
        throw new Error("Theatre not found");
    }

    return theatre;
};

export const deleteTheatre = async (id) => {
    const theatre = await Theatre.findByIdAndDelete(id);

    if (!theatre) {
        throw new Error("Theatre not found");
    }

    return theatre;
};