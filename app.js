/* ============================================================
   Ripple — shared app logic for every page
   Routed by <body data-page="..."> ; state persisted in localStorage
   ============================================================ */

/* ---------- Storage helpers ---------- */
const NS = 'ripple:';
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(NS + key); return v === null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, val) { localStorage.setItem(NS + key, JSON.stringify(val)); },
  del(key) { localStorage.removeItem(NS + key); }
};
const todayKey = () => new Date().toISOString().slice(0, 10);
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Theme (applied ASAP to limit flash) ---------- */
(function applyTheme() {
  if (store.get('theme', 'dark') === 'light') document.documentElement.classList.add('light');
})();

/* ---------- Toast ---------- */
function toast(msg) {
  let wrap = $('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 350); }, 2200);
}

/* ---------- Ripple click ink ---------- */
function attachRipples() {
  document.addEventListener('pointerdown', e => {
    const el = e.target.closest('.btn, .icon-btn, .chip, .tool-link, .mode-switch button, .swap-btn, .nav-links a, .water-btns .icon-btn, .seg button, .mood-chip');
    if (!el) return;
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const ink = document.createElement('span');
    ink.className = 'ripple-ink';
    ink.style.width = ink.style.height = size + 'px';
    ink.style.left = (e.clientX - r.left - size / 2) + 'px';
    ink.style.top  = (e.clientY - r.top  - size / 2) + 'px';
    el.appendChild(ink);
    setTimeout(() => ink.remove(), 620);
    sfx('tap');
  });
}

/* ---------- Nav: build, active state, mobile toggle, theme toggle ---------- */
const PAGES = [
  ['index.html', 'Home'],
  ['tasks.html', 'Tasks'],
  ['focus.html', 'Focus'],
  ['notes.html', 'Notes'],
  ['habits.html', 'Habits'],
  ['tools.html', 'Convert'],
  ['type.html', 'Type']
];
const ICON = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  cog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
};

/* Ripple logo mark — concentric ripples from a drop. `id` keeps gradients unique per instance. */
function logo(id = 'rg') {
  return `<svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#22d3ee"/><stop offset=".55" stop-color="#8b5cf6"/><stop offset="1" stop-color="#fb7185"/>
    </linearGradient></defs>
    <circle cx="24" cy="24" r="15" fill="none" stroke="url(#${id})" stroke-width="2.6" opacity=".3"/>
    <circle cx="24" cy="24" r="9.5" fill="none" stroke="url(#${id})" stroke-width="2.8" opacity=".62"/>
    <circle class="emanate" cx="24" cy="24" r="15" fill="none" stroke="url(#${id})" stroke-width="2.4"/>
    <circle cx="24" cy="24" r="4.3" fill="url(#${id})"/>
  </svg>`;
}

function buildNav() {
  const nav = $('#nav');
  if (!nav) return;
  const current = document.body.dataset.page;
  const cur = current === 'home' ? 'index' : current;
  const links = PAGES.map(([href, label]) =>
    `<a href="${href}" class="${href === cur + '.html' ? 'active' : ''}">${label}</a>`).join('');
  nav.innerHTML = `
    <a href="index.html" class="brand">${logo('navLogo')}Ripple</a>
    <div class="nav-links" id="navLinks">${links}</div>
    <a href="settings.html" class="icon-btn ${current === 'settings' ? 'active-cog' : ''}" aria-label="Settings">${ICON.cog}</a>
    <button class="icon-btn" id="themeBtn" aria-label="Toggle theme"></button>
    <button class="icon-btn nav-toggle" id="navToggle" aria-label="Menu">${ICON.menu}</button>`;

  const isLight = document.documentElement.classList.contains('light');
  const themeBtn = $('#themeBtn');
  themeBtn.innerHTML = isLight ? ICON.moon : ICON.sun;
  themeBtn.addEventListener('click', () => {
    const light = document.documentElement.classList.toggle('light');
    store.set('theme', light ? 'light' : 'dark');
    themeBtn.innerHTML = light ? ICON.moon : ICON.sun;
    sfx('toggle');
  });

  const navLinks = $('#navLinks');
  $('#navToggle').addEventListener('click', () => navLinks.classList.toggle('open'));
}

/* ---------- SVG snippets reused across pages ---------- */
const CHECK = '<svg viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6"/></svg>';
const TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7"/></svg>';

/* ============================================================
   HOME
   ============================================================ */
const QUOTES = [
  ['Small steps every day add up to big results.', 'keep going'],
  ['The secret of getting ahead is getting started.', 'Mark Twain'],
  ['You don’t have to be great to start, but you have to start to be great.', 'Zig Ziglar'],
  ['Focus on being productive instead of busy.', 'Tim Ferriss'],
  ['A river cuts through rock not by power, but by persistence.', 'proverb'],
  ['Well begun is half done.', 'Aristotle'],
  ['Discipline is choosing what you want most over what you want now.', 'reminder']
];

