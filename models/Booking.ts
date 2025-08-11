import mongoose, { Schema, models, model } from 'mongoose';

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courtId: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export default models.Booking || model('Booking', BookingSchema);
