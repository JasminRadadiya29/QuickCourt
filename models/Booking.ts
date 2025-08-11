import mongoose, { Schema, models, model } from 'mongoose';

const BookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  venue: { type: Schema.Types.ObjectId, ref: 'Facility', required: true, index: true },
  court: { type: Schema.Types.ObjectId, ref: 'Court', required: true, index: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  startHour: { type: String, required: true }, // HH:mm
  endHour: { type: String, required: true },   // HH:mm
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' }
}, { timestamps: true });

BookingSchema.index({ court: 1, date: 1, startHour: 1, endHour: 1 });

export default models.Booking || model('Booking', BookingSchema);
