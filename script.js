// ==============================
// Element selectors
// ==============================
const greeting = document.getElementById('greeting');
const nameInput = document.getElementById('nameInput');
const clock = document.getElementById('clock');
const date = document.getElementById('date');
const themeToggle = document.getElementById('themeToggle');
const timerDisplay = document.getElementById('timer');
const taskInput = document.getElementById('taskInput');
const taskProgress = document.getElementById('taskProgress');
const taskList = document.getElementById('taskList');
const linkName = document.getElementById('linkName');
const linkUrl = document.getElementById('linkUrl');
const linksContainer = document.getElementById('linksContainer');

// ==============================
// App state
// ==============================
const WAVE_ICON = String.fromCodePoint(0x1f44b);
const DEFAULT_TIMER_SECONDS = 1500;

let time = DEFAULT_TIMER_SECONDS;
let interval = null;
let currentFilter = 'all';
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let links = JSON.parse(localStorage.getItem('links') || '[]');

// ==============================
// Greeting section
// ==============================
function updateGreeting() {
    const hour = new Date().getHours();
    const username = localStorage.getItem('username') || 'Guys';
    const greetingText =
        hour < 12
            ? 'Good Morning'
            : hour < 18
                ? 'Good Afternoon'
                : 'Good Evening';

    greeting.textContent = `${greetingText}, ${username} ${WAVE_ICON}`;
}

function saveName() {
    const username = nameInput.value.trim();

    if (!username) return;

    localStorage.setItem('username', username);
    nameInput.value = '';
    updateGreeting();
}

// ==============================
// Clock and date section
// ==============================
function updateDateTime() {
    const now = new Date();

    clock.textContent = now.toLocaleTimeString('id-ID');
    date.textContent = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// ==============================
// Theme switch section
// ==============================
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.checked = true;
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark', themeToggle.checked);
    localStorage.setItem('theme', themeToggle.checked ? 'dark' : 'light');
}

// ==============================
// Focus timer section
// ==============================
function updateTimer() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (interval) return;

    interval = setInterval(() => {
        if (time > 0) {
            time--;
            updateTimer();
            return;
        }

        clearInterval(interval);
        interval = null;
        alert('Waktu fokus selesai!');
    }, 1000);
}

function pauseTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    clearInterval(interval);
    interval = null;
    time = DEFAULT_TIMER_SECONDS;
    updateTimer();
}

// ==============================
// To-do list section
// ==============================
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateProgress() {
    const completedTasks = tasks.filter((task) => task.completed).length;
    taskProgress.textContent = `${completedTasks} / ${tasks.length} completed`;
}

function setFilter(filter) {
    currentFilter = filter;
    renderTasks();
}

function getFilteredTasks() {
    if (currentFilter === 'active') {
        return tasks.filter((task) => !task.completed);
    }

    if (currentFilter === 'completed') {
        return tasks.filter((task) => task.completed);
    }

    return tasks;
}

function renderTasks() {
    taskList.innerHTML = '';

    getFilteredTasks().forEach((task) => {
        const taskIndex = tasks.indexOf(task);
        const listItem = document.createElement('li');

        listItem.innerHTML = `
            <span class="${task.completed ? 'done' : ''}">${task.text}</span>
            <div class="task-actions">
                <button onclick="toggleTask(${taskIndex})">&#10003;</button>
                <button onclick="deleteTask(${taskIndex})">&#128465;</button>
            </div>
        `;

        taskList.appendChild(listItem);
    });

    updateProgress();
}

function addTask() {
    const text = taskInput.value.trim();

    if (!text) return;

    tasks.unshift({
        text,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = '';
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// ==============================
// Quick links section
// ==============================
function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function renderLinks() {
    linksContainer.innerHTML = '';

    links.forEach((link, index) => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';

        linkItem.innerHTML = `
            <a href="${link.url}" target="_blank">${link.name}</a>
            <button onclick="deleteLink(${index})">&#128465;</button>
        `;

        linksContainer.appendChild(linkItem);
    });
}

function addLink() {
    const name = linkName.value.trim();
    const url = linkUrl.value.trim();

    if (!name || !url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('Input the correct url');
        return;
    }

    links.push({
        name,
        url
    });

    saveLinks();
    renderLinks();
    linkName.value = '';
    linkUrl.value = '';
}

function deleteLink(index) {
    links.splice(index, 1);
    saveLinks();
    renderLinks();
}

// ==============================
// Event listeners
// ==============================
themeToggle.addEventListener('change', toggleTheme);

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addTask();
});

nameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') saveName();
});

// ==============================
// Initial render
// ==============================
loadTheme();
updateGreeting();
updateDateTime();
updateTimer();
renderTasks();
renderLinks();
setInterval(updateDateTime, 1000);
