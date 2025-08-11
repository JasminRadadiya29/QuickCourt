import mongoose, { Schema, models, model } from 'mongoose';

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  facilityId: { type: Schema.Types.ObjectId, ref: 'Facility', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String }
}, { timestamps: true });

export default models.Review || model('Review', ReviewSchema);
