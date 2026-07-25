import Seat from "../models/seatModel.js";
import {
  acquireSeatLocks,
  releaseSeatLocks,
  getExpiredLockedSeatIds,
} from "../utils/seatLock.js";


const reconcileExpiredLocks = async (seats) => {
  const lockedIds = seats.filter((s) => s.status === "LOCKED").map((s) => s._id.toString());
  if (lockedIds.length === 0) return seats;

  const expiredIds = await getExpiredLockedSeatIds(lockedIds);
  if (expiredIds.length === 0) return seats;

  await Seat.updateMany(
    { _id: { $in: expiredIds }, status: "LOCKED" },
    { status: "AVAILABLE" }
  );

  return seats.map((s) =>
    expiredIds.includes(s._id.toString())
      ? { ...(s.toObject ? s.toObject() : s), status: "AVAILABLE" }
      : s
  );
};

export const getSeatsByScreen = async (screenId) => {
  const seats = await Seat.find({ screenId });
  return reconcileExpiredLocks(seats);
};

export const getSeatDetails = async (seatIds) => {
  const seats = await Seat.find({ _id: { $in: seatIds } });
  return reconcileExpiredLocks(seats);
};


export const lockSeats = async (seatIds, bookingId) => {

  const currentSeats = await Seat.find({ _id: { $in: seatIds } });
  await reconcileExpiredLocks(currentSeats);

  const acquired = await acquireSeatLocks(seatIds, bookingId);

  if (!acquired) {
    return { locked: false, modifiedCount: 0 };
  }

  const result = await Seat.updateMany(
    { _id: { $in: seatIds }, status: "AVAILABLE" },
    { status: "LOCKED" }
  );

  if (result.modifiedCount !== seatIds.length) {
    await releaseSeatLocks(seatIds);

    await Seat.updateMany(
      { _id: { $in: seatIds }, status: "LOCKED" },
      { status: "AVAILABLE" }
    );

    return { locked: false, modifiedCount: 0 };
  }

  return { locked: true, modifiedCount: result.modifiedCount };
};

export const unlockSeats = async (seatIds) => {
  await releaseSeatLocks(seatIds);
  return await Seat.updateMany(
    { _id: { $in: seatIds }, status: "LOCKED" },
    { status: "AVAILABLE" }
  );
};

export const bookSeats = async (seatIds) => {
  const result = await Seat.updateMany(
    { _id: { $in: seatIds }, status: "LOCKED" },
    { status: "BOOKED" }
  );
  await releaseSeatLocks(seatIds); // permanent now, no need for the TTL lock
  return result;
};

export const releaseSeats = async (seatIds) => {
  await releaseSeatLocks(seatIds); // no-op if already gone, harmless
  return await Seat.updateMany(
    { _id: { $in: seatIds }, status: "BOOKED" },
    { status: "AVAILABLE" }
  );
};


export const createSeat = async (data) => {
  return await Seat.create(data);
};

export const getAllSeats = async () => {
  return await Seat.find();
};

export const getSeatById = async (id) => {
  return await Seat.findById(id);
};

export const updateSeat = async (id, data) => {
  return await Seat.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteSeat = async (id) => {
  return await Seat.findByIdAndDelete(id);
};

export const generateSeats = async (screenId, rows, columns) => {
  const seats = [];
  for (let i = 0; i < rows; i++) {
    const rowLetter = String.fromCharCode(65 + i);
    for (let j = 1; j <= columns; j++) {
      let type = "REGULAR";
      if (i < 2) type = "PREMIUM";
      if (i >= rows - 2) type = "RECLINER";
      let price = 250;
      if (type === "PREMIUM") price = 400;
      if (type === "RECLINER") price = 600;
      seats.push({
        screenId,
        seatNumber: `${rowLetter}${j}`,
        row: rowLetter,
        type,
        price,
        status: "AVAILABLE",
      });
    }
  }
  return await Seat.insertMany(seats);
};