function initHome() {
  // onboarding name
  let name = store.get('name', null);
  if (!name) {
    const scrim = document.createElement('div');
    scrim.className = 'modal-scrim';
    scrim.innerHTML = `<div class="card modal">
      <div class="modal-logo">${logo('modalLogo')}</div>
      <h2>Welcome to Ripple</h2>
      <p>Your calm little corner for daily focus. What should I call you?</p>
      <input class="field" id="nameIn" placeholder="Your name" maxlength="24" autofocus>
      <button class="btn" id="nameSave" style="width:100%;justify-content:center">Let’s flow</button>
    </div>`;
    document.body.appendChild(scrim);
    const save = () => {
      const v = $('#nameIn').value.trim() || 'friend';
      store.set('name', v); scrim.remove(); renderGreeting();
    };
    $('#nameSave').addEventListener('click', save);
    $('#nameIn').addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
    $('#nameIn').focus();
  }

  function renderGreeting() {
    const h = new Date().getHours();
    const part = h < 5 ? 'still up' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Winding down';
    const nm = store.get('name', 'friend');
    $('#greeting').innerHTML = `${part}, <b>${nm}</b>`;
  }
  renderGreeting();

  // clock
  const clock = $('#clock');
  const dateEl = $('#todayDate');
  function tick() {
    const d = new Date();
    const t = formatTime(d);
    clock.innerHTML = `${t.main}<span class="sec">:${t.sec}${t.ap ? ' ' + t.ap : ''}</span>`;
    dateEl.textContent = formatDate(d, true);
  }
  tick(); setInterval(tick, 1000);

  // quote of the day (stable per day)
  const qIdx = parseInt(todayKey().replaceAll('-', ''), 10) % QUOTES.length;
  const [qt, qa] = QUOTES[qIdx];
  $('#quote').innerHTML = `“${qt}”<span>— ${qa}</span>`;

  // live stats
  const tasks = store.get('tasks', []);
  const pending = tasks.filter(t => !t.done).length;
  const focusToday = store.get('focus:' + todayKey(), 0);
  const habitsDone = (store.get('habits:done:' + todayKey(), [])).length;
  const water = store.get('water:' + todayKey(), 0);
  $('#stTasks').textContent = pending;
  $('#stFocus').textContent = focusToday;
  $('#stHabits').textContent = habitsDone;
  $('#stWater').textContent = water;

  // pointer glow on tool cards
  $$('.tool-link').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}

/* ============================================================
   TASKS
   ============================================================ */
function initTasks() {
  let tasks = store.get('tasks', []);
  let filter = 'all';
  const listEl = $('#taskList');
  const input = $('#taskInput');
  const priSel = $('#taskPri');

  const save = () => store.set('tasks', tasks);

  function render() {
    const shown = tasks.filter(t => filter === 'all' || (filter === 'active' && !t.done) || (filter === 'done' && t.done));
    if (!shown.length) {
      listEl.innerHTML = `<div class="empty"><div class="em-ic">🌊</div>
        <p>${filter === 'done' ? 'Nothing finished yet — the day is young.' : 'No tasks here. Add one above and let’s get moving.'}</p></div>`;
    } else {
      listEl.innerHTML = shown.map(t => `
        <li class="task ${t.done ? 'done' : ''}" data-id="${t.id}">
          <span class="pri ${t.pri}"></span>
          <button class="check" aria-label="Toggle done">${CHECK}</button>
          <span class="task-text">${escapeHtml(t.text)}</span>
          <button class="del" aria-label="Delete task">${TRASH}</button>
        </li>`).join('');
    }
    const left = tasks.filter(t => !t.done).length;
    $('#taskCount').textContent = `${left} task${left === 1 ? '' : 's'} left`;
  }

  function add() {
    const text = input.value.trim();
    if (!text) return;
    tasks.unshift({ id: Date.now(), text, done: false, pri: priSel.value });
    input.value = ''; save(); render(); sfx('add');
  }

  $('#addTask').addEventListener('click', add);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });

  listEl.addEventListener('click', e => {
    const li = e.target.closest('.task'); if (!li) return;
    const id = Number(li.dataset.id);
    if (e.target.closest('.check')) {
      const t = tasks.find(x => x.id === id); t.done = !t.done; save(); render();
      sfx(t.done ? 'complete' : 'tap');
    } else if (e.target.closest('.del')) {
      sfx('delete');
      li.style.opacity = '0'; li.style.transform = 'translateX(30px)';
      setTimeout(() => { tasks = tasks.filter(x => x.id !== id); save(); render(); }, 260);
    }
  });

  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active'); filter = c.dataset.filter; render();
  }));

  $('#clearDone').addEventListener('click', () => {
    const before = tasks.length;
    tasks = tasks.filter(t => !t.done); save(); render();
    if (tasks.length < before) toast('Cleared finished tasks');
  });

  render();
}

/* ============================================================
   FOCUS — water-fill Pomodoro
   ============================================================ */
