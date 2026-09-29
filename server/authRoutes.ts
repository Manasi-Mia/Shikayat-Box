import crypto from 'crypto';
import { Express, Request, Response, NextFunction } from 'express';
import { db } from './db';

const sessions = new Map<string, { userId: string; expiresAt: number }>();
const SESSION_TTL = 1000 * 60 * 60 * 12;

function issueSession(userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { userId, expiresAt: Date.now() + SESSION_TTL });
  return token;
}
function cookieToken(req: Request) {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map(x => x.trim()).find(x => x.startsWith('sb_session='));
  return match?.slice('sb_session='.length) || null;
}
export function getSessionUser(req: Request) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || cookieToken(req);
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) { if (session) sessions.delete(token); return null; }
  const user = (db as any).data?.users?.find((u:any) => u.id === session.userId);
  return user ? db.publicUser(user) : null;
}
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });
  (req as any).user = user;
  next();
}
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
}

export function registerAuthRoutes(app: Express) {
  app.post('/api/auth/register', (req, res) => {
    try {
      const { salutation, name, phone, wing, flat, password } = req.body;
      if (!['Mr','Mrs','Ms'].includes(salutation) || !name || !phone || !wing || !flat || !password || password.length < 6) return res.status(400).json({ error: 'Salutation, name, phone, wing, flat and a 6+ character password are required.' });
      const user = db.createResident({ salutation, name, phone, wing, flat, password });
      const token = issueSession(user.id);
      res.setHeader('Set-Cookie', `sb_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_TTL/1000}`);
      res.status(201).json({ user: db.publicUser(user), token });
    } catch (e:any) { res.status(400).json({ error: e.message || 'Registration failed' }); }
  });

  app.post('/api/auth/login', (req, res) => {
    const { role, phone, admin_id, password } = req.body;
    const user = role === 'admin' ? db.findAdmin(admin_id, phone) : db.findUserByPhone(phone || '');
    if (!user || (role === 'admin' && user.role !== 'admin') || !db.verifyUser(user, password || '')) return res.status(401).json({ error: 'Invalid credentials' });
    const token = issueSession(user.id);
    res.setHeader('Set-Cookie', `sb_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_TTL/1000}`);
    res.json({ user: db.publicUser(user), token });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || cookieToken(req);
    if (token) sessions.delete(token);
    res.setHeader('Set-Cookie', 'sb_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0');
    res.json({ success: true });
  });

  app.get('/api/auth/me', requireAuth, (req, res) => res.json({ user: (req as any).user }));
}
