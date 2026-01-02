# 2026 Year Tracker

A comprehensive web application to track your fitness lifts, finances, and daily wellbeing throughout 2026.

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
- All data stored locally in your browser (privacy-first approach)
- Export your data as JSON for backup
- Import data from previous backups
- Clear all data if needed

## How to Use

1. Open `index.html` in your web browser
2. Use the navigation tabs to switch between Lifts, Finances, Daily Check-ins, and Overview
3. Click the "+ Add" buttons to log new entries
4. Your data is automatically saved to your browser's local storage
5. Access your tracker from anywhere once deployed to GitHub Pages

## Deploying to GitHub Pages

### Option 1: Enable GitHub Pages (Recommended)

1. Make sure all files are committed and pushed to your repository
2. Go to your repository on GitHub
3. Click on "Settings" tab
4. Scroll down to "Pages" in the left sidebar
5. Under "Source", select the branch you want to deploy (e.g., `claude/year-tracking-app-KxHY4` or `main`)
6. Click "Save"
7. Your site will be published at `https://[your-username].github.io/2026/`

### Option 2: Using GitHub Actions (Advanced)

If you want to deploy from a specific branch automatically, you can set up a GitHub Actions workflow.

## File Structure

```
2026/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # Application logic and data management
└── README.md       # This file
```

## Technical Details

- **No dependencies**: Pure HTML, CSS, and JavaScript
- **Responsive design**: Works on desktop, tablet, and mobile devices
- **Local storage**: All data persists in browser localStorage
- **Privacy-focused**: No data leaves your device
- **Offline-capable**: Works without internet connection once loaded

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Tips

- **Regular backups**: Use the export feature regularly to back up your data
- **Daily tracking**: Set a reminder to log your daily check-in each evening
- **Consistency**: Track your lifts and finances consistently for best insights
- **Mobile access**: Add to your phone's home screen for quick access

## Future Enhancements

Potential features to add:
- Data visualization with charts and graphs
- Weekly/monthly summaries
- Goal setting and tracking
- Customizable categories
- Data filtering and search
- PWA capabilities for offline use

## License

Feel free to use and modify this tracker for your personal use!

---

Built with focus on simplicity, privacy, and ease of use. Track your 2026 journey!
