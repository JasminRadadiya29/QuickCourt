// NextAuth disabled in favor of custom JWT auth endpoints.
export default function handler(req: any, res: any) {
  return res.status(404).json({ error: 'NextAuth disabled. Use /api/auth/* custom endpoints.' });
}
