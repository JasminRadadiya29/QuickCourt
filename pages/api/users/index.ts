import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { role, status, q, page = '1', limit = '20' } = req.query as any;
    const filter: any = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (q) filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ];
    const pageNum = parseInt(page, 10) || 1;
    const pageSize = Math.min(parseInt(limit, 10) || 20, 100);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .select('-passwordHash');
    const total = await User.countDocuments(filter);
    return res.status(200).json({ data: users, page: pageNum, total });
  }

  return res.status(405).end();
}


