// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const searchInput = document.querySelector('.search-bar input');
const addTaskBtn = document.querySelector('.add-task-btn');
const taskList = document.querySelector('.task-list');
const taskModal = document.getElementById('task-modal');
const closeModal = document.querySelector('.close-modal');
const taskForm = document.getElementById('task-form');
const addSubtaskBtn = document.querySelector('.add-subtask');
const subtaskList = document.querySelector('.subtask-list');

// Task Data
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Theme Toggle
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}

// Modal Functions
function showModal() {
    taskModal.style.display = 'block';
}

function hideModal() {
    taskModal.style.display = 'none';
    taskForm.reset();
    subtaskList.innerHTML = '';
    document.querySelectorAll('.label').forEach(label => {
        label.classList.remove('selected');
    });
}

// Task Management
function addTask(event) {
    event.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    const selectedLabels = Array.from(document.querySelectorAll('.label.selected'))
        .map(label => label.dataset.label);

    const subtasks = Array.from(subtaskList.children).map(li => ({
        text: li.querySelector('span').textContent,
        completed: false
    }));

    const newTask = {
        id: Date.now(),
        title,
        description,
        dueDate,
        labels: selectedLabels,
        subtasks,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    hideModal();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="no-tasks">No tasks found</div>';
        return;
    }

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const labels = task.labels.map(label => 
            `<span class="label ${label}">${label}</span>`
        ).join('');

        const subtasks = task.subtasks.map(subtask => 
            `<li class="${subtask.completed ? 'completed' : ''}">
                <input type="checkbox" ${subtask.completed ? 'checked' : ''}>
                <span>${subtask.text}</span>
            </li>`
        ).join('');

        taskElement.innerHTML = `
            <div class="task-header">
                <h3 class="task-title">${task.title}</h3>
                <div class="task-actions">
                    <button class="complete-btn" data-id="${task.id}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="delete-btn" data-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
            <div class="task-meta">
                <span class="due-date">Due: ${new Date(task.dueDate).toLocaleString()}</span>
                ${task.labels.length > 0 ? `<div class="labels">${labels}</div>` : ''}
            </div>
            ${task.subtasks.length > 0 ? `
                <div class="subtasks">
                    <h4>Subtasks:</h4>
                    <ul>${subtasks}</ul>
                </div>
            ` : ''}
        `;

        // Add event listeners for task actions
        const completeBtn = taskElement.querySelector('.complete-btn');
        const deleteBtn = taskElement.querySelector('.delete-btn');
        
        completeBtn.addEventListener('click', () => toggleTaskCompletion(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(taskElement);
    });
}

// Subtask Management
function addSubtask() {
    const input = document.querySelector('.subtask-input input');
    const text = input.value.trim();
    
    if (text) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox">
            <span>${text}</span>
            <button class="delete-subtask"><i class="fas fa-times"></i></button>
        `;
        
        subtaskList.appendChild(li);
        input.value = '';

        // Add delete functionality
        const deleteBtn = li.querySelector('.delete-subtask');
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        // Add completion functionality
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            li.classList.toggle('completed', e.target.checked);
        });
    }
}

// Event Listeners
themeSwitch.addEventListener('click', toggleTheme);
addTaskBtn.addEventListener('click', showModal);
closeModal.addEventListener('click', hideModal);
taskForm.addEventListener('submit', addTask);
addSubtaskBtn.addEventListener('click', addSubtask);

// Label Selection
document.querySelectorAll('.label').forEach(label => {
    label.addEventListener('click', () => {
        label.classList.toggle('selected');
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    renderTasks();
});
