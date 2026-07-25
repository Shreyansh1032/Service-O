import Screen from "../models/screenModel.js";

export const createScreen = async (data) => {
    return await Screen.create(data);
};

export const getAllScreens = async () => {
    return await Screen.find().populate("theatre");
};

export const getScreenById = async (id) => {
    const screen = await Screen.findById(id).populate("theatre");

    if (!screen) {
        throw new Error("Screen not found");
    }

    return screen;
};

export const updateScreen = async (id, data) => {
    const screen = await Screen.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!screen) {
        throw new Error("Screen not found");
    }

    return screen;
};

export const deleteScreen = async (id) => {
    const screen = await Screen.findByIdAndDelete(id);

    if (!screen) {
        throw new Error("Screen not found");
    }

    return screen;
};

export const getScreensByTheatre = async (theatreId) => {
    return await Screen.find({
        theatre: theatreId
    });
};