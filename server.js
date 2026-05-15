const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database('anchor.db');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Initialization
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    rawInput TEXT,
    category TEXT,
    title TEXT,
    note TEXT,
    nextAction TEXT,
    nextActionDate TEXT,
    tags TEXT,
    status TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS reflections (
    id TEXT PRIMARY KEY,
    moved TEXT,
    stuck TEXT,
    overload TEXT,
    helped TEXT,
    tomorrow TEXT,
    createdAt TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// --- API ENDPOINTS: ITEMS ---

app.get('/api/items', (req, res) => {
  const items = db.prepare('SELECT * FROM items ORDER BY createdAt DESC').all();
  // Parse tags string back to array
  items.forEach(item => {
    item.tags = item.tags ? JSON.parse(item.tags) : [];
  });
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const item = req.body;
  const stmt = db.prepare(`
    INSERT INTO items (id, rawInput, category, title, note, nextAction, nextActionDate, tags, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    item.id,
    item.rawInput,
    item.category,
    item.title,
    item.note,
    item.nextAction,
    item.nextActionDate,
    JSON.stringify(item.tags),
    item.status,
    item.createdAt,
    item.updatedAt
  );
  res.status(201).json(item);
});

app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const item = req.body;
  const stmt = db.prepare(`
    UPDATE items SET 
      category = ?, title = ?, note = ?, nextAction = ?, 
      nextActionDate = ?, tags = ?, status = ?, updatedAt = ?
    WHERE id = ?
  `);
  stmt.run(
    item.category,
    item.title,
    item.note,
    item.nextAction,
    item.nextActionDate,
    JSON.stringify(item.tags),
    item.status,
    item.updatedAt,
    id
  );
  res.json({ success: true });
});

app.delete('/api/items/:id', (req, res) => {
  db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.delete('/api/items', (req, res) => {
  db.prepare('DELETE FROM items').run();
  res.json({ success: true });
});

// --- API ENDPOINTS: REFLECTIONS ---

app.get('/api/reflections', (req, res) => {
  const reflections = db.prepare('SELECT * FROM reflections ORDER BY createdAt DESC').all();
  res.json(reflections);
});

app.post('/api/reflections', (req, res) => {
  const r = req.body;
  const stmt = db.prepare(`
    INSERT INTO reflections (id, moved, stuck, overload, helped, tomorrow, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(r.id, r.moved, r.stuck, r.overload, r.helped, r.tomorrow, r.createdAt);
  res.status(201).json(r);
});

app.delete('/api/reflections/:id', (req, res) => {
  db.prepare('DELETE FROM reflections WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.delete('/api/reflections', (req, res) => {
  db.prepare('DELETE FROM reflections').run();
  res.json({ success: true });
});

// --- API ENDPOINTS: SETTINGS ---

app.get('/api/settings', (req, res) => {
  const rows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  rows.forEach(row => {
    settings[row.key] = row.value;
  });
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  const settings = req.body;
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  Object.entries(settings).forEach(([key, value]) => {
    stmt.run(key, String(value));
  });
  res.json({ success: true });
});

// --- AI PROXY (Google Gemini) ---

const GEMINI_DEFAULT = 'gemini-2.5-flash';

app.post('/api/ai/structure', async (req, res) => {
  const { text, model } = req.body;
  
  // Get API Key from DB or Env
  const apiKeyRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('apiKey');
  const apiKey = apiKeyRow ? apiKeyRow.value : process.env.GOOGLE_AI_KEY;

  if (!apiKey) {
    return res.status(400).json({ error: 'No Google AI API key found. Please add it to your .env file.' });
  }

  const today = new Date().toISOString().slice(0, 10);
  const VALID_CATS = ['urgent', 'visa', 'career', 'housing', 'study', 'finance', 'health', 'network', 'documents', 'resources', 'ideas', 'later'];

  const prompt = `You are the structuring engine for Flux Forward Portable Brain.
Today's date: ${today}
Return ONLY valid JSON, no markdown, no explanation.
Schema: {
  "category": one of: ${VALID_CATS.join(', ')},
  "title": short clear title (max 60 chars),
  "note": one-sentence summary,
  "nextAction": verb-led next action,
  "nextActionDate": YYYY-MM-DD if a date is mentioned, otherwise null,
  "tags": array of exactly 3 relevant tags
}

Input to structure:
"""${text}"""`;

  try {
    const geminiModel = (model && model.startsWith('gemini')) ? model : GEMINI_DEFAULT;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
    
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });

    if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Gemini returned an empty response');
    }

    const structured = JSON.parse(response.data.candidates[0].content.parts[0].text);
    res.json(structured);
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    console.error('Gemini Error:', msg);
    res.status(500).json({ error: `Gemini Error: ${msg}` });
  }
});

app.listen(PORT, () => {
  console.log(`Anchor backend running at http://localhost:${PORT}`);
});
