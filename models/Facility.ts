import mongoose, { Schema, models, model } from 'mongoose';

const FacilitySchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  locationShort: { type: String },
  sports: [{ type: String }],
  amenities: [{ type: String }],
  photos: [{ type: String }],
  startingPrice: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  approved: { type: Boolean, default: false },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
}, { timestamps: true });

FacilitySchema.index({ location: '2dsphere' });

export default models.Facility || model('Facility', FacilitySchema);
