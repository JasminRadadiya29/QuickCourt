import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Court from '@/models/Court';
import Facility from '@/models/Facility';
import { requireAuth, ensureRole } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { venue, sport } = req.query as any;
    const filter: any = {};
    if (venue) filter.venue = venue;
    if (sport) filter.sport = sport;
    const courts = await Court.find(filter).sort({ createdAt: -1 }).limit(200);
    return res.status(200).json(courts);
  }

  if (req.method === 'POST') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    if (!ensureRole(auth, ['facility_owner', 'admin'])) return res.status(403).json({ error: 'Forbidden' });
    const { venue, name, sport, pricePerHour } = req.body || {};
    if (!venue || !name || !sport || pricePerHour == null) {
      return res.status(400).json({ error: 'venue, name, sport, pricePerHour are required' });
    }
    const facility = await Facility.findById(venue);
    if (!facility) return res.status(404).json({ error: 'Venue not found' });
    const isOwner = facility.owner.toString() === auth.userId;
    if (!(isOwner || ensureRole(auth, ['admin']))) return res.status(403).json({ error: 'Forbidden' });
    const court = await Court.create(req.body);
    return res.status(201).json(court);
  }

  return res.status(405).end();
}