function initFocus() {
  const DUR = store.get('focus:dur', { work: 25, short: 5, long: 15 });
  let mode = 'work';
  let remaining = DUR.work * 60;
  let total = remaining;
  let running = false;
  let ticker = null;
  let round = store.get('focus:round', 0); // completed work rounds in current cycle

  const timeEl = $('#timerTime');
  const stateEl = $('#timerState');
  const waterEl = $('#water');
  const startBtn = $('#startBtn');
  const stateNames = { work: 'Focus', short: 'Short break', long: 'Long break' };

  // durations config
  ['work', 'short', 'long'].forEach(k => {
    const inp = $('#dur-' + k);
    if (inp) {
      inp.value = DUR[k];
      inp.addEventListener('change', () => {
        DUR[k] = Math.max(1, Math.min(90, parseInt(inp.value) || DUR[k]));
        inp.value = DUR[k]; store.set('focus:dur', DUR);
        if (!running && mode === k) { remaining = DUR[k] * 60; total = remaining; paint(); }
      });
    }
  });

  function fmt(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }

  function paint() {
    timeEl.textContent = fmt(remaining);
    stateEl.textContent = stateNames[mode];
    const pct = 1 - remaining / total;               // rises as time passes
    waterEl.style.height = (pct * 100) + '%';
    document.title = running ? `${fmt(remaining)} · ${stateNames[mode]}` : 'Focus · Ripple';
    renderDots();
  }

  function renderDots() {
    $('#roundDots').innerHTML = Array.from({ length: 4 }, (_, i) =>
      `<i class="${i < round ? 'on' : ''}"></i>`).join('');
  }

  function setMode(m, auto) {
    mode = m; remaining = DUR[m] * 60; total = remaining;
    $$('.mode-switch button').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    stop(); paint();
    if (auto) start();
  }

  function start() {
    running = true; startBtn.textContent = 'Pause';
    ticker = setInterval(() => {
      remaining--; paint();
      if (remaining <= 0) complete();
    }, 1000);
  }
  function stop() {
    running = false; startBtn.textContent = 'Start';
    clearInterval(ticker); ticker = null;
  }

  function complete() {
    stop();
    try { beep(); } catch {}
    if (mode === 'work') {
      round++; store.set('focus:round', round);
      const done = store.get('focus:' + todayKey(), 0) + 1;
      store.set('focus:' + todayKey(), done);
      toast('Focus round done — nice work 🌊');
      if (round >= 4) { round = 0; store.set('focus:round', 0); setMode('long', true); }
      else setMode('short', true);
    } else {
      toast('Break over — back to it');
      setMode('work', true);
    }
  }

  $('#startBtn').addEventListener('click', () => running ? stop() : start());
  $('#resetBtn').addEventListener('click', () => { setMode(mode); });
  $$('.mode-switch button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

  // gentle chime via Web Audio
  function beep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [660, 880, 990];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.16;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.25, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.start(t); o.stop(t + 0.5);
    });
  }

  setMode('work'); paint();
}

/* ============================================================
   NOTES
   ============================================================ */
