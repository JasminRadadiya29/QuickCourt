import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { requireAuth } from '@/lib/apiAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Authenticate and authorize the user
    const auth = requireAuth(req, res, ['facility_owner', 'admin']);
    if (!auth) return;

    await connectToDatabase();
    
    const ownerId = auth.userId;
    
    // Get current date and calculate start/end of month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    // Get all bookings for the current month
    const bookings = await Booking.find({
      owner: ownerId,
      date: { $gte: startDate, $lte: endDate }
    })
    .populate('user', 'name')
    .populate('court', 'name');
    
    // Format the bookings by date
    const bookingsByDate = {};
    
    bookings.forEach(booking => {
      const dateKey = booking.date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      if (!bookingsByDate[dateKey]) {
        bookingsByDate[dateKey] = [];
      }
      
      bookingsByDate[dateKey].push({
        time: `${booking.startHour}:00`,
        court: booking.court.name,
        user: booking.user.name,
        status: booking.status
      });
    });
    
    return res.status(200).json(bookingsByDate);
  } catch (error) {
    console.error('Error fetching calendar bookings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}