import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the user session - using custom auth instead of NextAuth
    // const session = await getServerSession(req, res, authOptions);
    
    // For now, we'll use a simple auth check - you may want to implement proper session management
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectToDatabase();
    
    // Extract user ID from token - you'll need to implement proper JWT verification
    const token = authHeader.split(' ')[1];
    // const ownerId = verifyToken(token).userId; // Implement this function
    const ownerId = 'temp-owner-id'; // Temporary placeholder
    
    const now = new Date();
    
    // Get upcoming bookings
    const upcomingBookings = await Booking.find({
      owner: ownerId,
      date: { $gte: now },
    })
    .sort({ date: 1, startHour: 1 })
    .limit(5)
    .populate('user', 'name email avatar')
    .populate('venue', 'name')
    .populate('court', 'name');
    
    // Get past bookings
    const pastBookings = await Booking.find({
      owner: ownerId,
      date: { $lt: now },
    })
    .sort({ date: -1, startHour: -1 })
    .limit(5)
    .populate('user', 'name email avatar')
    .populate('venue', 'name')
    .populate('court', 'name');
    
    // Format bookings data
    const formatBookings = (bookings) => {
      return bookings.map(booking => {
        const startTime = `${booking.startHour}:00`;
        const endTime = `${booking.endHour}:00`;
        
        return {
          id: booking._id.toString(),
          user: {
            name: booking.user.name,
            email: booking.user.email,
            avatar: booking.user.avatar || '/assets/images/default-avatar.png',
            phone: '123-456-7890' // Placeholder as phone might not be in the User model
          },
          venue: booking.venue.name,
          court: booking.court.name,
          date: booking.date.toISOString().split('T')[0],
          time: `${startTime} - ${endTime}`,
          amount: booking.totalPrice,
          status: booking.status,
          paymentStatus: booking.status === 'confirmed' ? 'paid' : 'pending'
        };
      });
    };
    
    return res.status(200).json({
      upcoming: formatBookings(upcomingBookings),
      past: formatBookings(pastBookings)
    });
  } catch (error) {
    console.error('Error fetching bookings data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}