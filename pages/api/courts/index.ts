import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Court from '@/models/Court';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const courts = await Court.find({}).limit(50);
    return res.status(200).json(courts);
  }

  if (req.method === 'POST') {
    const court = await Court.create(req.body);
    return res.status(201).json(court);
  }

  return res.status(405).end();
}
