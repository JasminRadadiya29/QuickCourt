import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Facility from '@/models/Facility';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    const facility = await Facility.findById(id);
    return res.status(200).json(facility);
  }

  if (req.method === 'PUT') {
    const facility = await Facility.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(facility);
  }

  if (req.method === 'DELETE') {
    await Facility.findByIdAndDelete(id);
    return res.status(204).end();
  }

  return res.status(405).end();
}
