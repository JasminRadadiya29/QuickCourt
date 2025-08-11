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
    
    // Get active bookings for the authenticated user
    // Active bookings are those with status 'confirmed' and date >= today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    
    const activeBookings = await Booking.find({
      user: auth.userId,
      status: 'confirmed',
      date: { $gte: today }
    })
      .sort({ date: 1, startHour: 1 }) // Sort by date and start time
      .limit(5) // Limit to next 5 bookings
      .populate('court')
      .populate('venue');
    
    // Return the first active booking (next upcoming)
    return res.status(200).json(activeBookings[0] || null);
  } catch (error) {
    console.error('Error fetching active booking:', error);
    return res.status(500).json({ error: 'Failed to fetch active booking' });
  }
}