import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { requireAuth, ensureRole } from '@/lib/apiAuth';
import { createAuditLog } from '@/models/AuditLog';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
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
    const { status } = req.body as { status: 'confirmed' | 'cancelled' | 'completed' };
    
    if (!status || !['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (confirmed, cancelled, or completed)' });
    }
    
    // Find the booking
    const booking = await Booking.findById(id)
      .populate('user', 'name')
      .populate('venue', 'name')
      .populate('court', 'name');
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Validate allowed transitions
    const currentStatus = booking.status;
    
    if (currentStatus === 'completed' && status !== 'completed') {
      return res.status(400).json({ error: 'Cannot change status from completed to another status' });
    }
    
    // Update the booking status
    booking.status = status;
    await booking.save();
    
    // Create audit log entry
    const details = { 
      bookingId: booking._id,
      previousStatus: currentStatus,
      newStatus: status,
      user: {
        id: booking.user._id,
        name: booking.user.name
      },
      venue: {
        id: booking.venue._id,
        name: booking.venue.name
      },
      court: {
        id: booking.court._id,
        name: booking.court.name
      },
      date: booking.date,
      startHour: booking.startHour,
      endHour: booking.endHour
    };
    
    await createAuditLog(auth, `booking_status_change_${status}`, 'booking', booking._id.toString(), details);
    
    return res.status(200).json({
      success: true,
      message: 'Status updated',
      booking: {
        _id: booking._id,
        status: booking.status,
        user: {
          id: booking.user._id,
          name: booking.user.name
        },
        venue: {
          id: booking.venue._id,
          name: booking.venue.name
        },
        court: {
          id: booking.court._id,
          name: booking.court.name
        },
        date: booking.date,
        startHour: booking.startHour,
        endHour: booking.endHour,
        totalPrice: booking.totalPrice
      }
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return res.status(500).json({ error: 'Failed to update booking status' });
  }
}