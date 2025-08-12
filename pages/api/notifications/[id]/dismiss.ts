import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { requireAuth } from '@/lib/apiAuth';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require authentication
  const auth = requireAuth(req, res);
  if (!auth) return;

  await connectToDatabase();

  try {
    const { id } = req.query;

    // Validate notification ID
    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }

    // Find and update the notification
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: auth.userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    return res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error('Error dismissing notification:', error);
    return res.status(500).json({ error: 'Failed to dismiss notification' });
  }
}