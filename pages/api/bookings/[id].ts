import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    const booking = await Booking.findById(id);
    return res.status(200).json(booking);
  }

  if (req.method === 'PUT') {
    const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(booking);
  }

  if (req.method === 'DELETE') {
    await Booking.findByIdAndDelete(id);
    return res.status(204).end();
  }

  return res.status(405).end();
}
