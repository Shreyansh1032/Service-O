import * as seatService from "../services/seatService.js";
import {
  createSeatSchema,
  updateSeatSchema,
  seatDetailsSchema,
  seatActionSchema,
  generateSeatsSchema,
} from "../validators/seatValidator.js";

export const createSeat = async (req, res, next) => {
  try {
    const data = createSeatSchema.parse(req.body);

    const seat = await seatService.createSeat(data);

    res.status(201).json(seat);
  } catch (err) {
    next(err);
  }
};

export const getAllSeats = async (req, res, next) => {
  try {
    const seats = await seatService.getAllSeats();

    res.json(seats);
  } catch (err) {
    next(err);
  }
};

export const getSeatById = async (req, res, next) => {
  try {
    const seat = await seatService.getSeatById(req.params.id);

    if (!seat)
      return res.status(404).json({
        message: "Seat not found",
      });

    res.json(seat);
  } catch (err) {
    next(err);
  }
};

export const updateSeat = async (req, res, next) => {
  try {
    const data = updateSeatSchema.parse(req.body);

    const seat = await seatService.updateSeat(req.params.id, data);

    if (!seat)
      return res.status(404).json({
        message: "Seat not found",
      });

    res.json(seat);
  } catch (err) {
    next(err);
  }
};

export const deleteSeat = async (req, res, next) => {
  try {
    const seat = await seatService.deleteSeat(req.params.id);

    if (!seat)
      return res.status(404).json({
        message: "Seat not found",
      });

    res.json({
      message: "Seat deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getSeatsByScreen = async (req, res, next) => {
  try {
    const seats = await seatService.getSeatsByScreen(req.params.screenId);

    res.json(seats);
  } catch (err) {
    next(err);
  }
};

export const lockSeats = async (req, res, next) => {
  try {
    const { seatIds, bookingId } = seatActionSchema.parse(req.body);
    const result = await seatService.lockSeats(seatIds, bookingId);

    if (!result.locked) {
      return res.status(409).json({
        success: false,
        message: "One or more seats are no longer available",
      });
    }

    res.json({ success: true, modified: result.modifiedCount });
  } catch (err) {
    next(err);
  }
};

export const unlockSeats = async (req, res, next) => {
  try {
    const { seatIds } = seatActionSchema.parse(req.body);

    const result = await seatService.unlockSeats(seatIds);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const bookSeats = async (req, res, next) => {
  try {
    const { seatIds } = seatActionSchema.parse(req.body);

    const result = await seatService.bookSeats(seatIds);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getSeatDetails = async (req, res, next) => {
    try {

        const { seatIds } =seatDetailsSchema.parse(req.body);

        const seats = await seatService.getSeatDetails(seatIds);

        res.json({
            success: true,
            data: seats,
        });

    } catch (err) {
        next(err);
    }
};

export const generateSeats = async (req,res,next)=>{

    try{
        const data =generateSeatsSchema.parse(req.body);
        const seats =await seatService.generateSeats(
            data.screenId,
            data.rows,
            data.columns
        );
        res.status(201).json({
            success:true,
            count:seats.length,
            data:seats
        });
    }
    catch(err){
        next(err);
    }
};

export const releaseSeats = async (req, res, next) => {
  try {

    const { seatIds } =
      seatActionSchema.parse(req.body);

    const result =
      await seatService.releaseSeats(seatIds);

    res.json({
      success: true,
      modified: result.modifiedCount,
    });

  } catch (err) {
    next(err);
  }
};