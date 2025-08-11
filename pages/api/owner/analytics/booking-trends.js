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
        owner: ownerId,
        date: { $gte: date, $lt: nextDate },
        status: { $in: ['confirmed', 'pending'] }
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
        owner: ownerId,
        date: { $gte: startDate, $lt: endDate },
        status: { $in: ['confirmed', 'pending'] }
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
        owner: ownerId,
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ['confirmed', 'pending'] }
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