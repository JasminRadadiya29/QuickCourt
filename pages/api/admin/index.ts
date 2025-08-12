import type { NextApiRequest, NextApiResponse } from 'next';
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

  // Return a list of available admin API endpoints
  return res.status(200).json({
    message: 'QuickCourt Admin API',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api/admin/venues/pending',
        method: 'GET',
        description: 'List facilities with pending approval status',
        queryParams: ['page', 'size', 'q']
      },
      {
        path: '/api/admin/venues/:id',
        method: 'GET',
        description: 'Get full facility details for review'
      },
      {
        path: '/api/admin/venues/:id/approve',
        method: 'PUT',
        description: 'Approve or reject a facility',
        bodyParams: ['approve', 'reason']
      },
      {
        path: '/api/admin/users',
        method: 'GET',
        description: 'List users and facility owners',
        queryParams: ['role', 'q', 'page', 'size', 'status']
      },
      {
        path: '/api/admin/users/:id/ban',
        method: 'PATCH',
        description: 'Ban or unban a user',
        bodyParams: ['ban', 'reason']
      },
      {
        path: '/api/admin/bookings',
        method: 'GET',
        description: 'List & filter bookings across platform',
        queryParams: ['status', 'venueId', 'courtId', 'userId', 'dateFrom', 'dateTo', 'page', 'size']
      },
      {
        path: '/api/admin/bookings/:id/status',
        method: 'PATCH',
        description: 'Change booking status',
        bodyParams: ['status']
      }
    ]
  });
}