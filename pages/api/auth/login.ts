import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { signJwt } from '@/lib/jwt';

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!JWT_SECRET) return res.status(500).json({ error: 'JWT_SECRET not configured' });
  await connectToDatabase();

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.status === 'banned') return res.status(403).json({ error: 'User is banned' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  // Temporarily bypassing verification check
  // if (!user.isVerified) return res.status(403).json({ error: 'Account not verified' });

  const token = signJwt({ sub: user._id.toString(), role: user.role }, JWT_SECRET, 7 * 24 * 60 * 60);
  
  // Create user object with both id and _id to ensure compatibility
  const userResponse = { 
    id: user._id, 
    _id: user._id, // Add _id explicitly
    name: user.name, 
    email: user.email, 
    role: user.role, 
    avatar: user.avatar 
  };
  
  console.log('Login successful, returning user:', userResponse);
  return res.status(200).json({ token, user: userResponse });
}


