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
    
    // Process avatar if it exists
    if (avatar) {
      // Check if avatar is already in the correct format
      if (avatar.data && avatar.contentType) {
        update.avatar = avatar;
      }
      // If it's a base64 string, convert it to Buffer
      else if (typeof avatar === 'string' && avatar.includes('base64')) {
        const matches = avatar.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const contentType = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          update.avatar = { data: buffer, contentType };
        }
      }
    }
    
    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-passwordHash');
    return res.status(200).json(user);
  }

  if (req.method === 'DELETE') {
    await User.findByIdAndDelete(id);
    return res.status(204).end();
  }

  return res.status(405).end();
}


