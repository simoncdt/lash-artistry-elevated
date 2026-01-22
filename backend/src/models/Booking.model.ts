import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  serviceSlug: string;
  serviceName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  startTime: Date;
  endTime: Date;
  status: "pending" | "payment_proof_submitted" | "validated" | "cancelled"|"completed";
  paymentProof?: string;           // Chemin ex: "/uploads/proofs/xxx.jpg"
  paymentAmountReceived?: number;  // Montant acompte reçu (50%)
  createdAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    serviceSlug: { type: String, required: true, index: true },
    serviceName: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "payment_proof_submitted", "validated", "cancelled","completed"],
      default: "pending",
    },
    paymentProof: { type: String },                // ← NOUVEAU
    paymentAmountReceived: { type: Number },       // ← NOUVEAU
  },
  { timestamps: true }
);

// Index pour recherche conflits
BookingSchema.index({ startTime: 1, endTime: 1 });
BookingSchema.index({ status: 1, startTime: 1 });

export default mongoose.model<IBooking>("Booking", BookingSchema);