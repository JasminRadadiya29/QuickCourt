import mongoose, { Schema, models, model } from 'mongoose';

const CourtSchema = new Schema({
  venue: { type: Schema.Types.ObjectId, ref: 'Facility', required: true, index: true },
  name: { type: String, required: true },
  sport: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  openHour: { type: String, default: '06:00' },
  closeHour: { type: String, default: '22:00' },
  isAvailable: { type: Boolean, default: true },
  features: [{ type: String }]
}, { timestamps: true });

export default models.Court || model('Court', CourtSchema);
