import Show from "../models/showModel.js";
import AppError from "../utils/AppError.js";

export const createShow = async (data) => {
  const conflict = await Show.findOne({
    screen: data.screen,
    showDate: data.showDate,
    $or: [
      { startTime: { $lt: data.endTime }, endTime: { $gt: data.startTime } },
    ],
  });

  if (conflict) {
    throw new AppError("This screen is already booked for an overlapping time slot", 409);
  }

  return await Show.create(data);
};

export const getAllShows = async () => {
    return await Show.find()
        .populate("movie")
        .populate("theatre")
        .populate("screen");
};

export const getShowById = async (id) => {
    const show = await Show.findById(id)
        .populate("movie")
        .populate("theatre")
        .populate("screen");

    if (!show) {
        throw new AppError("Show not found", 404);
    }

    return show;
};

export const updateShow = async (id, data) => {
    const show = await Show.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!show) {
        throw new AppError("Show not found", 404);
    }

    return show;
};

export const deleteShow = async (id) => {
    const show = await Show.findByIdAndDelete(id);

    if (!show) {
        throw new AppError("Show not found", 404);
    }

    return show;
};

export const getShowsByMovie = async (movieId) => {
    return await Show.find({
        movie: movieId
    }).populate("movie theatre screen");
};

export const getShowsByTheatre = async (theatreId) => {
    return await Show.find({
        theatre: theatreId
    }).populate("movie theatre screen");
};

export const getShowsByScreen = async (screenId) => {
    return await Show.find({
        screen: screenId
    }).populate("movie theatre screen");
};