import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Facility from '@/models/Facility';
import { requireAuth, ensureRole } from '@/lib/apiAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Authenticate and authorize the user
    const auth = requireAuth(req, res);
    if (!auth) return;
    
    // Ensure the user is a facility owner or admin
    if (!ensureRole(auth, ['facility_owner', 'admin'])) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await connectToDatabase();
    
    const ownerId = auth.userId;
    
    // Get owner's facilities
    const facilities = await Facility.find({ owner: ownerId });
    const facilityIds = facilities.map(facility => facility._id);
    
    if (facilityIds.length === 0) {
      return res.status(404).json({ message: 'No facilities found for this owner' });
    }
    
    // Get all bookings for the owner's facilities
    const bookings = await Booking.find({
      venue: { $in: facilityIds },
    })
    .sort({ date: -1, startHour: -1 })
    .populate('user', 'name email')
    .populate('venue', 'name')
    .populate('court', 'name');
    
    // Format bookings data
    const formattedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      user: {
        name: booking.user.name,
        email: booking.user.email
      },
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
      status: booking.status,
      createdAt: booking.createdAt
    }));
    
    return res.status(200).json(formattedBookings);
  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}