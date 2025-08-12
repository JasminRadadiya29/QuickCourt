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
    const { approved, owner, q, page = '1', limit = '20', sort = '-createdAt' } = req.query as any;
    const filter: any = {};
    if (approved !== undefined) filter.approved = approved === 'true';
    if (owner) filter.owner = owner;
    if (q) filter.name = { $regex: q, $options: 'i' };
    
    const pageNum = parseInt(page, 10) || 1;
    const pageSize = Math.min(parseInt(limit, 10) || 20, 100);
    const sortOption = sort || '-createdAt';
    
    try {
      const facilities = await Facility.find(filter)
        .sort(sortOption)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize);
      
      const total = await Facility.countDocuments(filter);
      console.log(`Retrieved ${facilities.length} facilities with filter:`, filter);
      return res.status(200).json({ data: facilities, page: pageNum, total });
    } catch (error) {
      console.error('Error fetching facilities:', error);
      return res.status(500).json({ error: 'Failed to fetch facilities' });
    }
  }

  if (req.method === 'POST') {
    console.log('Received POST request to /api/facilities');
    
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
    
    const { owner, name, address, photos, ...otherFields } = req.body || {};
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
      
      // Process photos if they exist
      let processedPhotos = [];
      if (photos && Array.isArray(photos)) {
        processedPhotos = photos.map(photo => {
          // Check if photo is already in the correct format
          if (photo.data && photo.contentType) {
            return photo;
          }
          
          // If it's a base64 string, convert it to Buffer
          if (typeof photo === 'string' && photo.includes('base64')) {
            const matches = photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const contentType = matches[1];
              const buffer = Buffer.from(matches[2], 'base64');
              return { data: buffer, contentType };
            }
          }
          
          return null;
        }).filter(photo => photo !== null);
      }
      
      const facility = await Facility.create({ 
        ...otherFields,
        owner,
        name,
        address,
        photos: processedPhotos,
        approved: false 
      });
      
      console.log('Facility created successfully:', facility);
      return res.status(201).json(facility);
    } catch (error) {
      console.error('Failed to create facility:', error);
      return res.status(500).json({ error: 'Failed to create facility in database' });
    }
  }

  return res.status(405).end();
}
