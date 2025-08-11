import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['user', 'facility_owner', 'admin'], default: 'user' },
  image: { type: String }
}, { timestamps: true });

export default models.User || model('User', UserSchema);
