import mongoose, { Schema, models, model } from 'mongoose';

const FacilitySchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  sports: [{ type: String }],
  amenities: [{ type: String }],
  photos: [{ 
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true }
  }],
  rating: { type: Number, default: 0, comment: 'This field is calculated from reviews' }, // Calculated from reviews
  approved: { type: Boolean, default: false },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
}, { timestamps: true });

FacilitySchema.index({ location: '2dsphere' });

export default models.Facility || model('Facility', FacilitySchema);
