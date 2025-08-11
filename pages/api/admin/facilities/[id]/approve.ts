import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Facility from '@/models/Facility';
import { requireAuth, ensureRole } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  await connectToDatabase();

  const { id } = req.query as { id: string };
  const { approved, comment } = req.body || {};
  if (approved == null) return res.status(400).json({ error: 'approved flag required' });

  const auth = requireAuth(req, res);
  if (!auth) return;
  if (!ensureRole(auth, ['admin'])) return res.status(403).json({ error: 'Forbidden' });

  const facility = await Facility.findByIdAndUpdate(
    id,
    { approved: Boolean(approved) },
    { new: true }
  );
  if (!facility) return res.status(404).json({ error: 'Facility not found' });

  // comment could be stored in a separate moderation log if desired
  return res.status(200).json({ facility, comment });
}


