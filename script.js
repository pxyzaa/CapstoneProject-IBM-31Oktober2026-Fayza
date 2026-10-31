/* =========================================================
   Onboarding Buddy – script.js
   ========================================================= */

'use strict';

/* ── 1. DEFAULT TASKS ── */
const DEFAULT_TASKS = [
  'Perkenalkan diri ke seluruh anggota tim',
  'Setup akun email kantor',
  'Baca panduan dan aturan perusahaan',
  'Install aplikasi kerja (Slack, Zoom, dll.)',
  'Ikuti sesi orientasi bersama HR',
  'Minta akses sistem yang diperlukan',
  'Kenali struktur organisasi dan atasan langsung',
  'Jadwalkan 1-on-1 dengan manajermu di minggu pertama',
];

/* ── 2. DOM REFERENCES ── */
const taskList     = document.getElementById('task-list');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const progressPct  = document.getElementById('progress-percent');
const progressBar  = document.querySelector('.progress-track');
const completionMsg = document.getElementById('completion-msg');
const newTaskInput = document.getElementById('new-task-input');
const btnAdd       = document.getElementById('btn-add');
const addError     = document.getElementById('add-error');

/* ── 3. STATE ── */
// Array of { id, text, done }
let tasks = DEFAULT_TASKS.map((text, i) => ({ id: i + 1, text, done: false }));
let nextId = tasks.length + 1;

/* ── 4. RENDER ── */

/** Render ulang seluruh daftar tugas ke DOM. */
function render() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    taskList.appendChild(buildItem(task));
  });
  updateProgress();
}

/** Buat elemen <li> untuk satu tugas. */
function buildItem(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.done ? ' done' : '');
  li.dataset.id = task.id;

  // Checkbox
  const cb = document.createElement('input');
  cb.type    = 'checkbox';
  cb.checked = task.done;
  cb.className = 'task-checkbox';
  cb.id = `task-cb-${task.id}`;
  cb.setAttribute('aria-label', task.text);
  cb.addEventListener('change', () => toggleTask(task.id));

  // Label
  const label = document.createElement('label');
  label.htmlFor   = `task-cb-${task.id}`;
  label.className = 'task-label';
  label.textContent = task.text;

  // Delete button
  const del = document.createElement('button');
  del.className = 'task-delete';
  del.type = 'button';
  del.textContent = '✕';
  del.setAttribute('aria-label', `Hapus tugas: ${task.text}`);
  del.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(cb);
  li.appendChild(label);
  li.appendChild(del);
  return li;
}

/* ── 5. PROGRESS UPDATE ── */

/** Hitung persentase dan perbarui progress bar + teks. */
function updateProgress() {
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  progressFill.style.width = pct + '%';
  progressText.textContent = `${done} dari ${total} selesai (${pct}%)`;
  progressPct.textContent  = pct + '%';
  progressBar.setAttribute('aria-valuenow', pct);

  // Warna hijau + pesan selamat saat semua tugas selesai
  const allDone = total > 0 && done === total;
  progressFill.classList.toggle('complete', allDone);
  completionMsg.classList.toggle('show', allDone);
}

/* ── 6. ACTIONS ── */

/** Toggle status selesai/belum pada tugas. */
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;

  // Update hanya item yang berubah, tanpa render ulang seluruh list
  const li = taskList.querySelector(`[data-id="${id}"]`);
  if (li) {
    li.classList.toggle('done', task.done);
    const cb = li.querySelector('.task-checkbox');
    if (cb) cb.checked = task.done;
  }
  updateProgress();
}

/** Hapus tugas dari daftar. */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  const li = taskList.querySelector(`[data-id="${id}"]`);
  if (li) li.remove();
  updateProgress();
}

/** Tambah tugas baru dari input. */
function addTask() {
  const text = newTaskInput.value.trim();

  // Validasi
  if (!text) {
    showError('Nama tugas tidak boleh kosong.');
    return;
  }
  if (text.length < 3) {
    showError('Nama tugas terlalu singkat, minimal 3 karakter.');
    return;
  }

  clearError();

  const task = { id: nextId++, text, done: false };
  tasks.push(task);
  taskList.appendChild(buildItem(task));
  updateProgress();

  // Reset input dan fokus kembali
  newTaskInput.value = '';
  newTaskInput.focus();
}

/* ── 7. VALIDATION HELPERS ── */

function showError(msg) {
  addError.textContent = msg;
  addError.hidden = false;
  newTaskInput.classList.add('invalid');
}

function clearError() {
  addError.hidden = true;
  addError.textContent = '';
  newTaskInput.classList.remove('invalid');
}

/* ── 8. EVENT LISTENERS ── */

// Tombol Tambah
btnAdd.addEventListener('click', addTask);

// Enter di input juga tambah tugas
newTaskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// Hapus error saat pengguna mulai mengetik lagi
newTaskInput.addEventListener('input', () => {
  if (newTaskInput.classList.contains('invalid')) clearError();
});

/* ── 9. INIT ── */
render();
