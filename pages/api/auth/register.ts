import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  await connectToDatabase();

  const { name, email, password, role, avatar } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, passwordHash, role: role || 'user', avatar, isVerified: true });

  return res.status(201).json({ id: user._id, email: user.email });
}


