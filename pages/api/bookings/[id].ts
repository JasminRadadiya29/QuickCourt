import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { requireAuth } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    const booking = await Booking.findById(id);
    return res.status(200).json(booking);
  }

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    const { status } = req.body || {};
    // Only allow certain transitions
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (status && !allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(booking);
  }

  if (req.method === 'DELETE') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    await Booking.findByIdAndDelete(id);
    return res.status(204).end();
  }

  return res.status(405).end();
}
