import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const bookings = await Booking.find({}).limit(50);
    return res.status(200).json(bookings);
  }

  if (req.method === 'POST') {
    const booking = await Booking.create(req.body);
    return res.status(201).json(booking);
  }

  return res.status(405).end();
}
