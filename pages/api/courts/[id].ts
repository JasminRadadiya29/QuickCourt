import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Court from '@/models/Court';
import Facility from '@/models/Facility';
import { requireAuth, ensureRole } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    const court = await Court.findById(id);
    return res.status(200).json(court);
  }

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    const existing = await Court.findById(id);
    if (!existing) return res.status(404).json({ error: 'Court not found' });
    const facility = await Facility.findById(existing.venue);
    const isOwner = facility && facility.owner.toString() === auth.userId;
    if (!(isOwner || ensureRole(auth, ['admin']))) return res.status(403).json({ error: 'Forbidden' });
    const court = await Court.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(court);
  }

  if (req.method === 'DELETE') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    const existing = await Court.findById(id);
    if (!existing) return res.status(404).json({ error: 'Court not found' });
    const facility = await Facility.findById(existing.venue);
    const isOwner = facility && facility.owner.toString() === auth.userId;
    if (!(isOwner || ensureRole(auth, ['admin']))) return res.status(403).json({ error: 'Forbidden' });
    await Court.findByIdAndDelete(id);
    return res.status(204).end();
  }

  return res.status(405).end();
}
