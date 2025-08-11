import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { getOTPData, removeOTPData, cleanupExpiredOTPs } from '../../../lib/otpUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password, role, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ error: 'name, email, password, and otp are required' });
    }

    // Clean up expired OTPs first
    cleanupExpiredOTPs();

    // Verify OTP first
    const otpData = getOTPData(email);
    if (!otpData) {
      return res.status(400).json({ error: 'No OTP found for this email or OTP has expired' });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with verified status
    const user = await User.create({ 
      name, 
      email, 
      passwordHash, 
      role: role || 'user', 
      isVerified: true,
      emailVerifiedAt: new Date()
    });

    // Remove OTP after successful registration
    removeOTPData(email);

    return res.status(201).json({ 
      message: 'Registration successful',
      id: user._id, 
      email: user.email 
    });

  } catch (error) {
    console.error('Register with OTP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
