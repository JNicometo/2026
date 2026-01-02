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

// Create table for daily check-ins
db.exec(`
  CREATE TABLE IF NOT EXISTS daily_checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    wake_up_time TEXT,
    good_day TEXT,
    mood_rating INTEGER,
    productivity_rating INTEGER,
    amount_ran REAL,
    lifted_weights TEXT,
    worked_out TEXT,
    money_made REAL,
    money_spent REAL,
    money_saved REAL,
    good_thing TEXT,
    bad_thing TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Database initialized successfully');

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
    const {
      date,
      wake_up_time,
      good_day,
      mood_rating,
      productivity_rating,
      amount_ran,
      lifted_weights,
      worked_out,
      money_made,
      money_spent,
      money_saved,
      good_thing,
      bad_thing,
      notes
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO daily_checkins (
        date, wake_up_time, good_day, mood_rating, productivity_rating, amount_ran,
        lifted_weights, worked_out, money_made, money_spent, money_saved, good_thing, bad_thing, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      date,
      wake_up_time || null,
      good_day || null,
      mood_rating || null,
      productivity_rating || null,
      amount_ran || null,
      lifted_weights || null,
      worked_out || null,
      money_made || null,
      money_spent || null,
      money_saved || null,
      good_thing || null,
      bad_thing || null,
      notes || null
    );

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
    db.exec('DELETE FROM daily_checkins;');
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
