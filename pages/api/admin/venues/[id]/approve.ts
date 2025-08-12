import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Facility from '@/models/Facility';
import { requireAuth, ensureRole } from '@/lib/apiAuth';
import { createAuditLog } from '@/models/AuditLog';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
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
    const { approve, reason } = req.body as { approve: boolean; reason?: string };
    
    if (typeof approve !== 'boolean') {
      return res.status(400).json({ error: 'approve parameter must be a boolean' });
    }
    
    // Find the facility
    const facility = await Facility.findById(id);
    
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    
    // Update the approval status
    facility.approved = approve;
    await facility.save();
    
    // Create audit log entry
    const action = approve ? 'approve_facility' : 'reject_facility';
    const details = { 
      facilityName: facility.name,
      reason: reason || '',
      previousStatus: !approve
    };
    
    await createAuditLog(auth, action, 'venue', facility._id.toString(), details);
    
    return res.status(200).json({
      success: true,
      facility: {
        _id: facility._id,
        name: facility.name,
        approved: facility.approved,
        // Include other relevant facility fields
        address: facility.address,
        description: facility.description
      }
    });
  } catch (error) {
    console.error('Error updating facility approval status:', error);
    return res.status(500).json({ error: 'Failed to update facility approval status' });
  }
}