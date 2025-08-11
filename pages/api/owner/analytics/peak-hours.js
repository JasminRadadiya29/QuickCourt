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
    
    // Get bookings for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const bookings = await Booking.find({
      owner: ownerId,
      date: { $gte: thirtyDaysAgo },
      status: { $in: ['confirmed', 'pending'] }
    });
    
    // Initialize hours array (6 AM to 10 PM)
    const peakHoursData = [];
    for (let hour = 6; hour <= 22; hour++) {
      peakHoursData.push({
        hour: `${hour} ${hour < 12 ? 'AM' : 'PM'}`.replace('12 AM', '12 PM').replace('12 PM', '12 PM'),
        bookings: 0
      });
    }
    
    // Count bookings for each hour
    bookings.forEach(booking => {
      const startHour = booking.startHour;
      if (startHour >= 6 && startHour <= 22) {
        const index = startHour - 6;
        peakHoursData[index].bookings += 1;
      }
    });
    
    return res.status(200).json(peakHoursData);
  } catch (error) {
    console.error('Error fetching peak hours data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}