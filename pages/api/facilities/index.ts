import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Facility from '@/models/Facility';
import { requireAuth, ensureRole } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database successfully');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  if (req.method === 'GET') {
    const { approved, owner, q, page = '1', limit = '20' } = req.query as any;
    const filter: any = {};
    if (approved !== undefined) filter.approved = approved === 'true';
    if (owner) filter.owner = owner;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const pageNum = parseInt(page, 10) || 1;
    const pageSize = Math.min(parseInt(limit, 10) || 20, 100);
    const facilities = await Facility.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    const total = await Facility.countDocuments(filter);
    return res.status(200).json({ data: facilities, page: pageNum, total });
  }

  if (req.method === 'POST') {
    console.log('Received POST request to /api/facilities');
    console.log('Request body:', req.body);
    
    const auth = requireAuth(req, res);
    if (!auth) {
      console.log('Authentication failed');
      return;
    }
    
    console.log('Authentication successful:', auth);
    
    if (!ensureRole(auth, ['facility_owner', 'admin'])) {
      console.log('Role check failed:', auth.role);
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const { owner, name, address } = req.body || {};
    console.log('Extracted fields:', { owner, name, address });
    
    if (!owner || !name || !address) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'owner, name, and address are required' });
    }
    
    if (auth.role === 'facility_owner' && owner !== auth.userId) {
      console.log('Owner mismatch:', { requestOwner: owner, authUserId: auth.userId });
      return res.status(403).json({ error: 'Cannot create facility for another owner' });
    }
    
    try {
      console.log('Creating facility in database...');
      const facility = await Facility.create({ ...req.body, approved: false });
      console.log('Facility created successfully:', facility);
      return res.status(201).json(facility);
    } catch (error) {
      console.error('Failed to create facility:', error);
      return res.status(500).json({ error: 'Failed to create facility in database' });
    }
  }

  return res.status(405).end();
}
