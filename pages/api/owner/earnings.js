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
    
    // Get current date
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Calculate monthly earnings
    const monthlyEarnings = [];
    for (let i = 0; i < 12; i++) {
      const month = (currentMonth - i + 12) % 12;
      const year = currentYear - Math.floor((i - currentMonth) / 12);
      
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const bookings = await Booking.find({
        owner: ownerId,
        date: { $gte: startDate, $lte: endDate },
        status: 'confirmed'
      });
      
      const earnings = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      monthlyEarnings.unshift({
        name: monthNames[month],
        earnings: earnings,
        target: earnings * 1.2 // Setting target as 20% more than actual earnings for demo
      });
    }
    
    // Calculate quarterly earnings
    const quarterlyEarnings = [];
    for (let i = 0; i < 4; i++) {
      const quarterStartMonth = (currentMonth - (i * 3) + 12) % 12;
      const year = currentYear - Math.floor((i * 3 - currentMonth) / 12);
      
      const startDate = new Date(year, quarterStartMonth - (quarterStartMonth % 3), 1);
      const endMonth = (quarterStartMonth - (quarterStartMonth % 3) + 2) % 12;
      const endYear = year + Math.floor((endMonth - quarterStartMonth) / 12);
      const endDate = new Date(endYear, endMonth + 1, 0);
      
      const bookings = await Booking.find({
        owner: ownerId,
        date: { $gte: startDate, $lte: endDate },
        status: 'confirmed'
      });
      
      const earnings = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
      const quarterIndex = Math.floor(quarterStartMonth / 3);
      
      quarterlyEarnings.unshift({
        name: `${quarterNames[quarterIndex]} ${year}`,
        earnings: earnings,
        target: earnings * 1.2 // Setting target as 20% more than actual earnings for demo
      });
    }
    
    return res.status(200).json({
      monthly: monthlyEarnings,
      quarterly: quarterlyEarnings
    });
  } catch (error) {
    console.error('Error fetching earnings data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}