import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { requireAuth, ensureRole } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = requireAuth(req, res);
  if (!auth) return;
  
  // Ensure the user is an admin
  if (!ensureRole(auth, ['admin'])) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await connectToDatabase();

  // Handle GET request - fetch all bookings with optional filters
  if (req.method === 'GET') {
    try {
      const { 
        status, 
        venueId, 
        courtId, 
        userId, 
        dateFrom, 
        dateTo, 
        page = '1', 
        size = '10' 
      } = req.query as { 
        status?: string; 
        venueId?: string; 
        courtId?: string; 
        userId?: string; 
        dateFrom?: string; 
        dateTo?: string; 
        page?: string; 
        size?: string; 
      };
      
      // Build filter object based on query parameters
      const filter: any = {};
      if (status) filter.status = status;
      if (venueId) filter.venue = venueId;
      if (courtId) filter.court = courtId;
      if (userId) filter.user = userId;
      
      // Date range filtering
      if (dateFrom || dateTo) {
        filter.date = {};
        if (dateFrom) filter.date.$gte = dateFrom;
        if (dateTo) filter.date.$lte = dateTo;
      }
      
      // Pagination
      const pageNum = parseInt(page, 10);
      const sizeNum = parseInt(size, 10);
      const skip = (pageNum - 1) * sizeNum;
      
      // Get total count for pagination
      const total = await Booking.countDocuments(filter);
      
      // Fetch bookings with pagination and populate references
      const bookings = await Booking.find(filter)
        .sort({ date: -1, startHour: -1 })
        .skip(skip)
        .limit(sizeNum)
        .populate('user', 'name email')
        .populate('venue', 'name')
        .populate('court', 'name')
        .lean();
      
      // Format the response according to the required structure
      const formattedBookings = bookings.map(booking => ({
        _id: booking._id,
        venue: {
          id: booking.venue._id,
          name: booking.venue.name
        },
        court: {
          id: booking.court._id,
          name: booking.court.name
        },
        user: {
          id: booking.user._id,
          name: booking.user.name
        },
        date: booking.date,
        startHour: booking.startHour,
        endHour: booking.endHour,
        totalPrice: booking.totalPrice,
        status: booking.status
      }));
      
      return res.status(200).json({
        bookings: formattedBookings,
        pagination: {
          page: pageNum,
          size: sizeNum,
          total
        }
      });
    } catch (error) {
      console.error('Error fetching admin bookings:', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }
  
  // Handle PATCH request - mark booking as completed
  // This endpoint is deprecated, use /api/admin/bookings/[id]/status instead
  if (req.method === 'PATCH') {
    return res.status(308).json({ 
      error: 'This endpoint is deprecated', 
      message: 'Please use /api/admin/bookings/[id]/status instead' 
    });
  }
}