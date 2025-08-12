import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Facility from '@/models/Facility';
import User from '@/models/User';
import { requireAuth, ensureRole } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = requireAuth(req, res);
  if (!auth) return;
  
  // Ensure the user is an admin
  if (!ensureRole(auth, ['admin'])) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await connectToDatabase();

  try {
    const { page = '1', size = '10', q } = req.query as { page?: string; size?: string; q?: string };
    
    // Parse pagination parameters
    const pageNum = parseInt(page, 10);
    const sizeNum = parseInt(size, 10);
    const skip = (pageNum - 1) * sizeNum;
    
    // Build query for pending facilities
    let query: any = { approved: false };
    
    // Add search functionality if q parameter is provided
    if (q) {
      query = {
        ...query,
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { address: { $regex: q, $options: 'i' } }
        ]
      };
    }
    
    // Get total count for pagination
    const total = await Facility.countDocuments(query);
    
    // Fetch pending facilities with pagination
    const facilities = await Facility.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(sizeNum)
      .populate('owner', 'name email');
    
    // Format the response according to the required structure
    const venues = facilities.map(facility => ({
      _id: facility._id,
      name: facility.name,
      approvalStatus: 'pending',
      photos: facility.photos?.map(photo => {
        // Convert Buffer to base64 string if needed
        const photoData = photo.data instanceof Buffer 
          ? `data:${photo.contentType};base64,${photo.data.toString('base64')}` 
          : null;
        return photoData;
      }) || [],
      owner: {
        id: facility.owner._id,
        name: facility.owner.name,
        email: facility.owner.email
      },
      submittedAt: facility.createdAt
    }));
    
    return res.status(200).json({
      venues,
      pagination: {
        page: pageNum,
        size: sizeNum,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching pending venues:', error);
    return res.status(500).json({ error: 'Failed to fetch pending venues' });
  }
}