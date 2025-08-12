import mongoose, { Schema, models, model } from 'mongoose';

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  autoHide: { type: Boolean, default: true }
}, { timestamps: true });

export default models.Notification || model('Notification', NotificationSchema);