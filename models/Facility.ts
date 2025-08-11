import mongoose, { Schema, models, model } from 'mongoose';

const FacilitySchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: String,
  state: String,
  zipCode: String,
  description: String,
  amenities: [String],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  images: [String]
}, { timestamps: true });

FacilitySchema.index({ location: '2dsphere' });

export default models.Facility || model('Facility', FacilitySchema);
