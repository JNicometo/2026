const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize SQLite Database
const db = new Database('tracker.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS lifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    exercise TEXT NOT NULL,
    weight REAL NOT NULL,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS finances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS daily_checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    mood TEXT NOT NULL,
    energy INTEGER NOT NULL,
    productivity INTEGER NOT NULL,
    notes TEXT,
    grateful TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Database initialized successfully');

// ============================================
// LIFTS ENDPOINTS
// ============================================

// Get all lifts
app.get('/api/lifts', (req, res) => {
  try {
    const lifts = db.prepare('SELECT * FROM lifts ORDER BY date DESC, id DESC').all();
    res.json(lifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a lift
app.post('/api/lifts', (req, res) => {
  try {
    const { date, exercise, weight, sets, reps, notes } = req.body;
    const stmt = db.prepare(`
      INSERT INTO lifts (date, exercise, weight, sets, reps, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(date, exercise, weight, sets, reps, notes || null);

    const newLift = db.prepare('SELECT * FROM lifts WHERE id = ?').get(result.lastInsertRowid);
    res.json(newLift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a lift
app.delete('/api/lifts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM lifts WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// FINANCES ENDPOINTS
// ============================================

// Get all finances
app.get('/api/finances', (req, res) => {
  try {
    const finances = db.prepare('SELECT * FROM finances ORDER BY date DESC, id DESC').all();
    res.json(finances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a finance entry
app.post('/api/finances', (req, res) => {
  try {
    const { date, type, category, amount, description } = req.body;
    const stmt = db.prepare(`
      INSERT INTO finances (date, type, category, amount, description)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(date, type, category, amount, description || null);

    const newFinance = db.prepare('SELECT * FROM finances WHERE id = ?').get(result.lastInsertRowid);
    res.json(newFinance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a finance entry
app.delete('/api/finances/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM finances WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DAILY CHECK-INS ENDPOINTS
// ============================================

// Get all daily check-ins
app.get('/api/daily-checkins', (req, res) => {
  try {
    const checkins = db.prepare('SELECT * FROM daily_checkins ORDER BY date DESC, id DESC').all();
    res.json(checkins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a daily check-in
app.post('/api/daily-checkins', (req, res) => {
  try {
    const { date, mood, energy, productivity, notes, grateful } = req.body;
    const stmt = db.prepare(`
      INSERT INTO daily_checkins (date, mood, energy, productivity, notes, grateful)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(date, mood, energy, productivity, notes || null, grateful || null);

    const newCheckin = db.prepare('SELECT * FROM daily_checkins WHERE id = ?').get(result.lastInsertRowid);
    res.json(newCheckin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a daily check-in
app.delete('/api/daily-checkins/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM daily_checkins WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DATA MANAGEMENT ENDPOINTS
// ============================================

// Export all data
app.get('/api/export', (req, res) => {
  try {
    const data = {
      lifts: db.prepare('SELECT * FROM lifts').all(),
      finances: db.prepare('SELECT * FROM finances').all(),
      dailyCheckins: db.prepare('SELECT * FROM daily_checkins').all(),
      exportDate: new Date().toISOString()
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all data
app.delete('/api/clear-all', (req, res) => {
  try {
    db.exec(`
      DELETE FROM lifts;
      DELETE FROM finances;
      DELETE FROM daily_checkins;
    `);
    res.json({ success: true, message: 'All data cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Access your app at: http://localhost:${PORT}/index.html`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  console.log('\nDatabase closed. Server shutting down...');
  process.exit(0);
});
