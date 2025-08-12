import mongoose, { Schema, models, model } from 'mongoose';
import { AuthContext } from '@/lib/apiAuth';

export interface AuditLogEntry {
  adminId: string;
  action: string;
  entityType: 'venue' | 'court' | 'user' | 'booking';
  entityId: string;
  details: any;
  timestamp: Date;
}

const AuditLogSchema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true, index: true },
  entityType: { 
    type: String, 
    enum: ['venue', 'court', 'user', 'booking'], 
    required: true, 
    index: true 
  },
  entityId: { type: Schema.Types.ObjectId, required: true, index: true },
  details: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Helper function to create audit log entries
export async function createAuditLog(auth: AuthContext, action: string, entityType: AuditLogEntry['entityType'], entityId: string, details: any = {}) {
  const AuditLog = models.AuditLog || model('AuditLog', AuditLogSchema);
  
  return await AuditLog.create({
    adminId: auth.userId,
    action,
    entityType,
    entityId,
    details
  });
}

export default models.AuditLog || model('AuditLog', AuditLogSchema);