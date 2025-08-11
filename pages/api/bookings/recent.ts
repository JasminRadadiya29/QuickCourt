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
    
    // Get recent bookings for the authenticated user
    // This includes both past and upcoming bookings
    const recentBookings = await Booking.find({
      user: auth.userId
    })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(10) // Limit to 10 most recent bookings
      .populate('court')
      .populate('venue');
    
    return res.status(200).json(recentBookings);
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch recent bookings' });
  }
}