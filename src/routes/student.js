import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { nanoid } from 'nanoid';
import { readStudentData, writeStudentData } from '../utils/storage.js';

const router = Router();

router.use(authenticate);

router.get('/me', (req, res) => {
  return res.json({ id: req.user.id, username: req.user.username, role: req.user.role });
});

// Profile
router.get('/profile', async (req, res) => {
  const data = await readStudentData(req.user.id);
  return res.json(data.profile || {});
});

// Study records
router.get('/records', async (req, res) => {
  const data = await readStudentData(req.user.id);
  return res.json(data.records || []);
});

router.post('/records', async (req, res) => {
  const { subject, topic, minutes, date, note } = req.body || {};
  if (!subject || !topic || !minutes || !date) return res.status(400).json({ error: 'Missing fields' });
  const data = await readStudentData(req.user.id);
  const record = { id: nanoid(), subject, topic, minutes: Number(minutes), date, note: note || '' };
  data.records.push(record);
  await writeStudentData(req.user.id, data);
  return res.json(record);
});

router.put('/records/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readStudentData(req.user.id);
  const idx = (data.records || []).findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.records[idx] = { ...data.records[idx], ...req.body };
  await writeStudentData(req.user.id, data);
  return res.json(data.records[idx]);
});

router.delete('/records/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readStudentData(req.user.id);
  data.records = (data.records || []).filter(r => r.id !== id);
  await writeStudentData(req.user.id, data);
  return res.json({ ok: true });
});

// Weekly plans
router.get('/plans', async (req, res) => {
  const data = await readStudentData(req.user.id);
  return res.json(data.plans || []);
});

router.post('/plans', async (req, res) => {
  const { weekStart, items } = req.body || {};
  if (!weekStart || !Array.isArray(items)) return res.status(400).json({ error: 'Missing fields' });
  const data = await readStudentData(req.user.id);
  const plan = { id: nanoid(), weekStart, items };
  data.plans.push(plan);
  await writeStudentData(req.user.id, data);
  return res.json(plan);
});

router.put('/plans/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readStudentData(req.user.id);
  const idx = (data.plans || []).findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.plans[idx] = { ...data.plans[idx], ...req.body };
  await writeStudentData(req.user.id, data);
  return res.json(data.plans[idx]);
});

router.delete('/plans/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readStudentData(req.user.id);
  data.plans = (data.plans || []).filter(p => p.id !== id);
  await writeStudentData(req.user.id, data);
  return res.json({ ok: true });
});

// Calendar events
router.get('/events', async (req, res) => {
  const data = await readStudentData(req.user.id);
  return res.json(data.events || []);
});

router.post('/events', async (req, res) => {
  const { date, title, description } = req.body || {};
  if (!date || !title) return res.status(400).json({ error: 'Missing fields' });
  const data = await readStudentData(req.user.id);
  const ev = { id: nanoid(), date, title, description: description || '' };
  data.events.push(ev);
  await writeStudentData(req.user.id, data);
  return res.json(ev);
});

router.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readStudentData(req.user.id);
  const idx = (data.events || []).findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.events[idx] = { ...data.events[idx], ...req.body };
  await writeStudentData(req.user.id, data);
  return res.json(data.events[idx]);
});

router.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readStudentData(req.user.id);
  data.events = (data.events || []).filter(e => e.id !== id);
  await writeStudentData(req.user.id, data);
  return res.json({ ok: true });
});

router.post('/profile', async (req, res) => {
  const data = await readStudentData(req.user.id);
  data.profile = { ...(data.profile || {}), ...req.body };
  await writeStudentData(req.user.id, data);
  return res.json(data.profile);
});

// Stats
router.get('/stats/weekly', async (req, res) => {
  const { weekStart } = req.query;
  const data = await readStudentData(req.user.id);
  const records = data.records || [];
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  const weekRecords = records.filter(r => {
    const d = new Date(r.date);
    return d >= start && d < end;
  });
  const totalMinutes = weekRecords.reduce((sum, r) => sum + Number(r.minutes || 0), 0);
  const bySubject = {};
  const byDay = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const r of weekRecords) {
    bySubject[r.subject] = (bySubject[r.subject] || 0) + Number(r.minutes || 0);
    const d = new Date(r.date).getDay();
    byDay[d] = (byDay[d] || 0) + Number(r.minutes || 0);
  }
  const mostStudied = Object.entries(bySubject).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  return res.json({ totalMinutes, mostStudied, byDay, bySubject });
});

export default router;


