import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Facility from '@/models/Facility';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const facilities = await Facility.find({}).limit(50);
    return res.status(200).json(facilities);
  }

  if (req.method === 'POST') {
    const facility = await Facility.create(req.body);
    return res.status(201).json(facility);
  }

  return res.status(405).end();
}