function initNotes() {
  /* ---- mode toggle: notes | diary ---- */
  let mode = store.get('notes:mode', 'notes');
  const notesView = $('#notesView'), diaryView = $('#diaryView');
  const seg = $('#notesMode');
  function applyMode() {
    notesView.hidden = mode !== 'notes';
    diaryView.hidden = mode !== 'diary';
    $$('button', seg).forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    store.set('notes:mode', mode);
  }
  $$('button', seg).forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; applyMode(); sfx('tap'); }));
  applyMode();

  /* ================= NOTES ================= */
  let notes = store.get('notes', []);
  let activeId = notes[0]?.id ?? null;
  const listEl = $('#noteList');
  const titleIn = $('#noteTitle');
  const bodyIn = $('#noteBody');
  const metaEl = $('#noteMeta');
  const editor = $('#noteEditor');
  const saveN = () => store.set('notes', notes);

  function renderList() {
    if (!notes.length) {
      listEl.innerHTML = `<div class="empty" style="padding:24px 10px"><p>No notes yet. Tap “New note” to jot something down.</p></div>`;
      editor.style.display = 'none';
      return;
    }
    editor.style.display = 'flex';
    listEl.innerHTML = notes.map(n => `
      <div class="note-item ${n.id === activeId ? 'active' : ''}" data-id="${n.id}">
        <h4>${escapeHtml(n.title || 'Untitled')}</h4>
        <p>${escapeHtml((n.body || 'No text yet').slice(0, 48))}</p>
      </div>`).join('');
  }
  function loadActive() {
    const n = notes.find(x => x.id === activeId); if (!n) return;
    titleIn.value = n.title; bodyIn.value = n.body;
    metaEl.querySelector('.stamp').textContent = 'Edited ' + new Date(n.updated).toLocaleString();
  }
  function newNote() {
    const n = { id: Date.now(), title: '', body: '', updated: Date.now() };
    notes.unshift(n); activeId = n.id; saveN(); renderList(); loadActive(); titleIn.focus();
  }
  function persistNote() {
    const n = notes.find(x => x.id === activeId); if (!n) return;
    n.title = titleIn.value; n.body = bodyIn.value; n.updated = Date.now();
    saveN(); renderList();
    metaEl.querySelector('.stamp').textContent = 'Saved ' + new Date(n.updated).toLocaleTimeString();
  }
  let debN;
  const onEditN = () => { clearTimeout(debN); debN = setTimeout(persistNote, 400); };
  titleIn.addEventListener('input', onEditN);
  bodyIn.addEventListener('input', onEditN);
  listEl.addEventListener('click', e => {
    const item = e.target.closest('.note-item'); if (!item) return;
    activeId = Number(item.dataset.id); renderList(); loadActive();
  });
  $('#newNote').addEventListener('click', () => { newNote(); sfx('add'); });
  $('#delNote').addEventListener('click', () => {
    if (activeId == null) return;
    sfx('delete');
    notes = notes.filter(n => n.id !== activeId);
    activeId = notes[0]?.id ?? null; saveN(); renderList();
    if (activeId) loadActive(); else newNote();
  });
  if (!notes.length) newNote(); else { renderList(); loadActive(); }

  /* ================= DIARY ================= */
  const MOODS = ['😀', '🙂', '😐', '😔', '😫', '😍', '😤'];
  let diary = store.get('diary', {});
  let activeDate = todayKey();
  const dListEl = $('#diaryList');
  const dBody = $('#diaryBody');
  const dDate = $('#diaryDate');
  const dStamp = $('#diaryStamp');
  const moodRow = $('#moodRow');
  const saveD = () => store.set('diary', diary);

  moodRow.innerHTML = MOODS.map(m => `<button class="mood-chip" data-mood="${m}" aria-label="Mood ${m}">${m}</button>`).join('');

  function prettyDate(key) {
    const [y, mo, dd] = key.split('-').map(Number);
    return formatDate(new Date(y, mo - 1, dd), true);
  }
  function renderDiaryList() {
    const keys = Object.keys(diary).sort().reverse();
    if (!keys.length) {
      dListEl.innerHTML = `<div class="empty" style="padding:24px 10px"><p>No entries yet. Start with today.</p></div>`;
      return;
    }
    dListEl.innerHTML = keys.map(k => `
      <div class="note-item ${k === activeDate ? 'active' : ''}" data-date="${k}">
        <h4>${diary[k].mood ? diary[k].mood + ' ' : ''}${prettyDate(k)}</h4>
        <p>${escapeHtml((diary[k].text || 'Empty').slice(0, 46))}</p>
      </div>`).join('');
  }
  function loadDiary() {
    const entry = diary[activeDate] || { text: '', mood: '' };
    dDate.textContent = prettyDate(activeDate);
    dBody.value = entry.text;
    $$('.mood-chip', moodRow).forEach(c => c.classList.toggle('sel', c.dataset.mood === entry.mood));
    dStamp.textContent = entry.updated ? 'Saved ' + new Date(entry.updated).toLocaleTimeString() : 'Not saved yet';
  }
  function ensureEntry() { if (!diary[activeDate]) diary[activeDate] = { text: '', mood: '', updated: Date.now() }; }
  function persistDiary() {
    ensureEntry();
    diary[activeDate].text = dBody.value; diary[activeDate].updated = Date.now();
    if (!diary[activeDate].text && !diary[activeDate].mood) delete diary[activeDate];
    saveD(); renderDiaryList();
    if (diary[activeDate]) dStamp.textContent = 'Saved ' + new Date(diary[activeDate].updated).toLocaleTimeString();
  }
  let debD;
  dBody.addEventListener('input', () => { clearTimeout(debD); debD = setTimeout(persistDiary, 400); });
  moodRow.addEventListener('click', e => {
    const chip = e.target.closest('.mood-chip'); if (!chip) return;
    ensureEntry();
    const m = chip.dataset.mood;
    diary[activeDate].mood = diary[activeDate].mood === m ? '' : m;
    diary[activeDate].updated = Date.now();
    saveD(); loadDiary(); renderDiaryList(); sfx('tap');
  });
  dListEl.addEventListener('click', e => {
    const item = e.target.closest('.note-item'); if (!item) return;
    activeDate = item.dataset.date; renderDiaryList(); loadDiary();
  });
  $('#diaryToday').addEventListener('click', () => { activeDate = todayKey(); renderDiaryList(); loadDiary(); dBody.focus(); sfx('tap'); });
  $('#diaryDel').addEventListener('click', () => {
    if (diary[activeDate]) { delete diary[activeDate]; saveD(); sfx('delete'); }
    activeDate = todayKey(); renderDiaryList(); loadDiary();
  });

  renderDiaryList(); loadDiary();
}

/* ============================================================
   HABITS + WATER
   ============================================================ */
