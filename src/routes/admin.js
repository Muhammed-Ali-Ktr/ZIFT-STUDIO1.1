import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { readUsers, readStudentData, writeUsers } from '../utils/storage.js';
import { createObjectCsvStringifier } from 'csv-writer';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.get('/students', async (_req, res) => {
  const users = await readUsers();
  const students = users.filter(u => u.role === 'student');
  const result = await Promise.all(students.map(async s => {
    const data = await readStudentData(s.id);
    const totalMinutes = (data.records || []).reduce((sum, r) => sum + Number(r.minutes || 0), 0);
    return { id: s.id, username: s.username, totalMinutes, recordsCount: (data.records || []).length };
  }));
  return res.json(result);
});

router.get('/students/:id', async (req, res) => {
  const { id } = req.params;
  const users = await readUsers();
  const user = users.find(u => u.id === id && u.role === 'student');
  if (!user) return res.status(404).json({ error: 'Not found' });
  const data = await readStudentData(id);
  return res.json({ user: { id: user.id, username: user.username }, data });
});

router.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  const users = await readUsers();
  const idx = users.findIndex(u => u.id === id && u.role === 'student');
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  users.splice(idx, 1);
  await writeUsers(users);
  return res.json({ ok: true });
});

router.get('/export.json', async (_req, res) => {
  const users = await readUsers();
  const students = users.filter(u => u.role === 'student');
  const payload = [];
  for (const s of students) {
    const data = await readStudentData(s.id);
    payload.push({ user: { id: s.id, username: s.username }, data });
  }
  res.setHeader('Content-Disposition', 'attachment; filename="students.json"');
  return res.json(payload);
});

router.get('/export.csv', async (_req, res) => {
  const users = await readUsers();
  const students = users.filter(u => u.role === 'student');
  const rows = [];
  for (const s of students) {
    const data = await readStudentData(s.id);
    for (const r of data.records || []) {
      rows.push({ userId: s.id, username: s.username, subject: r.subject, topic: r.topic, minutes: r.minutes, date: r.date, note: r.note || '' });
    }
  }
  const csv = createObjectCsvStringifier({
    header: [
      { id: 'userId', title: 'UserId' },
      { id: 'username', title: 'Username' },
      { id: 'subject', title: 'Subject' },
      { id: 'topic', title: 'Topic' },
      { id: 'minutes', title: 'Minutes' },
      { id: 'date', title: 'Date' },
      { id: 'note', title: 'Note' }
    ]
  });
  const csvString = csv.getHeaderString() + csv.stringifyRecords(rows);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
  return res.send(csvString);
});

export default router;


