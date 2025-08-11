import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Facility from '@/models/Facility';
import { requireAuth, ensureRole } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    const facility = await Facility.findById(id);
    return res.status(200).json(facility);
  }

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    const facilityDoc = await Facility.findById(id);
    if (!facilityDoc) return res.status(404).json({ error: 'Facility not found' });
    const isOwner = facilityDoc.owner.toString() === auth.userId;
    if (!(isOwner || ensureRole(auth, ['admin']))) return res.status(403).json({ error: 'Forbidden' });
    const facility = await Facility.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(facility);
  }

  if (req.method === 'DELETE') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    const facilityDoc = await Facility.findById(id);
    if (!facilityDoc) return res.status(404).json({ error: 'Facility not found' });
    const isOwner = facilityDoc.owner.toString() === auth.userId;
    if (!(isOwner || ensureRole(auth, ['admin']))) return res.status(403).json({ error: 'Forbidden' });
    await Facility.findByIdAndDelete(id);
    return res.status(204).end();
  }

  return res.status(405).end();
}
