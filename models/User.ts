import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'facility_owner', 'admin'], default: 'user' },
  avatar: { type: String },
  isVerified: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'banned'], default: 'active' }
}, { timestamps: true });

export default models.User || model('User', UserSchema);
