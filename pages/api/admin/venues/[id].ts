import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Facility from '@/models/Facility';
import Court from '@/models/Court';
import Booking from '@/models/Booking';
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
    const { id } = req.query as { id: string };
    
    // Fetch the facility with owner details
    const facility = await Facility.findById(id).populate('owner', 'name email');
    
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    
    // Fetch courts for this facility
    const courts = await Court.find({ venue: id });
    
    // Fetch recent bookings for this facility
    const recentBookings = await Booking.find({ venue: id })
      .sort({ date: -1, startHour: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('court', 'name');
    
    // Format photos
    const photos = facility.photos?.map(photo => {
      // Convert Buffer to base64 string if needed
      const photoData = photo.data instanceof Buffer 
        ? `data:${photo.contentType};base64,${photo.data.toString('base64')}` 
        : null;
      return photoData;
    }) || [];
    
    // Format the response according to the required structure
    const response = {
      facility: {
        _id: facility._id,
        name: facility.name,
        description: facility.description || '',
        address: facility.address,
        photos,
        owner: {
          id: facility.owner._id,
          name: facility.owner.name,
          email: facility.owner.email
        },
        courts: courts.map(court => ({
          id: court._id,
          name: court.name,
          sportType: court.sport,
          pricePerHour: court.pricePerHour
        })),
        recentBookings: recentBookings.map(booking => ({
          id: booking._id,
          user: {
            id: booking.user._id,
            name: booking.user.name
          },
          court: booking.court.name,
          date: booking.date,
          status: booking.status
        }))
      }
    };
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching facility details:', error);
    return res.status(500).json({ error: 'Failed to fetch facility details' });
  }
}