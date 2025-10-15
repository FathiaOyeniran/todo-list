// State and storage
const STORAGE_KEY = 'todos:v1';
const THEME_KEY = 'theme:v1';

function loadTodos() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveTodos(todos) { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); }

let todos = loadTodos();
let currentFilter = 'all';

// Elements
const form = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const dateInput = document.getElementById('dueDate');
const timeInput = document.getElementById('dueTime');
const categoryInput = document.getElementById('category');
const listEl = document.getElementById('task-list');
const filterButtons = Array.from(document.querySelectorAll('.filters .filter'));
const darkToggle = document.getElementById('darkToggle');

// Theme
function applyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
}
function initTheme() {
    const theme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(theme);
    if (darkToggle) darkToggle.checked = theme === 'dark';
}
if (darkToggle) {
    darkToggle.addEventListener('change', () => applyTheme(darkToggle.checked ? 'dark' : 'light'));
}

// Helpers
function generateId() { return Math.random().toString(36).slice(2, 10); }
function getDueString(t) {
    if (!t.dueDate && !t.dueTime) return '';
    const parts = [];
    if (t.dueDate) parts.push(t.dueDate);
    if (t.dueTime) parts.push(t.dueTime);
    return `(Due: ${parts.join(' ')})`;
}

// Render
function render() {
    listEl.innerHTML = '';
    const filtered = todos.filter(t => currentFilter === 'all' || (currentFilter === 'pending' ? !t.completed : t.completed));
    for (const t of filtered) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('role', 'listitem');

        const left = document.createElement('div');
        left.className = 'task-left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!t.completed;
        checkbox.setAttribute('aria-label', 'Mark complete');
        checkbox.addEventListener('change', () => {
            t.completed = checkbox.checked;
            saveTodos(todos);
            render();
        });

        const text = document.createElement('span');
        text.className = 'task-text';
        text.textContent = t.title + ' ' + getDueString(t);
        if (t.category) {
            const cat = document.createElement('span');
            cat.className = 'task-category';
            cat.textContent = ` [${t.category}]`;
            text.appendChild(cat);
        }

        left.appendChild(checkbox);
        left.appendChild(text);

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => startEdit(t));

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'btn danger';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => {
            todos = todos.filter(x => x.id !== t.id);
            saveTodos(todos);
            render();
        });

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        li.appendChild(left);
        li.appendChild(actions);
        listEl.appendChild(li);
    }
}

// Editing
let editingId = null;
function startEdit(t) {
    editingId = t.id;
    titleInput.value = t.title;
    dateInput.value = t.dueDate || '';
    timeInput.value = t.dueTime || '';
    categoryInput.value = t.category || '';
    titleInput.focus();
}

// Submit
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        if (!title) { titleInput.focus(); return; }
        const dueDate = dateInput.value || '';
        const dueTime = timeInput.value || '';
        const category = categoryInput.value.trim();

        if (editingId) {
            const idx = todos.findIndex(t => t.id === editingId);
            if (idx > -1) {
                todos[idx] = { ...todos[idx], title, dueDate, dueTime, category };
            }
            editingId = null;
        } else {
            todos.push({ id: generateId(), title, dueDate, dueTime, category, completed: false });
        }

        saveTodos(todos);
        form.reset();
        render();
    });
}

// Filters
for (const btn of filterButtons) {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        for (const b of filterButtons) b.setAttribute('aria-pressed', String(b === btn));
        render();
    });
}

// Init
initTheme();
render();


