// Pomodoro Timer
class PomodoroTimer {
    constructor() {
        this.workTime = 25;
        this.breakTime = 5;
        this.timeLeft = this.workTime * 60;
        this.isRunning = false;
        this.isWorkTime = true;
        this.timer = null;
        
        this.timerDisplay = document.getElementById('timer');
        this.startButton = document.getElementById('start-timer');
        this.resetButton = document.getElementById('reset-timer');
        this.workTimeInput = document.getElementById('work-time');
        this.breakTimeInput = document.getElementById('break-time');
        this.saveSettingsButton = document.getElementById('save-settings');
        
        this.initializeEventListeners();
        this.updateDisplay();
    }
    
    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.toggleTimer());
        this.resetButton.addEventListener('click', () => this.resetTimer());
        this.saveSettingsButton.addEventListener('click', () => this.saveSettings());
    }
    
    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    
    startTimer() {
        this.isRunning = true;
        this.startButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft === 0) {
                this.playNotification();
                this.switchMode();
            }
        }, 1000);
    }
    
    pauseTimer() {
        this.isRunning = false;
        this.startButton.innerHTML = '<i class="fas fa-play"></i> Start';
        clearInterval(this.timer);
    }
    
    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.isWorkTime ? this.workTime * 60 : this.breakTime * 60;
        this.updateDisplay();
    }
    
    switchMode() {
        this.isWorkTime = !this.isWorkTime;
        this.timeLeft = this.isWorkTime ? this.workTime * 60 : this.breakTime * 60;
        this.updateDisplay();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    saveSettings() {
        const newWorkTime = parseInt(this.workTimeInput.value);
        const newBreakTime = parseInt(this.breakTimeInput.value);
        
        if (newWorkTime >= 1 && newWorkTime <= 60 && newBreakTime >= 1 && newBreakTime <= 30) {
            this.workTime = newWorkTime;
            this.breakTime = newBreakTime;
            this.resetTimer();
        } else {
            alert('Please enter valid times: Work time (1-60 minutes) and Break time (1-30 minutes)');
        }
    }
    
    playNotification() {
        const audio = new Audio('notification.mp3');
        audio.play().catch(error => console.log('Audio playback failed:', error));
    }
}

// Label Filtering
class LabelFilter {
    constructor() {
        this.currentFilter = 'all';
        this.filterButtons = document.querySelectorAll('.label-filter');
        this.taskList = document.querySelector('.task-list');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.handleFilterClick(button));
        });
    }
    
    handleFilterClick(button) {
        // Remove active class from all buttons
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update current filter
        this.currentFilter = button.dataset.label;
        
        // Filter tasks
        this.filterTasks();
    }
    
    filterTasks() {
        const tasks = this.taskList.querySelectorAll('.task-item');
        
        tasks.forEach(task => {
            if (this.currentFilter === 'all') {
                task.style.display = 'block';
            } else {
                const taskLabels = task.dataset.labels.split(' ');
                if (taskLabels.includes(this.currentFilter)) {
                    task.style.display = 'block';
                } else {
                    task.style.display = 'none';
                }
            }
        });
    }
}

