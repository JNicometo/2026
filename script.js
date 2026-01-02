// Year Tracker App - Main JavaScript with SQLite Backend

const API_BASE = 'http://localhost:3000/api';

class YearTracker {
    constructor() {
        this.lifts = [];
        this.finances = [];
        this.dailyCheckins = [];
        this.init();
    }

    async init() {
        this.setupTabs();
        this.setupLifts();
        this.setupFinances();
        this.setupDaily();
        this.setupOverview();
        this.setupDataManagement();
        await this.loadAllData();
    }

    // API Methods
    async loadAllData() {
        try {
            await Promise.all([
                this.loadLifts(),
                this.loadFinances(),
                this.loadDailyCheckins()
            ]);
            this.updateOverview();
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error connecting to database. Make sure the server is running.');
        }
    }

    async loadLifts() {
        const response = await fetch(`${API_BASE}/lifts`);
        this.lifts = await response.json();
        this.renderLifts();
    }

    async loadFinances() {
        const response = await fetch(`${API_BASE}/finances`);
        this.finances = await response.json();
        this.renderFinances();
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

    // LIFTS FUNCTIONALITY
    setupLifts() {
        const addBtn = document.getElementById('add-lift-btn');
        const cancelBtn = document.getElementById('cancel-lift-btn');
        const form = document.getElementById('lift-entry-form');
        const formContainer = document.getElementById('lift-form');

        // Set default date to today
        document.getElementById('lift-date').valueAsDate = new Date();

        addBtn.addEventListener('click', () => {
            formContainer.classList.remove('hidden');
            addBtn.style.display = 'none';
        });

        cancelBtn.addEventListener('click', () => {
            formContainer.classList.add('hidden');
            addBtn.style.display = 'block';
            form.reset();
            document.getElementById('lift-date').valueAsDate = new Date();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addLift();
        });
    }

    async addLift() {
        const lift = {
            date: document.getElementById('lift-date').value,
            exercise: document.getElementById('lift-exercise').value,
            weight: parseFloat(document.getElementById('lift-weight').value),
            sets: parseInt(document.getElementById('lift-sets').value),
            reps: parseInt(document.getElementById('lift-reps').value),
            notes: document.getElementById('lift-notes').value
        };

        try {
            const response = await fetch(`${API_BASE}/lifts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lift)
            });

            if (response.ok) {
                await this.loadLifts();

                // Reset form
                document.getElementById('lift-entry-form').reset();
                document.getElementById('lift-date').valueAsDate = new Date();
                document.getElementById('lift-form').classList.add('hidden');
                document.getElementById('add-lift-btn').style.display = 'block';
            }
        } catch (error) {
            console.error('Error adding lift:', error);
            alert('Error saving lift. Make sure the server is running.');
        }
    }

    async deleteLift(id) {
        if (confirm('Are you sure you want to delete this lift?')) {
            try {
                await fetch(`${API_BASE}/lifts/${id}`, { method: 'DELETE' });
                await this.loadLifts();
            } catch (error) {
                console.error('Error deleting lift:', error);
                alert('Error deleting lift.');
            }
        }
    }

    renderLifts() {
        const container = document.getElementById('lifts-list');

        if (this.lifts.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No lifts logged yet. Start tracking your progress!</p></div>';
            return;
        }

        container.innerHTML = this.lifts.map(lift => {
            const volume = lift.weight * lift.sets * lift.reps;
            return `
                <div class="list-item">
                    <div class="item-content">
                        <div class="item-header">
                            <span class="item-title">${lift.exercise}</span>
                            <span class="item-date">${this.formatDate(lift.date)}</span>
                        </div>
                        <div class="item-details">
                            ${lift.weight} lbs × ${lift.sets} sets × ${lift.reps} reps = <strong>${volume} lbs total volume</strong>
                        </div>
                        ${lift.notes ? `<div class="item-notes">${lift.notes}</div>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn-delete" onclick="app.deleteLift(${lift.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // FINANCES FUNCTIONALITY
    setupFinances() {
        const addBtn = document.getElementById('add-finance-btn');
        const cancelBtn = document.getElementById('cancel-finance-btn');
        const form = document.getElementById('finance-entry-form');
        const formContainer = document.getElementById('finance-form');

        // Set default date to today
        document.getElementById('finance-date').valueAsDate = new Date();

        addBtn.addEventListener('click', () => {
            formContainer.classList.remove('hidden');
            addBtn.style.display = 'none';
        });

        cancelBtn.addEventListener('click', () => {
            formContainer.classList.add('hidden');
            addBtn.style.display = 'block';
            form.reset();
            document.getElementById('finance-date').valueAsDate = new Date();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addFinance();
        });
    }

    async addFinance() {
        const finance = {
            date: document.getElementById('finance-date').value,
            type: document.getElementById('finance-type').value,
            category: document.getElementById('finance-category').value,
            amount: parseFloat(document.getElementById('finance-amount').value),
            description: document.getElementById('finance-description').value
        };

        try {
            const response = await fetch(`${API_BASE}/finances`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finance)
            });

            if (response.ok) {
                await this.loadFinances();

                // Reset form
                document.getElementById('finance-entry-form').reset();
                document.getElementById('finance-date').valueAsDate = new Date();
                document.getElementById('finance-form').classList.add('hidden');
                document.getElementById('add-finance-btn').style.display = 'block';
            }
        } catch (error) {
            console.error('Error adding finance:', error);
            alert('Error saving transaction. Make sure the server is running.');
        }
    }

    async deleteFinance(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            try {
                await fetch(`${API_BASE}/finances/${id}`, { method: 'DELETE' });
                await this.loadFinances();
            } catch (error) {
                console.error('Error deleting finance:', error);
                alert('Error deleting transaction.');
            }
        }
    }

    renderFinances() {
        const container = document.getElementById('finances-list');

        // Calculate totals
        let totalIncome = 0;
        let totalExpenses = 0;

        this.finances.forEach(finance => {
            if (finance.type === 'income') {
                totalIncome += finance.amount;
            } else {
                totalExpenses += finance.amount;
            }
        });

        const netBalance = totalIncome - totalExpenses;

        // Update summary cards
        document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('net-balance').textContent = `$${netBalance.toFixed(2)}`;

        if (this.finances.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No transactions logged yet. Start tracking your finances!</p></div>';
            return;
        }

        container.innerHTML = this.finances.map(finance => `
            <div class="list-item">
                <div class="item-content">
                    <div class="item-header">
                        <span class="item-title">${finance.category}</span>
                        <span class="badge ${finance.type}">${finance.type === 'income' ? '+' : '-'}$${finance.amount.toFixed(2)}</span>
                    </div>
                    <div class="item-details">
                        ${this.formatDate(finance.date)} • ${finance.type.charAt(0).toUpperCase() + finance.type.slice(1)}
                    </div>
                    ${finance.description ? `<div class="item-notes">${finance.description}</div>` : ''}
                </div>
                <div class="item-actions">
                    <button class="btn-delete" onclick="app.deleteFinance(${finance.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // DAILY CHECK-IN FUNCTIONALITY
    setupDaily() {
        const addBtn = document.getElementById('add-daily-btn');
        const cancelBtn = document.getElementById('cancel-daily-btn');
        const form = document.getElementById('daily-entry-form');
        const formContainer = document.getElementById('daily-form');
        const energySlider = document.getElementById('daily-energy');
        const productivitySlider = document.getElementById('daily-productivity');

        // Set default date to today
        document.getElementById('daily-date').valueAsDate = new Date();

        // Update slider values
        energySlider.addEventListener('input', (e) => {
            document.getElementById('energy-value').textContent = e.target.value;
        });

        productivitySlider.addEventListener('input', (e) => {
            document.getElementById('productivity-value').textContent = e.target.value;
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
            document.getElementById('energy-value').textContent = '5';
            document.getElementById('productivity-value').textContent = '5';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addDailyCheckin();
        });
    }

    async addDailyCheckin() {
        const checkin = {
            date: document.getElementById('daily-date').value,
            mood: document.getElementById('daily-mood').value,
            energy: parseInt(document.getElementById('daily-energy').value),
            productivity: parseInt(document.getElementById('daily-productivity').value),
            notes: document.getElementById('daily-notes').value,
            grateful: document.getElementById('daily-grateful').value
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
                document.getElementById('energy-value').textContent = '5';
                document.getElementById('productivity-value').textContent = '5';
                document.getElementById('daily-form').classList.add('hidden');
                document.getElementById('add-daily-btn').style.display = 'block';
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
            } catch (error) {
                console.error('Error deleting check-in:', error);
                alert('Error deleting check-in.');
            }
        }
    }

    getMoodEmoji(mood) {
        const moodEmojis = {
            'amazing': '🤩',
            'great': '😊',
            'good': '🙂',
            'okay': '😐',
            'bad': '😔',
            'terrible': '😢'
        };
        return moodEmojis[mood] || '🙂';
    }

    renderDailyCheckins() {
        const container = document.getElementById('daily-list');

        if (this.dailyCheckins.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No check-ins logged yet. Start tracking your daily progress!</p></div>';
            return;
        }

        container.innerHTML = this.dailyCheckins.map(checkin => `
            <div class="list-item">
                <div class="item-content">
                    <div class="item-header">
                        <span class="item-title">
                            <span class="mood-indicator">${this.getMoodEmoji(checkin.mood)}</span>
                            ${checkin.mood.charAt(0).toUpperCase() + checkin.mood.slice(1)}
                        </span>
                        <span class="item-date">${this.formatDate(checkin.date)}</span>
                    </div>
                    <div class="item-details">
                        Energy: ${checkin.energy}/10 • Productivity: ${checkin.productivity}/10
                    </div>
                    ${checkin.notes ? `<div class="item-notes"><strong>Notes:</strong> ${checkin.notes}</div>` : ''}
                    ${checkin.grateful ? `<div class="item-notes"><strong>Grateful for:</strong> ${checkin.grateful}</div>` : ''}
                </div>
                <div class="item-actions">
                    <button class="btn-delete" onclick="app.deleteDailyCheckin(${checkin.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // OVERVIEW FUNCTIONALITY
    setupOverview() {
        // Overview is updated when tab is clicked or data changes
    }

    updateOverview() {
        // Lift stats
        const totalWorkouts = this.lifts.length;
        const totalVolume = this.lifts.reduce((sum, lift) => {
            return sum + (lift.weight * lift.sets * lift.reps);
        }, 0);

        document.getElementById('total-workouts').textContent = totalWorkouts;
        document.getElementById('total-volume').textContent = totalVolume.toLocaleString();

        // Finance stats
        const totalTransactions = this.finances.length;
        let yearIncome = 0;
        let yearExpenses = 0;

        this.finances.forEach(finance => {
            if (finance.type === 'income') {
                yearIncome += finance.amount;
            } else {
                yearExpenses += finance.amount;
            }
        });

        const yearNet = yearIncome - yearExpenses;

        document.getElementById('total-transactions').textContent = totalTransactions;
        document.getElementById('year-net').textContent = `$${yearNet.toFixed(2)}`;

        // Daily stats
        const totalCheckins = this.dailyCheckins.length;
        const avgEnergy = totalCheckins > 0
            ? (this.dailyCheckins.reduce((sum, c) => sum + c.energy, 0) / totalCheckins).toFixed(1)
            : 0;
        const avgProductivity = totalCheckins > 0
            ? (this.dailyCheckins.reduce((sum, c) => sum + c.productivity, 0) / totalCheckins).toFixed(1)
            : 0;

        document.getElementById('total-checkins').textContent = totalCheckins;
        document.getElementById('avg-energy').textContent = avgEnergy;
        document.getElementById('avg-productivity').textContent = avgProductivity;
    }

    // DATA MANAGEMENT
    setupDataManagement() {
        const exportBtn = document.getElementById('export-data-btn');
        const clearBtn = document.getElementById('clear-data-btn');

        exportBtn.addEventListener('click', () => this.exportData());
        clearBtn.addEventListener('click', () => this.clearAllData());

        // Remove import functionality as it's not implemented in backend
        const importBtn = document.getElementById('import-data-btn');
        const importInput = document.getElementById('import-file-input');
        if (importBtn) importBtn.style.display = 'none';
        if (importInput) importInput.style.display = 'none';
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
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new YearTracker();
});
