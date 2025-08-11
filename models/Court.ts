import mongoose, { Schema, models, model } from 'mongoose';

const CourtSchema = new Schema({
  facilityId: { type: Schema.Types.ObjectId, ref: 'Facility', required: true },
  name: { type: String, required: true },
  sport: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  features: [String]
}, { timestamps: true });

export default models.Court || model('Court', CourtSchema);