// Task Management
class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskList = document.querySelector('.task-list');
        this.addTaskBtn = document.querySelector('.add-task-btn');
        this.taskModal = document.getElementById('task-modal');
        this.taskForm = document.getElementById('task-form');
        this.closeModalBtn = document.querySelector('.close-modal');
        this.subtaskList = document.querySelector('.subtask-list');
        this.subtaskInput = document.querySelector('.subtask-input input');
        this.addSubtaskBtn = document.querySelector('.add-subtask');
        
        this.initializeEventListeners();
        this.loadTasks();
    }
    
    initializeEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.openModal());
        this.taskForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.addSubtaskBtn.addEventListener('click', () => this.addSubtask());
        
        // Label selection
        document.querySelectorAll('.label-selector .label').forEach(label => {
            label.addEventListener('click', () => {
                label.classList.toggle('selected');
            });
        });
        
        // Close modal when clicking outside
        this.taskModal.addEventListener('click', (e) => {
            if (e.target === this.taskModal) {
                this.closeModal();
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    openModal() {
        this.taskModal.style.display = 'block';
    }
    
    closeModal() {
        this.taskModal.style.display = 'none';
        this.taskForm.reset();
        this.subtaskList.innerHTML = '';
        // Reset label selection
        document.querySelectorAll('.label-selector .label').forEach(label => {
            label.classList.remove('selected');
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = document.getElementById('task-due-date').value;
        
        // Get selected labels
        const selectedLabels = Array.from(document.querySelectorAll('.label-selector .label.selected'))
            .map(label => label.dataset.label);
        
        // Get subtasks
        const subtasks = Array.from(this.subtaskList.querySelectorAll('li'))
            .map(li => ({
                text: li.querySelector('.subtask-text').textContent,
                completed: false
            }));
        
        const task = new Task(title, description, dueDate, selectedLabels, subtasks);
        this.addTask(task);
        
        this.closeModal();
        this.saveTasks();
    }
    
    addTask(task) {
        this.tasks.push(task);
        this.taskList.appendChild(task.createTaskElement());
    }
    
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    
    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            this.tasks.forEach(task => {
                this.taskList.appendChild(task.createTaskElement());
            });
        }
    }
    
    addSubtask() {
        const subtaskText = this.subtaskInput.value.trim();
        if (subtaskText) {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" class="subtask-checkbox">
                <span class="subtask-text">${subtaskText}</span>
                <button class="delete-subtask"><i class="fas fa-times"></i></button>
            `;
            
            const deleteBtn = li.querySelector('.delete-subtask');
            deleteBtn.addEventListener('click', () => li.remove());
            
            this.subtaskList.appendChild(li);
            this.subtaskInput.value = '';
        }
    }
}

// Update Task class
class Task {
    constructor(title, description, dueDate, labels = [], subtasks = []) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.labels = labels;
        this.subtasks = subtasks;
        this.completed = false;
        this.id = Date.now();
    }
    
    createTaskElement() {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.dataset.labels = this.labels.join(' ');
        
        const labelHTML = this.labels.map(label => 
            `<span class="label ${label}">${label}</span>`
        ).join('');
        
        const subtaskHTML = this.subtasks.length > 0 ? `
            <div class="subtasks">
                <h4>Subtasks</h4>
                <ul>
                    ${this.subtasks.map(subtask => `
                        <li>
                            <input type="checkbox" class="subtask-checkbox" ${subtask.completed ? 'checked' : ''}>
                            <span class="subtask-text">${subtask.text}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        ` : '';
        
        taskElement.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${this.completed ? 'checked' : ''}>
                <div class="task-info">
                    <h3>${this.title}</h3>
                    <p>${this.description}</p>
                    ${this.dueDate ? `<span class="due-date">${this.formatDate(this.dueDate)}</span>` : ''}
                </div>
            </div>
            <div class="task-labels">
                ${labelHTML}
            </div>
            ${subtaskHTML}
            <div class="task-actions">
                <button class="delete-task"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add event listeners
        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => this.toggleComplete(taskElement));
        
        const deleteBtn = taskElement.querySelector('.delete-task');
        deleteBtn.addEventListener('click', () => this.deleteTask(taskElement));
        
        return taskElement;
    }
    
    toggleComplete(taskElement) {
        this.completed = !this.completed;
        taskElement.classList.toggle('completed', this.completed);
        this.saveTasks();
    }
    
    deleteTask(taskElement) {
        taskElement.remove();
        const taskManager = new TaskManager();
        taskManager.tasks = taskManager.tasks.filter(task => task.id !== this.id);
        taskManager.saveTasks();
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Navigation
class Navigation {
    constructor() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.sections = document.querySelectorAll('.task-section');
        this.currentSection = 'tasks';
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
    }
    
    switchSection(section) {
        // Update active state
        this.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });
        
        // Update current section
        this.currentSection = section;
        
        // Update content based on section
        this.updateContent(section);
    }
    
    updateContent(section) {
        const taskList = document.querySelector('.task-list');
        const tasks = Array.from(taskList.querySelectorAll('.task-item'));
        
        switch(section) {
            case 'today':
                this.filterTodayTasks(tasks);
                break;
            case 'upcoming':
                this.filterUpcomingTasks(tasks);
                break;
            case 'labels':
                this.showAllTasks(tasks);
                break;
            default:
                this.showAllTasks(tasks);
        }
    }
    
    filterTodayTasks(tasks) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        tasks.forEach(task => {
            const dueDate = new Date(task.dataset.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            if (dueDate.getTime() === today.getTime()) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
    }
    
    filterUpcomingTasks(tasks) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        tasks.forEach(task => {
            const dueDate = new Date(task.dataset.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            if (dueDate > today) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
    }
    
    showAllTasks(tasks) {
        tasks.forEach(task => {
            task.style.display = 'block';
        });
    }
}

// Theme Switcher
class ThemeSwitcher {
    constructor() {
        this.themeSwitch = document.getElementById('theme-switch');
        this.body = document.body;
        this.isDark = false;
        
        this.initializeEventListeners();
        this.loadTheme();
    }
    
    initializeEventListeners() {
        this.themeSwitch.addEventListener('click', () => this.toggleTheme());
    }
    
    toggleTheme() {
        this.isDark = !this.isDark;
        this.updateTheme();
    }
    
    updateTheme() {
        if (this.isDark) {
            this.body.setAttribute('data-theme', 'dark');
            this.themeSwitch.innerHTML = '<i class="fas fa-sun"></i>';
            this.updateColors('dark');
        } else {
            this.body.setAttribute('data-theme', 'light');
            this.themeSwitch.innerHTML = '<i class="fas fa-moon"></i>';
            this.updateColors('light');
        }
        this.saveTheme();
    }
    
    updateColors(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.style.setProperty('--primary-bg', '#1a1a1a');
            root.style.setProperty('--secondary-bg', '#2c3e50');
            root.style.setProperty('--text-color', '#ecf0f1');
            root.style.setProperty('--task-bg', '#2d2d2d');
            root.style.setProperty('--modal-bg', '#2d2d2d');
            root.style.setProperty('--border-color', '#404040');
        } else {
            root.style.setProperty('--primary-bg', '#f5f6fa');
            root.style.setProperty('--secondary-bg', '#2c3e50');
            root.style.setProperty('--text-color', '#2c3e50');
            root.style.setProperty('--task-bg', '#ffffff');
            root.style.setProperty('--modal-bg', '#ffffff');
            root.style.setProperty('--border-color', '#e0e0e0');
        }
    }
    
    saveTheme() {
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDark = true;
            this.updateTheme();
        }
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
    new ThemeSwitcher();
    new PomodoroTimer();
    new LabelFilter();
    new TaskManager();
}); 