function initHabits() {
  let habits = store.get('habits', []);
  const dayK = 'habits:done:' + todayKey();
  let doneToday = store.get(dayK, []);
  const listEl = $('#habitList');
  const input = $('#habitInput');

  const saveHabits = () => store.set('habits', habits);
  const saveDone = () => store.set(dayK, doneToday);

  function streakFor(id) {
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = 'habits:done:' + d.toISOString().slice(0, 10);
      const done = store.get(key, []);
      if (done.includes(id)) s++; else if (i === 0) continue; else break;
    }
    return s;
  }

  function render() {
    if (!habits.length) {
      listEl.innerHTML = `<div class="empty"><div class="em-ic">🌱</div><p>No habits yet. Add one you want to do every day.</p></div>`;
      return;
    }
    listEl.innerHTML = habits.map(h => {
      const done = doneToday.includes(h.id);
      const s = streakFor(h.id);
      return `<li class="habit ${done ? 'done' : ''}" data-id="${h.id}">
        <button class="check">${CHECK}</button>
        <span class="h-name">${escapeHtml(h.name)}</span>
        ${s > 0 ? `<span class="streak">🔥 ${s}d</span>` : ''}
        <button class="del" aria-label="Remove habit">${TRASH}</button>
      </li>`;
    }).join('');
  }

  function add() {
    const name = input.value.trim(); if (!name) return;
    habits.push({ id: Date.now(), name }); input.value = ''; saveHabits(); render();
  }
  $('#addHabit').addEventListener('click', add);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });

  listEl.addEventListener('click', e => {
    const li = e.target.closest('.habit'); if (!li) return;
    const id = Number(li.dataset.id);
    if (e.target.closest('.check')) {
      if (doneToday.includes(id)) doneToday = doneToday.filter(x => x !== id);
      else { doneToday.push(id); toast('Nice — one more day 🔥'); sfx('complete'); }
      saveDone(); render();
    } else if (e.target.closest('.del')) {
      habits = habits.filter(h => h.id !== id); saveHabits(); render();
    }
  });

  render();

  /* ---- water ---- */
  const GOAL = 8;
  const wKey = 'water:' + todayKey();
  let water = store.get(wKey, 0);
  const fill = $('#glassFill');
  const countEl = $('#waterCount');

  function renderWater() {
    const pct = Math.min(100, (water / GOAL) * 100);
    fill.style.height = pct + '%';
    countEl.innerHTML = `<b>${water}</b> / ${GOAL} glasses`;
  }
  $('#waterAdd').addEventListener('click', () => {
    water = Math.min(20, water + 1); store.set(wKey, water); renderWater(); sfx('add');
    if (water === GOAL) toast('Daily water goal reached 💧');
  });
  $('#waterSub').addEventListener('click', () => {
    water = Math.max(0, water - 1); store.set(wKey, water); renderWater();
  });
  renderWater();
}

/* ============================================================
   TOOLS — unit converter
   ============================================================ */
const CONV = {
  length: { name: 'Length', base: 'm', units: {
    mm: .001, cm: .01, m: 1, km: 1000, in: .0254, ft: .3048, yd: .9144, mi: 1609.344 } },
  mass: { name: 'Weight', base: 'g', units: {
    mg: .001, g: 1, kg: 1000, t: 1e6, oz: 28.3495, lb: 453.592 } },
  speed: { name: 'Speed', base: 'mps', units: {
    'm/s': 1, 'km/h': 1 / 3.6, 'mph': 0.44704, 'knot': 0.514444 } },
  data: { name: 'Data', base: 'B', units: {
    B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4 } },
  temp: { name: 'Temperature', temp: true, units: { '°C': 1, '°F': 1, 'K': 1 } }
};

function initTools() {
  let cat = 'length';
  const fromVal = $('#fromVal'), toVal = $('#toVal');
  const fromU = $('#fromUnit'), toU = $('#toUnit');
  const tabsEl = $('#catTabs'), resultEl = $('#convResult');

  tabsEl.innerHTML = Object.entries(CONV).map(([k, v], i) =>
    `<button class="chip ${i === 0 ? 'active' : ''}" data-cat="${k}">${v.name}</button>`).join('');

  function fillUnits() {
    const units = Object.keys(CONV[cat].units);
    const opts = units.map(u => `<option value="${u}">${u}</option>`).join('');
    fromU.innerHTML = opts; toU.innerHTML = opts;
    toU.selectedIndex = Math.min(1, units.length - 1);
  }

  function convert() {
    const v = parseFloat(fromVal.value);
    if (isNaN(v)) { toVal.value = ''; resultEl.style.display = 'none'; return; }
    let out;
    const c = CONV[cat];
    if (c.temp) {
      out = tempConvert(v, fromU.value, toU.value);
    } else {
      out = v * c.units[fromU.value] / c.units[toU.value];
    }
    const rounded = Math.round(out * 1e6) / 1e6;
    toVal.value = rounded;
    resultEl.style.display = 'block';
    resultEl.innerHTML = `<div class="big">${v} ${fromU.value} = ${rounded} ${toU.value}</div>
      <div class="sub">${CONV[cat].name} conversion</div>`;
  }

  function tempConvert(v, f, t) {
    let c = f === '°C' ? v : f === '°F' ? (v - 32) * 5 / 9 : v - 273.15;
    return t === '°C' ? c : t === '°F' ? c * 9 / 5 + 32 : c + 273.15;
  }

  tabsEl.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', tabsEl).forEach(x => x.classList.remove('active'));
    b.classList.add('active'); cat = b.dataset.cat; fillUnits(); convert();
  });

  [fromVal, fromU, toU].forEach(el => el.addEventListener('input', convert));
  $('#swapBtn').addEventListener('click', () => {
    const swap = $('#swapBtn'); swap.classList.toggle('spin');
    [fromU.value, toU.value] = [toU.value, fromU.value];
    if (fromVal.value === '' && toVal.value !== '') fromVal.value = toVal.value;
    convert();
  });

  fillUnits();
  fromVal.value = 1;
  convert();
}

