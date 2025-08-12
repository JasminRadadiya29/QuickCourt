import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { requireAuth } from '@/lib/apiAuth';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET, PUT, and DELETE methods
  if (req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require authentication
  const auth = requireAuth(req, res);
  if (!auth) return;

  await connectToDatabase();

  const { id } = req.query;

  // Validate notification ID
  if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ error: 'Invalid notification ID' });
  }

  // GET: Fetch a specific notification
  if (req.method === 'GET') {
    try {
      const notification = await Notification.findOne({ _id: id, user: auth.userId });

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      return res.status(200).json(notification);
    } catch (error) {
      console.error('Error fetching notification:', error);
      return res.status(500).json({ error: 'Failed to fetch notification' });
    }
  }

  // PUT: Update a notification (mark as read/unread)
  if (req.method === 'PUT') {
    try {
      const { read } = req.body;

      if (read === undefined) {
        return res.status(400).json({ error: 'Read status is required' });
      }

      const notification = await Notification.findOneAndUpdate(
        { _id: id, user: auth.userId },
        { read },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      return res.status(200).json(notification);
    } catch (error) {
      console.error('Error updating notification:', error);
      return res.status(500).json({ error: 'Failed to update notification' });
    }
  }

  // DELETE: Delete a notification
  if (req.method === 'DELETE') {
    try {
      const result = await Notification.deleteOne({ _id: id, user: auth.userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting notification:', error);
      return res.status(500).json({ error: 'Failed to delete notification' });
    }
  }
}