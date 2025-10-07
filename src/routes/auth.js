import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { readUsers, writeUsers } from '../utils/storage.js';
import { signJwt, setAuthCookie, clearAuthCookie } from '../middleware/auth.js';

const router = Router();

async function ensureAdminSeed() {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const users = await readUsers();
  const hasAdmin = users.some(u => u.role === 'admin');
  if (!hasAdmin) {
    const hash = await bcrypt.hash(adminPassword, 10);
    users.push({ id: nanoid(), username: 'admin', passwordHash: hash, role: 'admin' });
    await writeUsers(users);
    // eslint-disable-next-line no-console
    console.log('Seeded default admin: username=admin');
  }
}

router.post('/register', async (req, res) => {
  try {
    await ensureAdminSeed();
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const users = await readUsers();
    if (users.some(u => u.username === username)) return res.status(409).json({ error: 'Username exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: nanoid(), username, passwordHash, role: 'student' };
    users.push(user);
    await writeUsers(users);
    const token = signJwt({ id: user.id, username, role: user.role });
    setAuthCookie(res, token);
    return res.json({ id: user.id, username, role: user.role });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    await ensureAdminSeed();
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const users = await readUsers();
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signJwt({ id: user.id, username: user.username, role: user.role });
    setAuthCookie(res, token);
    return res.json({ id: user.id, username: user.username, role: user.role });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', async (_req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

// Public stats
router.get('/stats', async (_req, res) => {
  try{
    const users = await readUsers();
    const userCount = users.filter(u=>u.role==='student').length;
    return res.json({ userCount });
  }catch{
    return res.json({ userCount: 0 });
  }
});

export default router;


