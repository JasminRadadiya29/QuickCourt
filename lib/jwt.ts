import crypto from 'crypto';

const base64url = (input: Buffer | string) =>
  Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

export function signJwt(payload: Record<string, any>, secret: string, expiresInSeconds = 7 * 24 * 60 * 60) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };
  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(body));
  const data = `${headerB64}.${payloadB64}`;
  const signature = crypto.createHmac('sha256', secret).update(data).digest();
  const signatureB64 = base64url(signature);
  return `${data}.${signatureB64}`;
}

export function verifyJwt(token: string, secret: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !signatureB64) return { valid: false, error: 'Malformed token' };
    const data = `${headerB64}.${payloadB64}`;
    const expected = base64url(crypto.createHmac('sha256', secret).update(data).digest());
    if (expected !== signatureB64) return { valid: false, error: 'Invalid signature' };
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return { valid: false, error: 'Token expired' };
    return { valid: true, payload };
  } catch (e: any) {
    return { valid: false, error: e?.message || 'Invalid token' };
  }
}

export function getAuthFromRequest(req: any, secret: string): { userId?: string; role?: string } | null {
  const auth = req.headers?.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.slice('Bearer '.length);
  const { valid, payload } = verifyJwt(token, secret);
  if (!valid) return null;
  return { userId: payload?.sub, role: payload?.role };
}


