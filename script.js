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
    if (!listEl) return; // Exit if task list doesn't exist (not on tasks page)
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
        editBtn.className = 'btn icon';
        editBtn.setAttribute('aria-label', 'Edit task');
        editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/></svg>';
        editBtn.addEventListener('click', () => startEdit(t));

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'btn danger icon';
        delBtn.setAttribute('aria-label', 'Delete task');
        delBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>';
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
if (filterButtons.length > 0) {
    for (const btn of filterButtons) {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            for (const b of filterButtons) b.setAttribute('aria-pressed', String(b === btn));
            render();
        });
    }
}

// Init
initTheme();
if (listEl) render(); // Only render if we're on the tasks page


