import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth, ensureRole } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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
    const { 
      role, 
      q, 
      page = '1', 
      size = '10',
      status 
    } = req.query as { 
      role?: string; 
      q?: string; 
      page?: string; 
      size?: string;
      status?: string;
    };
    
    // Parse pagination parameters
    const pageNum = parseInt(page, 10);
    const sizeNum = parseInt(size, 10);
    const skip = (pageNum - 1) * sizeNum;
    
    // Build query based on parameters
    let query: any = {};
    
    // Filter by role if provided
    if (role) {
      query.role = role;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status === 'banned' ? 'banned' : 'active';
    }
    
    // Add search functionality if q parameter is provided
    if (q) {
      query = {
        ...query,
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]
      };
    }
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    // Fetch users with pagination
    const users = await User.find(query, {
      passwordHash: 0, // Exclude password hash
      avatar: 0 // Exclude avatar for list view
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(sizeNum);
    
    // Format the response
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBanned: user.status === 'banned',
      createdAt: user.createdAt
    }));
    
    return res.status(200).json({
      users: formattedUsers,
      pagination: {
        page: pageNum,
        size: sizeNum,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}