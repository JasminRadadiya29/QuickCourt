import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Court from '@/models/Court';
import Facility from '@/models/Facility';
import { requireAuth, ensureRole } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const { venue, sport, limit = '10', page = '1', sort = '-createdAt', approved } = req.query as any;
    const filter: any = {};
    if (venue) filter.venue = venue;
    if (sport) filter.sport = sport;
    if (approved !== undefined) filter.approved = approved === 'true';
    
    try {
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 10;
      const skip = (pageNum - 1) * limitNum;
      const sortOption = sort || '-createdAt';
      
      // Get total count for pagination
      const total = await Court.countDocuments(filter);
      
      // Get courts with pagination
      const courts = await Court.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Math.min(limitNum, 50));
      
      console.log(`Retrieved ${courts.length} courts with filter:`, filter);
      return res.status(200).json({ 
        data: courts, 
        total, 
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      });
    } catch (error) {
      console.error('Error fetching courts:', error);
      return res.status(500).json({ error: 'Failed to fetch courts' });
    }
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
    
    // Set approved status based on user role
    const courtData = { ...req.body };
    // Only admins can create pre-approved courts
    if (ensureRole(auth, ['admin'])) {
      courtData.approved = courtData.approved !== undefined ? courtData.approved : true;
    } else {
      // For facility owners, courts require admin approval
      courtData.approved = false;
    }
    
    const court = await Court.create(courtData);
    return res.status(201).json(court);
  }

  return res.status(405).end();
}