/* ---------- helper ---------- */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ============================================================
   SETTINGS + shared formatting
   ============================================================ */
const SETTINGS_DEFAULTS = { time24: false, dateFormat: 'long', sound: true, cursor: true };
function getSettings() { return Object.assign({}, SETTINGS_DEFAULTS, store.get('settings', {})); }
function saveSettings(s) { store.set('settings', s); }

function formatTime(d) {
  const s = getSettings();
  const m = String(d.getMinutes()).padStart(2, '0');
  const sec = String(d.getSeconds()).padStart(2, '0');
  let h = d.getHours();
  if (s.time24) return { main: `${String(h).padStart(2, '0')}:${m}`, sec, ap: '' };
  const ap = h < 12 ? 'AM' : 'PM'; h = h % 12 || 12;
  return { main: `${h}:${m}`, sec, ap };
}
function formatDate(d, withWeekday) {
  const s = getSettings();
  const p = n => String(n).padStart(2, '0');
  const day = d.getDate(), mon = d.getMonth() + 1, yr = d.getFullYear();
  if (s.dateFormat === 'dmy') return `${p(day)}/${p(mon)}/${yr}`;
  if (s.dateFormat === 'mdy') return `${p(mon)}/${p(day)}/${yr}`;
  if (s.dateFormat === 'iso') return `${yr}-${p(mon)}-${p(day)}`;
  return d.toLocaleDateString(undefined, { weekday: withWeekday ? 'long' : undefined, day: 'numeric', month: 'long', year: 'numeric' });
}

/* ============================================================
   SOUND ENGINE (Web Audio, subtle)
   ============================================================ */
