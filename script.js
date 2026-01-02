// Year Tracker App - Main JavaScript

class YearTracker {
    constructor() {
        this.lifts = this.loadData('lifts') || [];
        this.finances = this.loadData('finances') || [];
        this.dailyCheckins = this.loadData('dailyCheckins') || [];
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupLifts();
        this.setupFinances();
        this.setupDaily();
        this.setupOverview();
        this.setupDataManagement();
        this.updateAllViews();
    }

    // Local Storage Methods
    loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Error loading ${key}:`, e);
            return null;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving ${key}:`, e);
            alert('Error saving data. Storage might be full.');
        }
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

        this.renderLifts();
    }

    addLift() {
        const lift = {
            id: Date.now(),
            date: document.getElementById('lift-date').value,
            exercise: document.getElementById('lift-exercise').value,
            weight: parseFloat(document.getElementById('lift-weight').value),
            sets: parseInt(document.getElementById('lift-sets').value),
            reps: parseInt(document.getElementById('lift-reps').value),
            notes: document.getElementById('lift-notes').value
        };

        this.lifts.unshift(lift);
        this.saveData('lifts', this.lifts);
        this.renderLifts();

        // Reset form
        document.getElementById('lift-entry-form').reset();
        document.getElementById('lift-date').valueAsDate = new Date();
        document.getElementById('lift-form').classList.add('hidden');
        document.getElementById('add-lift-btn').style.display = 'block';
    }

    deleteLift(id) {
        if (confirm('Are you sure you want to delete this lift?')) {
            this.lifts = this.lifts.filter(lift => lift.id !== id);
            this.saveData('lifts', this.lifts);
            this.renderLifts();
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

        this.renderFinances();
    }

    addFinance() {
        const finance = {
            id: Date.now(),
            date: document.getElementById('finance-date').value,
            type: document.getElementById('finance-type').value,
            category: document.getElementById('finance-category').value,
            amount: parseFloat(document.getElementById('finance-amount').value),
            description: document.getElementById('finance-description').value
        };

        this.finances.unshift(finance);
        this.saveData('finances', this.finances);
        this.renderFinances();

        // Reset form
        document.getElementById('finance-entry-form').reset();
        document.getElementById('finance-date').valueAsDate = new Date();
        document.getElementById('finance-form').classList.add('hidden');
        document.getElementById('add-finance-btn').style.display = 'block';
    }

    deleteFinance(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.finances = this.finances.filter(finance => finance.id !== id);
            this.saveData('finances', this.finances);
            this.renderFinances();
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

        this.renderDailyCheckins();
    }

    addDailyCheckin() {
        const checkin = {
            id: Date.now(),
            date: document.getElementById('daily-date').value,
            mood: document.getElementById('daily-mood').value,
            energy: parseInt(document.getElementById('daily-energy').value),
            productivity: parseInt(document.getElementById('daily-productivity').value),
            notes: document.getElementById('daily-notes').value,
            grateful: document.getElementById('daily-grateful').value
        };

        this.dailyCheckins.unshift(checkin);
        this.saveData('dailyCheckins', this.dailyCheckins);
        this.renderDailyCheckins();

        // Reset form
        document.getElementById('daily-entry-form').reset();
        document.getElementById('daily-date').valueAsDate = new Date();
        document.getElementById('energy-value').textContent = '5';
        document.getElementById('productivity-value').textContent = '5';
        document.getElementById('daily-form').classList.add('hidden');
        document.getElementById('add-daily-btn').style.display = 'block';
    }

    deleteDailyCheckin(id) {
        if (confirm('Are you sure you want to delete this check-in?')) {
            this.dailyCheckins = this.dailyCheckins.filter(checkin => checkin.id !== id);
            this.saveData('dailyCheckins', this.dailyCheckins);
            this.renderDailyCheckins();
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
        const importBtn = document.getElementById('import-data-btn');
        const importInput = document.getElementById('import-file-input');
        const clearBtn = document.getElementById('clear-data-btn');

        exportBtn.addEventListener('click', () => this.exportData());
        importBtn.addEventListener('click', () => importInput.click());
        importInput.addEventListener('change', (e) => this.importData(e));
        clearBtn.addEventListener('click', () => this.clearAllData());
    }

    exportData() {
        const data = {
            lifts: this.lifts,
            finances: this.finances,
            dailyCheckins: this.dailyCheckins,
            exportDate: new Date().toISOString()
        };

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
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (confirm('This will replace all current data. Are you sure?')) {
                    this.lifts = data.lifts || [];
                    this.finances = data.finances || [];
                    this.dailyCheckins = data.dailyCheckins || [];

                    this.saveData('lifts', this.lifts);
                    this.saveData('finances', this.finances);
                    this.saveData('dailyCheckins', this.dailyCheckins);

                    this.updateAllViews();
                    alert('Data imported successfully!');
                }
            } catch (error) {
                alert('Error importing data. Please check the file format.');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
            if (confirm('Really sure? This will delete everything!')) {
                this.lifts = [];
                this.finances = [];
                this.dailyCheckins = [];

                localStorage.removeItem('lifts');
                localStorage.removeItem('finances');
                localStorage.removeItem('dailyCheckins');

                this.updateAllViews();
                alert('All data cleared.');
            }
        }
    }

    updateAllViews() {
        this.renderLifts();
        this.renderFinances();
        this.renderDailyCheckins();
        this.updateOverview();
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
