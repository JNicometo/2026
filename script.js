// Year Tracker App - Main JavaScript with SQLite Backend

const API_BASE = 'http://localhost:3000/api';

class YearTracker {
    constructor() {
        this.dailyCheckins = [];
        this.init();
    }

    async init() {
        this.setupTabs();
        this.setupDaily();
        this.setupOverview();
        this.setupDataManagement();
        await this.loadAllData();
    }

    // API Methods
    async loadAllData() {
        try {
            await this.loadDailyCheckins();
            this.updateOverview();
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error connecting to database. Make sure the server is running.');
        }
    }

    async loadDailyCheckins() {
        const response = await fetch(`${API_BASE}/daily-checkins`);
        this.dailyCheckins = await response.json();
        this.renderDailyCheckins();
    }

    // Tab Navigation
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;

                // Update active states
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(tabName).classList.add('active');

                // Update overview when switching to it
                if (tabName === 'overview') {
                    this.updateOverview();
                }
            });
        });
    }

    // DAILY CHECK-IN FUNCTIONALITY
    setupDaily() {
        const addBtn = document.getElementById('add-daily-btn');
        const cancelBtn = document.getElementById('cancel-daily-btn');
        const form = document.getElementById('daily-entry-form');
        const formContainer = document.getElementById('daily-form');
        const moodSlider = document.getElementById('mood-rating');

        // Set default date to today
        document.getElementById('daily-date').valueAsDate = new Date();

        // Update slider value
        moodSlider.addEventListener('input', (e) => {
            document.getElementById('mood-value').textContent = e.target.value;
        });

        addBtn.addEventListener('click', () => {
            formContainer.classList.remove('hidden');
            addBtn.style.display = 'none';
        });

        cancelBtn.addEventListener('click', () => {
            formContainer.classList.add('hidden');
            addBtn.style.display = 'block';
            form.reset();
            document.getElementById('daily-date').valueAsDate = new Date();
            document.getElementById('mood-value').textContent = '5';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addDailyCheckin();
        });
    }

    async addDailyCheckin() {
        const checkin = {
            date: document.getElementById('daily-date').value,
            good_day: document.getElementById('good-day').value,
            mood_rating: parseInt(document.getElementById('mood-rating').value),
            amount_ran: parseFloat(document.getElementById('amount-ran').value) || null,
            worked_out: document.getElementById('worked-out').value,
            money_made: parseFloat(document.getElementById('money-made').value) || null,
            money_spent: parseFloat(document.getElementById('money-spent').value) || null,
            money_saved: parseFloat(document.getElementById('money-saved').value) || null,
            good_thing: document.getElementById('good-thing').value,
            bad_thing: document.getElementById('bad-thing').value,
            notes: document.getElementById('notes').value
        };

        try {
            const response = await fetch(`${API_BASE}/daily-checkins`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(checkin)
            });

            if (response.ok) {
                await this.loadDailyCheckins();

                // Reset form
                document.getElementById('daily-entry-form').reset();
                document.getElementById('daily-date').valueAsDate = new Date();
                document.getElementById('mood-value').textContent = '5';
                document.getElementById('daily-form').classList.add('hidden');
                document.getElementById('add-daily-btn').style.display = 'block';

                this.updateOverview();
            }
        } catch (error) {
            console.error('Error adding check-in:', error);
            alert('Error saving check-in. Make sure the server is running.');
        }
    }

    async deleteDailyCheckin(id) {
        if (confirm('Are you sure you want to delete this check-in?')) {
            try {
                await fetch(`${API_BASE}/daily-checkins/${id}`, { method: 'DELETE' });
                await this.loadDailyCheckins();
                this.updateOverview();
            } catch (error) {
                console.error('Error deleting check-in:', error);
                alert('Error deleting check-in.');
            }
        }
    }

    renderDailyCheckins() {
        const container = document.getElementById('daily-list');

        if (this.dailyCheckins.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No check-ins logged yet. Start tracking your daily progress!</p></div>';
            return;
        }

        container.innerHTML = this.dailyCheckins.map(checkin => {
            const moodEmoji = this.getMoodEmoji(checkin.mood_rating);
            const goodDayText = checkin.good_day ? checkin.good_day.charAt(0).toUpperCase() + checkin.good_day.slice(1) : 'N/A';

            return `
                <div class="list-item">
                    <div class="item-content">
                        <div class="item-header">
                            <span class="item-title">
                                <span class="mood-indicator">${moodEmoji}</span>
                                ${goodDayText} Day - Mood: ${checkin.mood_rating}/10
                            </span>
                            <span class="item-date">${this.formatDate(checkin.date)}</span>
                        </div>

                        ${this.renderField('🏃 Ran', checkin.amount_ran ? `${checkin.amount_ran} miles` : null)}
                        ${this.renderField('💪 Worked out', checkin.worked_out)}
                        ${this.renderMoneyStats(checkin)}
                        ${checkin.good_thing ? `<div class="item-notes"><strong>✨ Good:</strong> ${checkin.good_thing}</div>` : ''}
                        ${checkin.bad_thing ? `<div class="item-notes"><strong>⚠️ Bad:</strong> ${checkin.bad_thing}</div>` : ''}
                        ${checkin.notes ? `<div class="item-notes"><strong>📝 Notes:</strong> ${checkin.notes}</div>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn-delete" onclick="app.deleteDailyCheckin(${checkin.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderField(label, value) {
        if (!value) return '';
        return `<div class="item-details">${label}: ${value}</div>`;
    }

    renderMoneyStats(checkin) {
        const parts = [];
        if (checkin.money_made) parts.push(`Made: $${checkin.money_made.toFixed(2)}`);
        if (checkin.money_spent) parts.push(`Spent: $${checkin.money_spent.toFixed(2)}`);
        if (checkin.money_saved) parts.push(`Saved: $${checkin.money_saved.toFixed(2)}`);

        if (parts.length === 0) return '';
        return `<div class="item-details">💰 ${parts.join(' • ')}</div>`;
    }

    getMoodEmoji(rating) {
        if (rating >= 9) return '🤩';
        if (rating >= 7) return '😊';
        if (rating >= 5) return '🙂';
        if (rating >= 3) return '😐';
        return '😔';
    }

    // OVERVIEW FUNCTIONALITY
    setupOverview() {
        // Overview is updated when tab is clicked or data changes
    }

    updateOverview() {
        const totalCheckins = this.dailyCheckins.length;

        // Mood stats
        const avgMood = totalCheckins > 0
            ? (this.dailyCheckins.reduce((sum, c) => sum + (c.mood_rating || 0), 0) / totalCheckins).toFixed(1)
            : 0;

        const goodDays = this.dailyCheckins.filter(c => c.good_day === 'yes').length;

        // Fitness stats
        const totalRan = this.dailyCheckins.reduce((sum, c) => sum + (c.amount_ran || 0), 0);
        const totalWorkouts = this.dailyCheckins.filter(c => c.worked_out === 'yes').length;

        // Money stats
        const totalMade = this.dailyCheckins.reduce((sum, c) => sum + (c.money_made || 0), 0);
        const totalSpent = this.dailyCheckins.reduce((sum, c) => sum + (c.money_spent || 0), 0);
        const totalSaved = this.dailyCheckins.reduce((sum, c) => sum + (c.money_saved || 0), 0);

        // Update DOM
        document.getElementById('total-checkins').textContent = totalCheckins;
        document.getElementById('avg-mood').textContent = avgMood;
        document.getElementById('good-days').textContent = goodDays;

        document.getElementById('total-ran').textContent = totalRan.toFixed(1);
        document.getElementById('total-workouts').textContent = totalWorkouts;

        document.getElementById('total-made').textContent = `$${totalMade.toFixed(2)}`;
        document.getElementById('total-spent').textContent = `$${totalSpent.toFixed(2)}`;
        document.getElementById('total-saved').textContent = `$${totalSaved.toFixed(2)}`;
    }

    // DATA MANAGEMENT
    setupDataManagement() {
        const exportBtn = document.getElementById('export-data-btn');
        const clearBtn = document.getElementById('clear-data-btn');

        exportBtn.addEventListener('click', () => this.exportData());
        clearBtn.addEventListener('click', () => this.clearAllData());
    }

    async exportData() {
        try {
            const response = await fetch(`${API_BASE}/export`);
            const data = await response.json();

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `year-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert('Data exported successfully!');
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Error exporting data.');
        }
    }

    async clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
            if (confirm('Really sure? This will delete everything!')) {
                try {
                    await fetch(`${API_BASE}/clear-all`, { method: 'DELETE' });
                    await this.loadAllData();
                    alert('All data cleared.');
                } catch (error) {
                    console.error('Error clearing data:', error);
                    alert('Error clearing data.');
                }
            }
        }
    }

    // UTILITY METHODS
    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
        return date.toLocaleDateString('en-US', options);
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new YearTracker();
});