let _actx = null;
function audio() {
  if (!_actx) { try { _actx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
  if (_actx.state === 'suspended') _actx.resume();
  return _actx;
}
function tone(freq, dur, type = 'sine', gain = 0.04, when = 0, glideTo = null) {
  const c = audio(); if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + dur + 0.03);
}
function sfx(name) {
  if (!getSettings().sound) return;
  switch (name) {
    case 'tap':      tone(330, 0.05, 'sine', 0.02); break;
    case 'toggle':   tone(520, 0.05, 'sine', 0.028); tone(760, 0.06, 'sine', 0.024, 0.04); break;
    case 'add':      tone(440, 0.08, 'triangle', 0.03, 0, 680); break;
    case 'delete':   tone(420, 0.09, 'sine', 0.028, 0, 210); break;
    case 'complete': [523, 659, 784].forEach((f, i) => tone(f, 0.15, 'sine', 0.035, i * 0.06)); break;
    case 'ding':     tone(1046, 0.45, 'sine', 0.045, 0, 900); break;
    case 'error':    tone(180, 0.2, 'sawtooth', 0.025, 0, 130); break;
  }
}
function keyTick() {
  if (!getSettings().sound) return;
  const c = audio(); if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
  o.type = 'square'; o.frequency.value = 780 + Math.random() * 380;
  f.type = 'highpass'; f.frequency.value = 550;
  g.gain.setValueAtTime(0.045, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
  o.connect(f); f.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + 0.04);
}

/* ============================================================
   CUSTOM CURSOR (dot + flowing ring)
   ============================================================ */
const Cursor = (() => {
  let built = false, enabled = false, dot, ring, mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  const fine = matchMedia('(pointer: fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function build() {
    dot = document.createElement('div'); dot.className = 'cursor-dot';
    ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      if (reduce) ring.style.transform = `translate(${mx}px, ${my}px)`;
    });
    const hoverSel = 'a, button, input, textarea, select, .chip, .tool-link, .note-item, .mood-chip, .switch, .seg button';
    document.addEventListener('pointerover', e => { if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover'); });
    document.addEventListener('pointerout',  e => { if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover'); });
    if (!reduce) (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
    built = true;
  }
  function set(on) {
    enabled = on && fine;
    document.body.classList.toggle('cursor-on', enabled);
    if (enabled && !built) build();
    if (built) { dot.style.display = ring.style.display = enabled ? 'block' : 'none'; }
  }
  return { set };
})();

/* ============================================================
   Confirm dialog (promise-based)
   ============================================================ */
function confirmModal(title, msg, danger) {
  return new Promise(resolve => {
    const scrim = document.createElement('div');
    scrim.className = 'modal-scrim';
    scrim.innerHTML = `<div class="card modal">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(msg)}</p>
      <div style="display:flex;gap:10px;justify-content:center">
        <button class="btn ghost" data-a="no">Cancel</button>
        <button class="btn ${danger ? 'coral' : ''}" data-a="yes">${danger ? 'Yes, do it' : 'Confirm'}</button>
      </div></div>`;
    document.body.appendChild(scrim);
    scrim.addEventListener('click', e => {
      const a = e.target.closest('[data-a]');
      if (!a && e.target !== scrim) return;
      const yes = a && a.dataset.a === 'yes';
      scrim.remove(); resolve(!!yes);
    });
  });
}

/* ============================================================
   SETTINGS PAGE
   ============================================================ */
function initSettings() {
  const s = getSettings();

  // name
  const nameIn = $('#setName');
  nameIn.value = store.get('name', '');
  $('#saveName').addEventListener('click', () => {
    const v = nameIn.value.trim();
    if (v) { store.set('name', v); toast('Name saved'); sfx('toggle'); }
  });

  // theme segmented
  const isLight = document.documentElement.classList.contains('light');
  setSeg('#segTheme', isLight ? 'light' : 'dark', val => {
    document.documentElement.classList.toggle('light', val === 'light');
    store.set('theme', val); const tb = $('#themeBtn'); if (tb) tb.innerHTML = val === 'light' ? ICON.moon : ICON.sun;
    sfx('toggle');
  });

  // toggles
  bindSwitch('#swCursor', s.cursor, on => { const n = getSettings(); n.cursor = on; saveSettings(n); Cursor.set(on); sfx('toggle'); });
  bindSwitch('#swSound', s.sound, on => { const n = getSettings(); n.sound = on; saveSettings(n); if (on) sfx('toggle'); });

  // time format
  setSeg('#segTime', s.time24 ? '24' : '12', val => {
    const n = getSettings(); n.time24 = val === '24'; saveSettings(n); renderPreview(); sfx('toggle');
  });

  // date format
  const dateSel = $('#setDateFmt');
  dateSel.value = s.dateFormat;
  dateSel.addEventListener('change', () => { const n = getSettings(); n.dateFormat = dateSel.value; saveSettings(n); renderPreview(); });

  function renderPreview() {
    const d = new Date();
    const t = formatTime(d);
    $('#fmtPreview').innerHTML = `<b>${t.main}${t.ap ? ' ' + t.ap : ''}</b> · ${formatDate(d, true)}`;
  }
  renderPreview();

  // data actions
  $('#resetActivity').addEventListener('click', async () => {
    if (await confirmModal('Reset today’s activity', 'This clears today’s focus rounds, water and checked-off habits. Your tasks, notes and streaks stay.', false)) {
      store.del('focus:' + todayKey()); store.del('water:' + todayKey()); store.del('habits:done:' + todayKey());
      store.set('focus:round', 0); toast('Today’s activity reset'); sfx('delete');
    }
  });
  $('#clearTasks').addEventListener('click', async () => {
    if (await confirmModal('Clear all tasks', 'Every task, done or not, will be removed.', true)) { store.set('tasks', []); toast('Tasks cleared'); sfx('delete'); }
  });
  $('#clearNotes').addEventListener('click', async () => {
    if (await confirmModal('Clear all notes', 'All saved notes will be removed. Diary entries are kept separate.', true)) { store.set('notes', []); toast('Notes cleared'); sfx('delete'); }
  });
  $('#clearDiary').addEventListener('click', async () => {
    if (await confirmModal('Clear diary', 'Every diary entry will be permanently removed.', true)) { store.set('diary', {}); toast('Diary cleared'); sfx('delete'); }
  });
  $('#resetAll').addEventListener('click', async () => {
    if (await confirmModal('Reset everything', 'This wipes all Ripple data on this browser — tasks, notes, diary, habits, settings and your name. This cannot be undone.', true)) {
      Object.keys(localStorage).filter(k => k.startsWith(NS)).forEach(k => localStorage.removeItem(k));
      location.href = 'index.html';
    }
  });

  // helpers scoped here
  function setSeg(sel, active, cb) {
    const seg = $(sel); if (!seg) return;
    $$('button', seg).forEach(b => {
      b.classList.toggle('active', b.dataset.val === active);
      b.addEventListener('click', () => {
        $$('button', seg).forEach(x => x.classList.remove('active'));
        b.classList.add('active'); cb(b.dataset.val);
      });
    });
  }
}

function bindSwitch(sel, on, cb) {
  const el = $(sel); if (!el) return;
  el.classList.toggle('on', on);
  el.setAttribute('role', 'switch');
  el.setAttribute('aria-checked', on);
  el.addEventListener('click', () => {
    const now = !el.classList.contains('on');
    el.classList.toggle('on', now); el.setAttribute('aria-checked', now); cb(now);
  });
}

/* ============================================================
   TYPE — speed test + typewriter fidget
   ============================================================ */
const PASSAGES = [
  'The quiet river carried small boats past the old stone bridge as the morning light spread across the valley.',
  'Good habits are built one calm day at a time, and the smallest steps often lead to the biggest changes.',
  'A clear desk and a clear mind make hard work feel lighter, so take a breath before you begin the next task.',
  'Water always finds its way, moving around every rock and shaping the land slowly with steady patience.',
  'Focus is a muscle you can train; each round of practice makes the next one a little easier to start.',
  'Write a little every evening and you will be surprised how quickly the pages fill with your own voice.'
];

function initType() {
  let mode = 'test';
  const testView = $('#testView'), freeView = $('#freeView');

  setSeg('#typeMode', 'test', m => {
    mode = m;
    testView.hidden = m !== 'test';
    freeView.hidden = m !== 'free';
    if (m === 'free') $('#freeInput').focus(); else input.focus();
    sfx('tap');
  });
  function setSeg(sel, active, cb) {
    const seg = $(sel);
    $$('button', seg).forEach(b => {
      b.classList.toggle('active', b.dataset.mode === active);
      b.addEventListener('click', () => {
        $$('button', seg).forEach(x => x.classList.remove('active'));
        b.classList.add('active'); cb(b.dataset.mode);
      });
    });
  }

  /* ---- speed test ---- */
  const passageEl = $('#passage');
  const input = $('#typeInput');
  const wpmEl = $('#wpm'), accEl = $('#acc'), timerEl = $('#timer'), bestEl = $('#best');
  let target = '', started = 0, timer = null, finished = false;

  bestEl.textContent = store.get('type:best', 0);

  function newPassage() {
    target = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
    passageEl.innerHTML = [...target].map(c => `<span>${c === ' ' ? '&nbsp;' : escapeHtml(c)}</span>`).join('');
    reset();
  }
  function reset() {
    input.value = ''; started = 0; finished = false;
    clearInterval(timer); timer = null;
    wpmEl.textContent = '0'; accEl.textContent = '100%'; timerEl.textContent = '0s';
    paintChars(); input.focus();
  }
  function paintChars() {
    const typed = input.value;
    const spans = passageEl.children;
    for (let i = 0; i < spans.length; i++) {
      spans[i].className = '';
      if (i < typed.length) spans[i].className = typed[i] === target[i] ? 'ok' : 'bad';
      else if (i === typed.length) spans[i].className = 'cur';
    }
  }
  function stats() {
    const typed = input.value;
    const elapsed = started ? (Date.now() - started) / 1000 : 0;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correct++;
    const wpm = elapsed > 0 ? Math.round((correct / 5) / (elapsed / 60)) : 0;
    const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100;
    wpmEl.textContent = wpm; accEl.textContent = acc + '%';
    timerEl.textContent = Math.floor(elapsed) + 's';
    return { wpm };
  }
  input.addEventListener('input', () => {
    if (finished) return;
    if (input.value.length > target.length) input.value = input.value.slice(0, target.length);
    if (!started && input.value.length) { started = Date.now(); timer = setInterval(stats, 250); }
    paintChars();
    const { wpm } = stats();
    if (input.value === target) {
      finished = true; clearInterval(timer); stats();
      const elapsed = (Date.now() - started) / 1000;
      if (elapsed < 1) { toast('Type it out to log a real score'); return; }
      sfx('ding');
      const wpm = Math.min(400, parseInt(wpmEl.textContent, 10) || 0);
      const best = store.get('type:best', 0);
      if (wpm > best) { store.set('type:best', wpm); bestEl.textContent = wpm; toast(`New best — ${wpm} WPM! 🌊`); }
      else toast(`Done — ${wpm} WPM`);
    }
  });
  input.addEventListener('keydown', e => { if (e.key.length === 1 || e.key === 'Backspace') keyTick(); });

  $('#newPassage').addEventListener('click', newPassage);
  $('#restart').addEventListener('click', reset);

  /* ---- free type ---- */
  const free = $('#freeInput');
  const fChars = $('#freeChars'), fWords = $('#freeWords');
  free.addEventListener('input', () => {
    const v = free.value;
    fChars.textContent = v.length;
    fWords.textContent = v.trim() ? v.trim().split(/\s+/).length : 0;
  });
  free.addEventListener('keydown', e => { if (e.key.length === 1 || e.key === 'Backspace') keyTick(); });
  $('#freeClear').addEventListener('click', () => { free.value = ''; fChars.textContent = '0'; fWords.textContent = '0'; free.focus(); });

  newPassage();
}

/* ============================================================
   Boot
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  attachRipples();
  Cursor.set(getSettings().cursor);
  const routes = {
    home: initHome, tasks: initTasks, focus: initFocus,
    notes: initNotes, habits: initHabits, tools: initTools,
    settings: initSettings, type: initType
  };
  const page = document.body.dataset.page;
  if (routes[page]) routes[page]();
});
