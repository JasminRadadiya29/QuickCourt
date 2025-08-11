import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthFromRequest } from '@/lib/jwt';

export type AuthContext = { userId: string; role: 'user' | 'facility_owner' | 'admin' };

export function requireAuth(req: NextApiRequest, res: NextApiResponse): AuthContext | null {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) {
    res.status(500).json({ error: 'JWT_SECRET not configured' });
    return null;
  }
  const auth = getAuthFromRequest(req as any, secret);
  if (!auth?.userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return { userId: auth.userId, role: (auth.role as any) };
}

export function ensureRole(auth: AuthContext, roles: Array<AuthContext['role']>): boolean {
  return roles.includes(auth.role);
}


