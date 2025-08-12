import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth, ensureRole } from '@/lib/apiAuth';
import { createAuditLog } from '@/models/AuditLog';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = requireAuth(req, res);
  if (!auth) return;
  
  // Ensure the user is an admin
  if (!ensureRole(auth, ['admin'])) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await connectToDatabase();

  try {
    const { id } = req.query as { id: string };
    const { ban, reason } = req.body as { ban: boolean; reason?: string };
    
    if (typeof ban !== 'boolean') {
      return res.status(400).json({ error: 'ban parameter must be a boolean' });
    }
    
    // Find the user
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent banning other admins
    if (user.role === 'admin' && ban) {
      return res.status(403).json({ error: 'Cannot ban admin users' });
    }
    
    // Update the user status
    const previousStatus = user.status;
    user.status = ban ? 'banned' : 'active';
    await user.save();
    
    // Create audit log entry
    const action = ban ? 'ban_user' : 'unban_user';
    const details = { 
      userName: user.name,
      userEmail: user.email,
      reason: reason || '',
      previousStatus
    };
    
    await createAuditLog(auth, action, 'user', user._id.toString(), details);
    
    const message = ban ? 'User has been banned' : 'User has been unbanned';
    
    return res.status(200).json({
      success: true,
      message,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error updating user ban status:', error);
    return res.status(500).json({ error: 'Failed to update user ban status' });
  }
}