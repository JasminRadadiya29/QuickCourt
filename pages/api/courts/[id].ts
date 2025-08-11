import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Court from '@/models/Court';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    const court = await Court.findById(id);
    return res.status(200).json(court);
  }

  if (req.method === 'PUT') {
    const court = await Court.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(court);
  }

  if (req.method === 'DELETE') {
    await Court.findByIdAndDelete(id);
    return res.status(204).end();
  }

  return res.status(405).end();
}
