import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  name: string;
  service: string;
  rating: number;
  text: string;
  date: Date;
  helpful: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    service: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    helpful: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema);