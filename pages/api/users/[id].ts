import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    const user = await User.findById(id).select('-passwordHash');
    return res.status(200).json(user);
  }

  if (req.method === 'PUT') {
    const { status, name, avatar } = req.body || {};
    const update: any = {};
    if (status) update.status = status;
    if (name) update.name = name;
    if (avatar) update.avatar = avatar;
    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-passwordHash');
    return res.status(200).json(user);
  }

  if (req.method === 'DELETE') {
    await User.findByIdAndDelete(id);
    return res.status(204).end();
  }

  return res.status(405).end();
}


