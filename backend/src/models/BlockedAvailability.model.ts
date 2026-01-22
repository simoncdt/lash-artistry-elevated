import mongoose, { Schema, Document } from "mongoose";

export interface IBlockedAvailability extends Document {
  date: Date;
  reason?: string;
  allDay: boolean;
  startTime?: string;     // format "HH:mm"
  endTime?: string;       // format "HH:mm"
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BlockedAvailabilitySchema: Schema = new Schema(
  {
    date: { type: Date, required: true, index: true },
    reason: { type: String, trim: true },
    allDay: { type: Boolean, default: true },
    startTime: { type: String },
    endTime: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

// Empêcher doublons sur la même date (si allDay) ou même plage horaire
BlockedAvailabilitySchema.index(
  { date: 1, allDay: 1 },
  { unique: true, partialFilterExpression: { allDay: true } }
);

export default mongoose.model<IBlockedAvailability>(
  "BlockedAvailability",
  BlockedAvailabilitySchema
);