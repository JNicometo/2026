# 2026 Year Tracker

A comprehensive web application with SQLite database to track your fitness lifts, finances, and daily wellbeing throughout 2026.

## Features

### Lift Tracker
- Log your workouts with exercise name, weight, sets, and reps
- Automatic volume calculation (weight × sets × reps)
- Add optional notes for each workout
- Track your strength progress over time

### Finance Tracker
- Record income and expenses
- Categorize transactions
- View real-time summaries of total income, expenses, and net balance
- Track your financial health throughout the year

### Daily Check-in
- Log your daily mood with emoji indicators
- Rate your energy and productivity levels (1-10 scale)
- Reflect on your day with notes
- Practice gratitude by recording what you're thankful for

### Overview Dashboard
- View comprehensive statistics across all tracking categories
- Monitor total workouts, volume lifted, and financial summaries
- Track average energy and productivity levels
- See your year at a glance

### Data Management
- All data stored in local SQLite database
- Export your data as JSON for backup
- Clear all data if needed
- Fast and reliable database operations

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the App**
   - Open your browser and go to: `http://localhost:3000/index.html`
   - The server will automatically create the SQLite database on first run
   - Start tracking your year!

### Development Mode

For development with auto-restart on file changes:
```bash
npm run dev
```

## How to Use

1. Make sure the server is running (`npm start`)
2. Open `http://localhost:3000/index.html` in your browser
3. Use the navigation tabs to switch between Lifts, Finances, Daily Check-ins, and Overview
4. Click the "+ Add" buttons to log new entries
5. Your data is automatically saved to the SQLite database
6. The server must be running to use the app

## File Structure

```
2026/
├── index.html      # Frontend HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # Frontend JavaScript (connects to backend API)
├── server.js       # Backend Node.js/Express server
├── package.json    # Node.js dependencies and scripts
├── tracker.db      # SQLite database (created automatically)
├── .gitignore      # Git ignore rules
└── README.md       # This file
```

## Technical Details

- **Backend**: Node.js with Express framework
- **Database**: SQLite (better-sqlite3)
- **Frontend**: Pure HTML, CSS, and JavaScript
- **API**: RESTful API for all data operations
- **Responsive design**: Works on desktop, tablet, and mobile devices
- **Local-only**: Runs entirely on your computer
- **No cloud**: Your data stays on your machine

## API Endpoints

The backend provides these endpoints:

- `GET /api/lifts` - Get all lifts
- `POST /api/lifts` - Add a new lift
- `DELETE /api/lifts/:id` - Delete a lift

- `GET /api/finances` - Get all finances
- `POST /api/finances` - Add a finance entry
- `DELETE /api/finances/:id` - Delete a finance entry

- `GET /api/daily-checkins` - Get all daily check-ins
- `POST /api/daily-checkins` - Add a daily check-in
- `DELETE /api/daily-checkins/:id` - Delete a daily check-in

- `GET /api/export` - Export all data as JSON
- `DELETE /api/clear-all` - Clear all data from database

## Database Schema

### lifts table
- id (INTEGER PRIMARY KEY)
- date (TEXT)
- exercise (TEXT)
- weight (REAL)
- sets (INTEGER)
- reps (INTEGER)
- notes (TEXT)
- created_at (DATETIME)

### finances table
- id (INTEGER PRIMARY KEY)
- date (TEXT)
- type (TEXT) - 'income' or 'expense'
- category (TEXT)
- amount (REAL)
- description (TEXT)
- created_at (DATETIME)

### daily_checkins table
- id (INTEGER PRIMARY KEY)
- date (TEXT)
- mood (TEXT)
- energy (INTEGER 1-10)
- productivity (INTEGER 1-10)
- notes (TEXT)
- grateful (TEXT)
- created_at (DATETIME)

## Troubleshooting

### Server won't start
- Make sure Node.js is installed: `node --version`
- Try reinstalling dependencies: `npm install`

### Can't connect to database
- Make sure the server is running: `npm start`
- Check the console for error messages
- The server runs on port 3000 by default

### Data not saving
- Check that the server is running
- Look for error messages in the browser console (F12)
- Make sure you have write permissions in the project directory

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Tips

- **Keep server running**: The server must be running for the app to work
- **Regular backups**: Use the export feature regularly to back up your data
- **Daily tracking**: Set a reminder to log your daily check-in each evening
- **Consistency**: Track your lifts and finances consistently for best insights
- **Database file**: Your data is stored in `tracker.db` - back this up regularly

## Stopping the Server

To stop the server:
- Press `Ctrl+C` in the terminal where the server is running

## License

Feel free to use and modify this tracker for your personal use!

---

Built with Node.js, Express, SQLite, and vanilla JavaScript. Track your 2026 journey!
