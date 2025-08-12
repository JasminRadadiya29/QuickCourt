import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Court from '@/models/Court';
import Facility from '@/models/Facility';
import { requireAuth, ensureRole } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    try {
      const court = await Court.findById(id);
      if (!court) {
        return res.status(404).json({ error: 'Court not found' });
      }
      return res.status(200).json(court);
    } catch (error) {
      console.error(`Error fetching court with id ${id}:`, error);
      return res.status(500).json({ error: 'Failed to fetch court' });
    }
  }

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    const existing = await Court.findById(id);
    if (!existing) return res.status(404).json({ error: 'Court not found' });
    const facility = await Facility.findById(existing.venue);
    const isOwner = facility && facility.owner.toString() === auth.userId;
    if (!(isOwner || ensureRole(auth, ['admin']))) return res.status(403).json({ error: 'Forbidden' });
    
    // Prepare update data
    const updateData = { ...req.body };
    
    // Only admins can modify the approved status
    if (!ensureRole(auth, ['admin'])) {
      // For non-admins, remove the approved field if they try to set it
      delete updateData.approved;
    }
    
    const court = await Court.findByIdAndUpdate(id, updateData, { new: true });
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
