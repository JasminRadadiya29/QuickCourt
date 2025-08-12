import { connectToDatabase } from '../../../../lib/mongodb';
import Booking from '../../../../models/Booking';
import Facility from '../../../../models/Facility';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Helper function to get all facilities owned by a user
async function getOwnerFacilities(ownerId) {
  const facilities = await Facility.find({ owner: ownerId });
  return facilities.map(facility => facility._id);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the user session
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || session.user.role !== 'owner') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectToDatabase();
    
    const ownerId = session.user.id;
    const now = new Date();
    
    // Weekly data (last 7 days)
    const weeklyData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const bookings = await Booking.find({
        venue: { $in: await getOwnerFacilities(ownerId) },
        date: { $gte: date, $lt: nextDate },
        status: 'confirmed'
      });
      
      const revenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      weeklyData.push({
        name: dayNames[date.getDay()],
        bookings: bookings.length,
        revenue: revenue
      });
    }
    
    // Monthly data (last 4 weeks)
    const monthlyData = [];
    
    for (let i = 3; i >= 0; i--) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (i * 7 + 6));
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
      
      const bookings = await Booking.find({
        venue: { $in: await getOwnerFacilities(ownerId) },
        date: { $gte: startDate, $lt: endDate },
        status: 'confirmed'
      });
      
      const revenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      monthlyData.push({
        name: `Week ${4-i}`,
        bookings: bookings.length,
        revenue: revenue
      });
    }
    
    // Yearly data (last 12 months)
    const yearlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 2; i >= 0; i--) {
      const currentMonth = now.getMonth();
      const month = (currentMonth - i + 12) % 12;
      const year = now.getFullYear() - (month > currentMonth ? 1 : 0);
      
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const bookings = await Booking.find({
        venue: { $in: await getOwnerFacilities(ownerId) },
        date: { $gte: startDate, $lte: endDate },
        status: 'confirmed'
      });
      
      const revenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      yearlyData.push({
        name: `${monthNames[month]} ${year}`,
        bookings: bookings.length,
        revenue: revenue
      });
    }
    
    return res.status(200).json({
      weekly: weeklyData,
      monthly: monthlyData,
      yearly: yearlyData
    });
  } catch (error) {
    console.error('Error fetching booking trends data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}