import { movieSchema } from "../validators/movieValidator.js";
import {
  createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie
} from "../services/movieService.js";
import AppError from "../utils/AppError.js";

// genre/language arrive as JSON strings in multipart form-data (e.g. '["Action","Drama"]')
const parseArrayFields = (body) => {
  const parsed = { ...body };
  ["genre", "language"].forEach((field) => {
    if (typeof parsed[field] === "string") {
      try {
        parsed[field] = JSON.parse(parsed[field]);
      } catch {
        parsed[field] = [parsed[field]]; // fallback: single value sent as plain string
      }
    }
  });
  return parsed;
};

export const create = async (req, res, next) => {
  try {
    const data = movieSchema.parse(parseArrayFields(req.body));

    if (req.file) {
      data.poster = req.file.location; // multer-s3 gives the public URL here
    }

    const movie = await createMovie(data);

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: movie,
    });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = movieSchema.partial().parse(parseArrayFields(req.body));

    if (req.file) {
      data.poster = req.file.location;
    }

    const movie = await updateMovie(req.params.id, data);

    res.json({
      success: true,
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (err) {
    next(err);
  }
};

export { getAllMovies as _unused } from "../services/movieService.js"; 


export const getAll = async (req, res, next) => {
    try {

        const movies = await getAllMovies();

        res.json({
            success: true,
            data: movies
        });

    } catch (err) {
        next(err);
    }
};

export const getById = async (req, res, next) => {
    try {

        const movie = await getMovieById(req.params.id);

        res.json({
            success: true,
            data: movie
        });

    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    try {

        await deleteMovie(req.params.id);

        res.json({
            success: true,
            message: "Movie deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};