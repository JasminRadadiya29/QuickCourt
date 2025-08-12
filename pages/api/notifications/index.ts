import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { requireAuth } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET and POST methods
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require authentication for all operations
  const auth = requireAuth(req, res);
  if (!auth) return;

  await connectToDatabase();

  // GET: Fetch notifications for the authenticated user
  if (req.method === 'GET') {
    try {
      const notifications = await Notification.find({ user: auth.userId })
        .sort({ timestamp: -1 })
        .limit(20);

      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  // POST: Create a new notification
  if (req.method === 'POST') {
    try {
      const { title, message, type, userId, autoHide } = req.body;

      // Validate required fields
      if (!title || !message) {
        return res.status(400).json({ error: 'Title and message are required' });
      }

      // Create notification
      const notification = await Notification.create({
        user: userId || auth.userId, // Allow creating for other users if specified
        title,
        message,
        type: type || 'info',
        autoHide: autoHide !== undefined ? autoHide : true,
        timestamp: new Date()
      });

      return res.status(201).json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      return res.status(500).json({ error: 'Failed to create notification' });
    }
  }
}