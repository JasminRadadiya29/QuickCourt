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

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }
    
    // OTP is temporarily not required
    // Will be required again when OTP verification is re-implemented

    // TEMPORARILY BYPASSING OTP VERIFICATION
    // Will be implemented later
    console.log('OTP verification bypassed for development');
    
    // Clean up expired OTPs (keeping this for when verification is re-enabled)
    cleanupExpiredOTPs();

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ 
      name, 
      email, 
      passwordHash, 
      role: role || 'user',
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
