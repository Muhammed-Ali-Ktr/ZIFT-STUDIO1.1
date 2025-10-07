import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '../../');
const DATA_DIR = path.join(ROOT, 'data');
const STUDENTS_DIR = path.join(DATA_DIR, 'students');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

async function ensureBase() {
  await fs.mkdir(STUDENTS_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

export async function readUsers() {
  await ensureBase();
  const raw = await fs.readFile(USERS_FILE, 'utf8');
  return JSON.parse(raw || '[]');
}

export async function writeUsers(users) {
  await ensureBase();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export function getStudentFilePath(userId) {
  return path.join(STUDENTS_DIR, `${userId}.json`);
}

export async function readStudentData(userId) {
  await ensureBase();
  const fp = getStudentFilePath(userId);
  try {
    const raw = await fs.readFile(fp, 'utf8');
    return JSON.parse(raw);
  } catch {
    const initial = { records: [], plans: [], events: [], profile: {} };
    await fs.writeFile(fp, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

export async function writeStudentData(userId, data) {
  await ensureBase();
  const fp = getStudentFilePath(userId);
  await fs.writeFile(fp, JSON.stringify(data, null, 2), 'utf8');
}


