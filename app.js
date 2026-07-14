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
    const el = e.target.closest('.btn, .icon-btn, .chip, .tool-link, .mode-switch button, .swap-btn, .nav-links a, .water-btns .icon-btn');
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
  });
}

/* ---------- Nav: build, active state, mobile toggle, theme toggle ---------- */
const PAGES = [
  ['index.html', 'Home'],
  ['tasks.html', 'Tasks'],
  ['focus.html', 'Focus'],
  ['notes.html', 'Notes'],
  ['habits.html', 'Habits'],
  ['tools.html', 'Convert']
];
const ICON = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
};

function buildNav() {
  const nav = $('#nav');
  if (!nav) return;
  const current = document.body.dataset.page;
  const links = PAGES.map(([href, label]) =>
    `<a href="${href}" class="${href.startsWith(current) ? 'active' : ''}">${label}</a>`).join('');
  nav.innerHTML = `
    <a href="index.html" class="brand"><span class="dot"></span>Ripple</a>
    <div class="nav-links" id="navLinks">${links}</div>
    <button class="icon-btn" id="themeBtn" aria-label="Toggle theme"></button>
    <button class="icon-btn nav-toggle" id="navToggle" aria-label="Menu">${ICON.menu}</button>`;

  const isLight = document.documentElement.classList.contains('light');
  const themeBtn = $('#themeBtn');
  themeBtn.innerHTML = isLight ? ICON.moon : ICON.sun;
  themeBtn.addEventListener('click', () => {
    const light = document.documentElement.classList.toggle('light');
    store.set('theme', light ? 'light' : 'dark');
    themeBtn.innerHTML = light ? ICON.moon : ICON.sun;
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
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    clock.innerHTML = `${hh}:${mm}<span class="sec">:${ss}</span>`;
    dateEl.textContent = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
    input.value = ''; save(); render();
  }

  $('#addTask').addEventListener('click', add);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });

  listEl.addEventListener('click', e => {
    const li = e.target.closest('.task'); if (!li) return;
    const id = Number(li.dataset.id);
    if (e.target.closest('.check')) {
      const t = tasks.find(x => x.id === id); t.done = !t.done; save(); render();
    } else if (e.target.closest('.del')) {
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
  let notes = store.get('notes', []);
  let activeId = notes[0]?.id ?? null;
  const listEl = $('#noteList');
  const titleIn = $('#noteTitle');
  const bodyIn = $('#noteBody');
  const metaEl = $('#noteMeta');
  const editor = $('#noteEditor');

  const save = () => store.set('notes', notes);

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
    const n = notes.find(x => x.id === activeId);
    if (!n) return;
    titleIn.value = n.title; bodyIn.value = n.body;
    metaEl.querySelector('.stamp').textContent = 'Edited ' + new Date(n.updated).toLocaleString();
  }

  function newNote() {
    const n = { id: Date.now(), title: '', body: '', updated: Date.now() };
    notes.unshift(n); activeId = n.id; save(); renderList(); loadActive(); titleIn.focus();
  }

  function persistCurrent() {
    const n = notes.find(x => x.id === activeId); if (!n) return;
    n.title = titleIn.value; n.body = bodyIn.value; n.updated = Date.now();
    save(); renderList();
    metaEl.querySelector('.stamp').textContent = 'Saved ' + new Date(n.updated).toLocaleTimeString();
  }

  let deb;
  const onEdit = () => { clearTimeout(deb); deb = setTimeout(persistCurrent, 400); };
  titleIn.addEventListener('input', onEdit);
  bodyIn.addEventListener('input', onEdit);

  listEl.addEventListener('click', e => {
    const item = e.target.closest('.note-item'); if (!item) return;
    activeId = Number(item.dataset.id); renderList(); loadActive();
  });

  $('#newNote').addEventListener('click', newNote);
  $('#delNote').addEventListener('click', () => {
    if (activeId == null) return;
    notes = notes.filter(n => n.id !== activeId);
    activeId = notes[0]?.id ?? null; save(); renderList();
    if (activeId) loadActive(); else newNote();
  });

  if (!notes.length) newNote(); else { renderList(); loadActive(); }
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
      else { doneToday.push(id); toast('Nice — one more day 🔥'); }
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
    water = Math.min(20, water + 1); store.set(wKey, water); renderWater();
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
   Boot
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  attachRipples();
  const routes = {
    home: initHome, tasks: initTasks, focus: initFocus,
    notes: initNotes, habits: initHabits, tools: initTools
  };
  const page = document.body.dataset.page;
  if (routes[page]) routes[page]();
});
