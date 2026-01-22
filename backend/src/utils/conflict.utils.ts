import Booking from "../models/Booking.model.js";

export const hasConflict = async (
  startTime: Date,
  endTime: Date
): Promise<boolean> => {
  const conflict = await Booking.findOne({
    status: { $ne: "cancelled" },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  return !!conflict;
};
