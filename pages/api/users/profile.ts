import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Booking from '@/models/Booking';
import { requireAuth } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    
    try {
      // Get user data
      const user = await User.findById(auth.userId).select('-passwordHash');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get booking count
      const bookingCount = await Booking.countDocuments({ user: auth.userId });
      
      // Format the response
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        avatar: user.avatar || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isVerified: user.isVerified,
        bookingCount: bookingCount
      };
      
      return res.status(200).json(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    
    try {
      const { name, phone, avatar } = req.body;
      
      // Update only allowed fields
      const updateData: any = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (avatar) updateData.avatar = avatar;
      
      const updatedUser = await User.findByIdAndUpdate(
        auth.userId,
        updateData,
        { new: true }
      ).select('-passwordHash');
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ error: 'Failed to update user profile' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}