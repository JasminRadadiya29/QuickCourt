import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { requireAuth } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = requireAuth(req, res);
  if (!auth) return;

  const { id } = req.query as { id: string };
  
  try {
    await connectToDatabase();
    
    // Find the booking
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Check if user is authorized to cancel this booking
    // Allow if user is the booking owner or the facility owner
    if (booking.user.toString() !== auth.userId && booking.owner.toString() !== auth.userId) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }
    
    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel a completed booking' });
    }
    
    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();
    
    return res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ error: 'Failed to cancel booking' });
  }
}