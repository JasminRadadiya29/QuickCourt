import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { requireAuth } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = requireAuth(req, res);
  if (!auth) return;

  try {
    await connectToDatabase();
    
    // Get all bookings for the authenticated user
    const bookings = await Booking.find({
      user: auth.userId
    })
      .sort({ date: -1, startHour: -1 }) // Sort by date and time, newest first
      .populate('venue', 'name')
      .populate('court', 'name');
    
    // Format the response according to the requirements
    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      venue: {
        name: booking.venue.name,
        id: booking.venue._id
      },
      court: {
        name: booking.court.name,
        id: booking.court._id
      },
      date: booking.date,
      startHour: booking.startHour,
      endHour: booking.endHour,
      totalPrice: booking.totalPrice,
      status: booking.status
    }));
    
    return res.status(200).json({ bookings: formattedBookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}