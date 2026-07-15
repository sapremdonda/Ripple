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
  set(key, val) {
    try { localStorage.setItem(NS + key, JSON.stringify(val)); return true; }
    catch (e) {
      // Browsers cap localStorage (~5MB). Fail loudly rather than lose work silently.
      const quota = e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014);
      if (quota) {
        if (!store._warned) { store._warned = true; setTimeout(() => { store._warned = false; }, 8000); }
        try { toast('Storage is full — export a backup in Settings, then clear some sketches'); } catch {}
      }
      return false;
    }
  },
  del(key) { localStorage.removeItem(NS + key); },
  bytes() {
    let n = 0;
    Object.keys(localStorage).filter(k => k.startsWith(NS)).forEach(k => {
      n += (k.length + (localStorage.getItem(k) || '').length) * 2; // UTF-16
    });
    return n;
  }
};
const todayKey = () => new Date().toISOString().slice(0, 10);
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Theme + accent (applied ASAP to limit flash) ---------- */
(function applyTheme() {
  if (store.get('theme', 'dark') === 'light') document.documentElement.classList.add('light');
  const a = store.get('accent', 'ripple');
  if (a && a !== 'ripple') document.documentElement.dataset.accent = a;
})();

/* ---------- Shared data layer (used by backup + sync) ---------- */
/* Never leaves the device: admin credentials and the sync key itself. */
const PRIVATE_KEYS = ['admin', 'adminpw', 'sync:key', 'sync:last'];
function collectData() {
  const out = {};
  Object.keys(localStorage).filter(k => k.startsWith(NS)).forEach(k => {
    const short = k.slice(NS.length);
    if (PRIVATE_KEYS.includes(short)) return;
    out[short] = localStorage.getItem(k);
  });
  return out;
}
function restoreData(data) {
  Object.keys(localStorage).filter(k => k.startsWith(NS)).forEach(k => {
    if (!PRIVATE_KEYS.includes(k.slice(NS.length))) localStorage.removeItem(k);
  });
  Object.entries(data).forEach(([k, v]) => {
    if (PRIVATE_KEYS.includes(k)) return;
    try { localStorage.setItem(NS + k, typeof v === 'string' ? v : JSON.stringify(v)); } catch {}
  });
}

/* ---------- PWA: capture install prompt + register service worker ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.dispatchEvent(new Event('ripple:installable'));
});
window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  document.dispatchEvent(new Event('ripple:installed'));
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

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
    const el = e.target.closest('.btn, .icon-btn, .chip, .tool-link, .mode-switch button, .swap-btn, .nav-links a, .water-btns .icon-btn, .seg button, .mood-chip, .q-btn, .calc-btn');
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
  ['breathe.html', 'Breathe'],
  ['notes.html', 'Notes'],
  ['habits.html', 'Habits'],
  ['tools.html', 'Convert'],
  ['type.html', 'Type'],
  ['insights.html', 'Insights'],
  ['changelog.html', 'Changelog']
];
const ICON = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  cog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15z"/></svg>',
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

/* Site-wide credits footer (injected on every page) */
function buildFooter() {
  if (document.querySelector('.site-footer')) return;
  const f = document.createElement('footer');
  f.className = 'site-footer';
  f.innerHTML = `<div class="footer-inner">
    <span class="footer-mark">${logo('footLogo')}</span>
    <span class="footer-text">Made by <b>Saprem</b></span>
  </div>`;
  document.body.appendChild(f);
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
  ['You can’t stop the waves, but you can learn to surf.', 'Jon Kabat-Zinn'],
  ['How you spend your days is how you spend your life.', 'Annie Dillard'],
  ['Start where you are. Use what you have. Do what you can.', 'Arthur Ashe'],
  ['It always seems impossible until it’s done.', 'Nelson Mandela'],
  ['A river cuts through rock not by power, but by persistence.', 'proverb'],
  ['The best time to plant a tree was twenty years ago. The second best time is now.', 'proverb'],
  ['Almost everything works again if you unplug it for a few minutes — including you.', 'Anne Lamott'],
  ['Do the hard jobs first. The easy ones will take care of themselves.', 'Dale Carnegie'],
  ['Focus on being productive instead of busy.', 'Tim Ferriss'],
  ['Water is the softest thing, yet it can wear away stone.', 'Lao Tzu'],
  ['Well begun is half done.', 'Aristotle'],
  ['Discipline is choosing what you want most over what you want now.', 'reminder'],
  ['Little by little, a little becomes a lot.', 'proverb'],
  ['Calm mind brings inner strength and self-confidence.', 'Dalai Lama'],
  ['Rest is not idleness — it’s part of the work.', 'reminder']
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

  // thought of the moment — live from an API, with local fallback
  const quoteEl = $('#quote');
  const newBtn = $('#newQuote');
  const speakBtn = $('#speakQuote');
  let currentThought = { text: '', author: '' };

  function renderThought(t) {
    currentThought = t;
    quoteEl.innerHTML = `“${escapeHtml(t.text)}”<span>— ${escapeHtml(t.author)}</span>`;
  }
  function localThought() {
    const [text, author] = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return { text, author };
  }
  async function loadThought() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speakBtn.classList.remove('speaking');
    quoteEl.classList.add('loading');
    newBtn.classList.add('spin');
    try {
      const r = await fetch('https://dummyjson.com/quotes/random', { cache: 'no-store' });
      if (!r.ok) throw new Error('bad response');
      const d = await r.json();
      if (!d || !d.quote) throw new Error('no quote');
      renderThought({ text: d.quote, author: d.author || 'Unknown' });
    } catch {
      renderThought(localThought()); // offline or API down — never leave it blank
    } finally {
      quoteEl.classList.remove('loading');
      setTimeout(() => newBtn.classList.remove('spin'), 500);
    }
  }
  newBtn.addEventListener('click', loadThought);

  // read the thought aloud (browser speech synthesis)
  speakBtn.addEventListener('click', () => {
    const synth = window.speechSynthesis;
    if (!synth) { toast('Speech isn’t supported in this browser'); return; }
    if (synth.speaking) { synth.cancel(); speakBtn.classList.remove('speaking'); return; }
    if (!currentThought.text) return;
    const u = new SpeechSynthesisUtterance(`${currentThought.text}. By ${currentThought.author}.`);
    const set = getSettings();
    u.rate = set.rate || 1;
    if (set.voice) { const v = synth.getVoices().find(x => x.name === set.voice); if (v) u.voice = v; }
    u.onend = u.onerror = () => speakBtn.classList.remove('speaking');
    speakBtn.classList.add('speaking');
    synth.speak(u);
  });

  loadThought();

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

  initWidgets();
}

/* ---- sortable home widgets (pointer drag + arrow fallback) ---- */
function initWidgets() {
  const box = $('#widgets');
  if (!box) return;
  const DEFAULT = ['clock', 'thought', 'stats', 'tools'];
  const get = () => $$('.widget', box);
  const save = () => store.set('home:order', get().map(w => w.dataset.w));

  // restore saved order
  const saved = store.get('home:order', null);
  if (Array.isArray(saved)) {
    const known = new Set(DEFAULT);
    saved.filter(n => known.has(n)).forEach(n => {
      const el = box.querySelector(`.widget[data-w="${n}"]`);
      if (el) box.appendChild(el);
    });
    // anything new that isn't in the saved list stays at the end
    DEFAULT.filter(n => !saved.includes(n)).forEach(n => {
      const el = box.querySelector(`.widget[data-w="${n}"]`);
      if (el) box.appendChild(el);
    });
  }

  // edit mode
  const btn = $('#editLayout'), label = $('#editLayoutLabel');
  btn.addEventListener('click', () => {
    const on = box.classList.toggle('editing');
    label.textContent = on ? 'Done' : 'Rearrange';
    btn.classList.toggle('speaking', on);
    if (on) toast('Drag the handles, or use the arrows');
    sfx('tap');
  });

  // arrows — dependable everywhere, especially on touch
  box.addEventListener('click', e => {
    const b = e.target.closest('[data-move]'); if (!b) return;
    const w = b.closest('.widget');
    if (b.dataset.move === 'up' && w.previousElementSibling) box.insertBefore(w, w.previousElementSibling);
    if (b.dataset.move === 'down' && w.nextElementSibling) box.insertBefore(w.nextElementSibling, w);
    save(); sfx('tap');
  });

  // drag
  let drag = null, ph = null, offY = 0;
  box.addEventListener('pointerdown', e => {
    const grip = e.target.closest('.widget-grip');
    if (!grip || !box.classList.contains('editing')) return;
    e.preventDefault();
    drag = grip.closest('.widget');
    const r = drag.getBoundingClientRect();
    offY = e.clientY - r.top;
    ph = document.createElement('div');
    ph.className = 'widget-ph';
    ph.style.height = r.height + 'px';
    drag.after(ph);
    drag.classList.add('dragging');
    drag.style.width = r.width + 'px';
    drag.style.left = r.left + 'px';
    drag.style.top = r.top + 'px';
    grip.setPointerCapture(e.pointerId);
    sfx('tap');
  });
  box.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.style.top = (e.clientY - offY) + 'px';
    const others = get().filter(w => w !== drag);
    let placed = false;
    for (const s of others) {
      const r = s.getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) { box.insertBefore(ph, s); placed = true; break; }
    }
    if (!placed) box.appendChild(ph);
  });
  const end = () => {
    if (!drag) return;
    ph.replaceWith(drag);
    drag.classList.remove('dragging');
    drag.style.cssText = '';
    drag = null; ph = null;
    save(); sfx('add');
    Cursor.refresh();
  };
  box.addEventListener('pointerup', end);
  box.addEventListener('pointercancel', end);
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
      listEl.innerHTML = shown.map(t => {
        const m = focusMinsFor(t.id);
        return `
        <li class="task ${t.done ? 'done' : ''}" data-id="${t.id}">
          <span class="pri ${t.pri}"></span>
          <button class="check" aria-label="Toggle done">${CHECK}</button>
          <span class="task-text">${escapeHtml(t.text)}</span>
          ${m ? `<span class="task-min" title="Focus time invested">◴ ${prettyMins(m)}</span>` : ''}
          <button class="del" aria-label="Delete task">${TRASH}</button>
        </li>`; }).join('');
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
   AMBIENT SOUNDS — generated with Web Audio (no files needed)
   ============================================================ */
const Ambient = (() => {
  let ctx = null, master = null;
  const layers = {};   // name -> { gain, nodes[], vol }
  const DEFS = ['rain', 'waves', 'wind', 'cafe'];

  function ac() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  // steady noise buffer, looped — cheap and seamless
  function noiseSource(c) {
    const len = 2 * c.sampleRate;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = buf; s.loop = true;
    return s;
  }
  // slow LFO to make a layer breathe instead of sitting flat
  function lfo(c, target, rate, depth, base) {
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.value = rate; g.gain.value = depth;
    target.value = base;
    o.connect(g); g.connect(target); o.start();
    return o;
  }
  function build(name) {
    const c = ac();
    const g = c.createGain(); g.gain.value = 0; g.connect(master);
    const nodes = [];

    if (name === 'rain') {
      const src = noiseSource(c);
      const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6500;
      src.connect(hp); hp.connect(lp); lp.connect(g); src.start();
      nodes.push(src, lfo(c, lp.frequency, 0.08, 900, 6000));
    } else if (name === 'waves') {
      const src = noiseSource(c);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
      const swell = c.createGain(); swell.gain.value = 0.5;
      src.connect(lp); lp.connect(swell); swell.connect(g); src.start();
      // long swell = the push/pull of surf
      nodes.push(src, lfo(c, swell.gain, 0.09, 0.42, 0.5), lfo(c, lp.frequency, 0.07, 260, 620));
    } else if (name === 'wind') {
      const src = noiseSource(c);
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = 0.7;
      src.connect(bp); bp.connect(g); src.start();
      nodes.push(src, lfo(c, bp.frequency, 0.05, 260, 480));
    } else if (name === 'cafe') {
      const src = noiseSource(c);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 950;
      const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 180;
      src.connect(hp); hp.connect(lp); lp.connect(g); src.start();
      nodes.push(src, lfo(c, lp.frequency, 0.13, 300, 900));
    }
    layers[name] = { gain: g, nodes, vol: 0 };
    return layers[name];
  }
  function set(name, vol) {
    const L = layers[name] || (vol > 0 ? build(name) : null);
    if (!L) return;
    L.vol = vol;
    const c = ac();
    // scaled down: ambience should sit under everything else
    L.gain.gain.setTargetAtTime(vol * 0.22, c.currentTime, 0.25);
  }
  function stopAll() {
    Object.keys(layers).forEach(n => set(n, 0));
  }
  function active() { return Object.values(layers).some(l => l.vol > 0); }
  return { DEFS, set, stopAll, active };
})();

/* ============================================================
   FOCUS — water-fill Pomodoro
   ============================================================ */
/* focus log: what your rounds were actually spent on */
function focusLog() { return store.get('focus:log', []) || []; }
function logFocus(taskId, text, min) {
  const log = focusLog();
  log.push({ d: todayKey(), id: taskId, text: text || '', min });
  store.set('focus:log', log.slice(-1500));
}
function focusMinsFor(taskId) {
  return focusLog().filter(e => e.id === taskId).reduce((a, b) => a + (b.min || 0), 0);
}
function prettyMins(m) {
  if (!m) return '';
  const h = Math.floor(m / 60), r = m % 60;
  return h ? `${h}h ${r ? r + 'm' : ''}`.trim() : `${m}m`;
}

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

  /* ---- what are you focusing on? ---- */
  const taskSel = $('#focusTask');
  const taskHint = $('#focusTaskHint');
  function fillTasks() {
    if (!taskSel) return;
    const open = (store.get('tasks', []) || []).filter(t => !t.done);
    const cur = String(store.get('focus:task', '') || '');
    taskSel.innerHTML = `<option value="">Nothing in particular</option>` +
      open.map(t => `<option value="${t.id}">${escapeHtml(t.text)}</option>`).join('');
    taskSel.value = open.some(t => String(t.id) === cur) ? cur : '';
    renderHint();
  }
  function renderHint() {
    if (!taskHint) return;
    const id = taskSel.value ? Number(taskSel.value) : null;
    const m = id ? focusMinsFor(id) : 0;
    taskHint.textContent = m ? `${prettyMins(m)} invested so far` : '';
  }
  if (taskSel) {
    fillTasks();
    taskSel.addEventListener('change', () => { store.set('focus:task', taskSel.value); renderHint(); sfx('tap'); });
  }

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
      // credit the round to whatever you said you were working on
      const tid = taskSel && taskSel.value ? Number(taskSel.value) : null;
      const t = tid ? (store.get('tasks', []) || []).find(x => x.id === tid) : null;
      logFocus(tid, t ? t.text : '', DUR.work);
      toast(t ? `Round done — ${prettyMins(focusMinsFor(tid))} on “${t.text}” 🌊` : 'Focus round done — nice work 🌊');
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

  /* ---- ambience mixer ---- */
  const MIX_META = {
    rain:  { label: 'Rain',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14a4 4 0 0 1 .6-8 5 5 0 0 1 9.5 1.2A3.5 3.5 0 0 1 18 14"/><path d="M8 18l-1 2M12 18l-1 3M16 18l-1 2"/></svg>' },
    waves: { label: 'Waves', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>' },
    wind:  { label: 'Wind',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10a3 3 0 1 0-3-3M3 13h14a3 3 0 1 1-3 3M3 18h8"/></svg>' },
    cafe:  { label: 'Café',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2M7 3v2M11 3v2"/></svg>' }
  };
  const mixGrid = $('#mixerGrid');
  const saved = store.get('ambience', {});
  mixGrid.innerHTML = Ambient.DEFS.map(n => `
    <div class="mix-cell ${(saved[n] || 0) > 0 ? 'on' : ''}" data-n="${n}">
      <span class="mix-ic">${MIX_META[n].icon}</span>
      <span class="mix-label">${MIX_META[n].label}</span>
      <input class="range mix-range" type="range" min="0" max="1" step="0.01" value="${saved[n] || 0}" aria-label="${MIX_META[n].label} volume">
    </div>`).join('');

  function applyMix(n, v, cell) {
    Ambient.set(n, v);
    cell.classList.toggle('on', v > 0);
    const s = store.get('ambience', {}); s[n] = v; store.set('ambience', s);
  }
  mixGrid.addEventListener('input', e => {
    const r = e.target.closest('.mix-range'); if (!r) return;
    const cell = r.closest('.mix-cell');
    applyMix(cell.dataset.n, parseFloat(r.value), cell);
  });
  // clicking the tile toggles between off and a comfortable level
  mixGrid.addEventListener('click', e => {
    if (e.target.closest('.mix-range')) return;
    const cell = e.target.closest('.mix-cell'); if (!cell) return;
    const r = $('.mix-range', cell);
    const v = parseFloat(r.value) > 0 ? 0 : 0.5;
    r.value = v; applyMix(cell.dataset.n, v, cell); sfx('tap');
  });
  $('#mixerStop').addEventListener('click', () => {
    Ambient.stopAll();
    $$('.mix-cell', mixGrid).forEach(c => { c.classList.remove('on'); $('.mix-range', c).value = 0; });
    store.set('ambience', {}); sfx('tap');
  });
  // browsers block audio until a gesture, so restore saved levels on first interaction
  if (Object.values(saved).some(v => v > 0)) {
    const resume = () => {
      Object.entries(saved).forEach(([n, v]) => { if (v > 0) Ambient.set(n, v); });
      document.removeEventListener('pointerdown', resume);
      document.removeEventListener('keydown', resume);
    };
    document.addEventListener('pointerdown', resume);
    document.addEventListener('keydown', resume);
  }
}

/* ============================================================
   NOTES
   ============================================================ */
function initNotes() {
  /* ---- mode toggle: notes | diary | sketch ---- */
  let mode = store.get('notes:mode', 'notes');
  if (!['notes', 'diary', 'sketch'].includes(mode)) mode = 'notes';
  const notesView = $('#notesView'), diaryView = $('#diaryView'), sketchView = $('#sketchView');
  const seg = $('#notesMode');
  function applyMode() {
    notesView.hidden = mode !== 'notes';
    diaryView.hidden = mode !== 'diary';
    if (sketchView) sketchView.hidden = mode !== 'sketch';
    $$('button', seg).forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    store.set('notes:mode', mode);
    Cursor.refresh();
  }
  $$('button', seg).forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; applyMode(); sfx('tap'); }));
  applyMode();
  initSketch();

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
      renderHeat();
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
    renderHeat();
  }

  /* ---- heatmap: last 20 weeks ---- */
  const heatGrid = $('#heatGrid');
  const heatStats = $('#heatStats');
  const DAYNAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function renderHeat() {
    if (!heatGrid) return;
    const WEEKS = 20;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    // end on the Saturday of this week so columns are clean weeks
    const end = new Date(today); end.setDate(end.getDate() + (6 - end.getDay()));
    const start = new Date(end); start.setDate(start.getDate() - (WEEKS * 7 - 1));

    const total = Math.max(1, habits.length);
    let cells = '', activeDays = 0, totalDone = 0;
    const months = [];
    for (let w = 0; w < WEEKS; w++) {
      let col = '';
      for (let d = 0; d < 7; d++) {
        const day = new Date(start); day.setDate(start.getDate() + w * 7 + d);
        const key = day.toISOString().slice(0, 10);
        const future = day > today;
        const done = future ? [] : (store.get('habits:done:' + key, []) || []);
        const n = done.length;
        if (n > 0) { activeDays++; totalDone += n; }
        const ratio = n / total;
        const lvl = future ? 'future' : n === 0 ? 'l0' : ratio <= 0.25 ? 'l1' : ratio <= 0.5 ? 'l2' : ratio <= 0.75 ? 'l3' : 'l4';
        const label = `${DAYNAMES[day.getDay()]} ${formatDate(day)} — ${n} habit${n === 1 ? '' : 's'}`;
        col += `<i class="heat-sq ${lvl}" title="${escapeHtml(label)}"></i>`;
        if (d === 0) {
          const m = day.toLocaleDateString(undefined, { month: 'short' });
          months.push(months.length && months[months.length - 1].m === m ? { m: '', w } : { m, w });
        }
      }
      cells += `<div class="heat-col">${col}</div>`;
    }
    heatGrid.innerHTML = cells;
    heatStats.innerHTML = `<b>${activeDays}</b> active days · <b>${totalDone}</b> habits checked in the last ${WEEKS} weeks`;
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
   CALCULATOR — scientific, parsed (no eval)
   ============================================================ */
const CALC_FUNCS = ['asin', 'acos', 'atan', 'sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs', 'exp'];
const FUNC_TOKENS = ['asin(', 'acos(', 'atan(', 'sin(', 'cos(', 'tan(', 'log(', 'ln(', '√(', 'abs(', 'exp('];

function calcTokenize(s) {
  s = s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/√/g, 'sqrt').replace(/π/g, 'PI');
  const out = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') { i++; continue; }
    if (/[0-9.]/.test(c)) { let n = ''; while (i < s.length && /[0-9.]/.test(s[i])) n += s[i++]; out.push({ type: 'num', v: n }); continue; }
    if (/[a-zA-Z]/.test(c)) {
      let id = ''; while (i < s.length && /[a-zA-Z]/.test(s[i])) id += s[i++];
      if (id === 'PI') out.push({ type: 'const', v: 'PI' });
      else if (id === 'e') out.push({ type: 'const', v: 'E' });
      else if (CALC_FUNCS.includes(id)) out.push({ type: 'func', v: id });
      else throw new Error('bad name');
      continue;
    }
    if ('+-*/^!%()'.includes(c)) { out.push({ type: 'op', v: c }); i++; continue; }
    throw new Error('bad char');
  }
  return out;
}
function calcEval(input, deg) {
  const tk = calcTokenize(input);
  let i = 0;
  const peek = () => tk[i], next = () => tk[i++];
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const fact = n => { if (n < 0 || !Number.isInteger(n)) throw new Error('fact'); let r = 1; for (let k = 2; k <= n; k++) r *= k; return r; };

  function expr() { let v = term(); while (peek() && (peek().v === '+' || peek().v === '-')) { const o = next().v; const r = term(); v = o === '+' ? v + r : v - r; } return v; }
  function term() { let v = unary(); while (peek() && (peek().v === '*' || peek().v === '/')) { const o = next().v; const r = unary(); v = o === '*' ? v * r : v / r; } return v; }
  function unary() { if (peek() && (peek().v === '-' || peek().v === '+')) { const o = next().v; const r = unary(); return o === '-' ? -r : r; } return power(); }
  function power() { const b = postfix(); if (peek() && peek().v === '^') { next(); const e = unary(); return Math.pow(b, e); } return b; }
  function postfix() { let v = primary(); while (peek() && (peek().v === '!' || peek().v === '%')) { const o = next().v; v = o === '!' ? fact(v) : v / 100; } return v; }
  function primary() {
    const t = peek(); if (!t) throw new Error('end');
    if (t.type === 'num') { next(); return parseFloat(t.v); }
    if (t.type === 'const') { next(); return t.v === 'PI' ? Math.PI : Math.E; }
    if (t.type === 'func') { next(); expect('('); const a = expr(); expect(')'); return applyFn(t.v, a); }
    if (t.v === '(') { next(); const v = expr(); expect(')'); return v; }
    throw new Error('unexpected');
  }
  function expect(ch) { const t = next(); if (!t || t.v !== ch) throw new Error('expected ' + ch); }
  function applyFn(name, x) {
    switch (name) {
      case 'sin': return Math.sin(deg ? x * D2R : x);
      case 'cos': return Math.cos(deg ? x * D2R : x);
      case 'tan': return Math.tan(deg ? x * D2R : x);
      case 'asin': return (deg ? R2D : 1) * Math.asin(x);
      case 'acos': return (deg ? R2D : 1) * Math.acos(x);
      case 'atan': return (deg ? R2D : 1) * Math.atan(x);
      case 'log': return Math.log10(x);
      case 'ln': return Math.log(x);
      case 'sqrt': return Math.sqrt(x);
      case 'abs': return Math.abs(x);
      case 'exp': return Math.exp(x);
    }
    throw new Error('fn');
  }
  const r = expr();
  if (i < tk.length) throw new Error('trailing');
  return r;
}
function calcFormat(x) {
  if (!isFinite(x)) return 'Error';
  const r = Math.round(x * 1e10) / 1e10;
  return String(Object.is(r, -0) ? 0 : r);
}

const CALC_KEYS = [
  ['DEG', 'degrad', 'degrad'], ['(', '(', 'op'], [')', ')', 'op'], ['⌫', 'back', 'op'], ['C', 'clear', 'warn'],
  ['sin', 'sin(', 'fn'], ['cos', 'cos(', 'fn'], ['tan', 'tan(', 'fn'], ['xʸ', '^', 'op'], ['√', '√(', 'fn'],
  ['sin⁻¹', 'asin(', 'fn'], ['cos⁻¹', 'acos(', 'fn'], ['tan⁻¹', 'atan(', 'fn'], ['x²', '^2', 'fn'], ['%', '%', 'op'],
  ['log', 'log(', 'fn'], ['ln', 'ln(', 'fn'], ['π', 'π', 'fn'], ['e', 'e', 'fn'], ['n!', '!', 'op'],
  ['7', '7', ''], ['8', '8', ''], ['9', '9', ''], ['÷', '÷', 'op'], ['×', '×', 'op'],
  ['4', '4', ''], ['5', '5', ''], ['6', '6', ''], ['−', '−', 'op'], ['+', '+', 'op'],
  ['1', '1', ''], ['2', '2', ''], ['3', '3', ''], ['.', '.', ''], ['Ans', 'ans', 'accent'],
  ['0', '0', 'span3'], ['=', 'eq', 'eq span2']
];

function initCalc() {
  const keysEl = $('#calcKeys');
  const exprEl = $('#calcExpr');
  const prevEl = $('#calcPreview');
  const calcView = $('#calcView');
  if (!keysEl) return;

  let expr = '';
  let deg = true;
  let lastAns = 0;

  keysEl.innerHTML = CALC_KEYS.map(([label, val, cls]) =>
    `<button class="calc-btn ${cls}" data-val="${val === '"' ? '&quot;' : escapeHtml(val)}">${label}</button>`).join('');

  function render() {
    exprEl.textContent = expr || '0';
    if (!expr) { prevEl.textContent = ''; return; }
    try { const r = calcEval(expr, deg); prevEl.textContent = isFinite(r) ? '= ' + calcFormat(r) : ''; }
    catch { prevEl.textContent = ''; }
  }
  function backspace() {
    for (const tokn of FUNC_TOKENS) { if (expr.endsWith(tokn)) { expr = expr.slice(0, -tokn.length); return; } }
    expr = expr.slice(0, -1);
  }
  function equals() {
    if (!expr) return;
    try {
      const r = calcEval(expr, deg);
      if (!isFinite(r)) throw new Error('inf');
      lastAns = r; expr = calcFormat(r);
      exprEl.textContent = expr; prevEl.textContent = ''; sfx('complete');
    } catch { prevEl.textContent = 'Error'; sfx('error'); }
  }
  function act(val) {
    if (val === 'clear') { expr = ''; }
    else if (val === 'back') { backspace(); }
    else if (val === 'eq') { equals(); return; }
    else if (val === 'ans') { expr += calcFormat(lastAns); }
    else if (val === 'degrad') { deg = !deg; $('.calc-btn.degrad').textContent = deg ? 'DEG' : 'RAD'; render(); return; }
    else { expr += val; }
    render();
  }

  keysEl.addEventListener('click', e => {
    const b = e.target.closest('.calc-btn'); if (!b) return;
    act(b.dataset.val);
  });

  // keyboard support (only while calculator is visible and not typing in a field)
  const KEYMAP = { '*': '×', '/': '÷', '-': '−' };
  document.addEventListener('keydown', e => {
    if (calcView.hidden) return;
    const ae = document.activeElement;
    if (ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName)) return;
    const k = e.key;
    if (k === 'Enter' || k === '=') { e.preventDefault(); act('eq'); }
    else if (k === 'Backspace') { e.preventDefault(); act('back'); }
    else if (k === 'Escape') { act('clear'); }
    else if (/[0-9.]/.test(k)) act(k);
    else if ('+()^!%'.includes(k)) act(k);
    else if (KEYMAP[k]) act(KEYMAP[k]);
    else return;
  });

  render();
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
  // convert | calculate toggle
  const convertView = $('#convertView'), calcView = $('#calcView');
  const tSeg = $('#toolsMode');
  $$('button', tSeg).forEach(b => b.addEventListener('click', () => {
    $$('button', tSeg).forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const m = b.dataset.mode;
    convertView.hidden = m !== 'convert';
    calcView.hidden = m !== 'calc';
    sfx('tap');
  }));
  initCalc();

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
const SETTINGS_DEFAULTS = { time24: false, dateFormat: 'long', sound: true, cursorMode: 'ring', voice: '', rate: 1 };
function getSettings() {
  const raw = store.get('settings', {}) || {};
  const s = Object.assign({}, SETTINGS_DEFAULTS, raw);
  // migrate the old boolean `cursor` setting. Check `raw`, not `s` — the
  // default cursorMode would otherwise mask a missing stored value.
  if (raw.cursorMode == null || !['off', 'ring', 'lens'].includes(raw.cursorMode)) {
    s.cursorMode = raw.cursor === false ? 'off' : 'ring';
  }
  return s;
}
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
    case 'tap':      tone(330, 0.06, 'sine', 0.05); break;
    case 'toggle':   tone(520, 0.06, 'sine', 0.06); tone(760, 0.07, 'sine', 0.055, 0.04); break;
    case 'add':      tone(440, 0.09, 'triangle', 0.065, 0, 680); break;
    case 'delete':   tone(420, 0.1, 'sine', 0.06, 0, 210); break;
    case 'complete': [523, 659, 784].forEach((f, i) => tone(f, 0.16, 'sine', 0.07, i * 0.06)); break;
    case 'ding':     tone(1046, 0.5, 'sine', 0.09, 0, 900); break;
    case 'error':    tone(180, 0.22, 'sawtooth', 0.05, 0, 130); break;
  }
}
function keyTick() {
  if (!getSettings().sound) return;
  const c = audio(); if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
  o.type = 'square'; o.frequency.value = 780 + Math.random() * 380;
  f.type = 'highpass'; f.frequency.value = 550;
  g.gain.setValueAtTime(0.09, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
  o.connect(f); f.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + 0.04);
}

/* ============================================================
   CUSTOM CURSOR (dot + flowing ring)
   ============================================================ */
/* ============================================================
   CURSOR — dot + ring, or a true magnifier lens.

   The lens really magnifies: it keeps a live clone of the page
   inside a circular window and scales it, so a document point
   under the pointer lands dead centre. Cloned roots are pinned at
   document coordinates, which is why sticky/fixed elements get
   repositioned by hand.
   ============================================================ */
const Cursor = (() => {
  const Z = 1.9;              // magnification
  const R = 52;               // lens radius (px)
  const fine = matchMedia('(pointer: fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ROOTS = ['.nav', '.shell', '.site-footer'];

  let mode = 'ring', built = false, lensBuilt = false;
  let dot, ring, lens, inner, glare, brushEl;
  let brush = null;
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  let cloneMap = [];          // [{orig, clone}] so we can re-pin + sync values
  let mo = null, recloneT = null, syncT = null;

  const hexA = (hex, a) => {
    const h = String(hex || '').replace('#', '');
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const n = parseInt(full, 16);
    if (isNaN(n)) return `rgba(255,255,255,${a})`;
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  };

  /* ---- base cursor ---- */
  function build() {
    dot = document.createElement('div'); dot.className = 'cursor-dot';
    ring = document.createElement('div'); ring.className = 'cursor-ring';
    brushEl = document.createElement('div'); brushEl.className = 'cursor-brush';
    brushEl.innerHTML = '<i class="cb-ring"></i><i class="cb-cross"></i>';
    document.body.append(dot, ring, brushEl);

    // pointermove, NOT mousemove: calling preventDefault() on pointerdown
    // (which the sketch canvas must do) suppresses the compatibility mouse
    // events, so a mousemove listener goes silent mid-drag and the cursor
    // freezes. pointermove keeps firing, and survives pointer capture.
    window.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      if (brush) brushEl.style.transform = `translate(${mx}px, ${my}px)`;
      if (reduce) ring.style.transform = `translate(${mx}px, ${my}px)`;
      if (mode === 'lens' && lens) placeLens();
    }, { passive: true });

    const hoverSel = 'a, button, input, textarea, select, .chip, .tool-link, .note-item, .mood-chip, .switch, .seg button, .accent-dot, .mix-cell, .calc-btn';
    document.addEventListener('pointerover', e => { if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover'); });
    document.addEventListener('pointerout', e => { if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover'); });

    if (!reduce) (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
    built = true;
  }

  /* ---- brush cursor (sketch pad) ----
     Shows exactly what you're about to draw: a ring the true diameter of the
     brush in the current colour, or a crosshair for the shape tools. */
  function setBrush(cfg) {
    if (mode === 'off' || !fine) { brush = null; document.body.classList.remove('cursor-brush-on'); return; }
    brush = cfg;
    document.body.classList.toggle('cursor-brush-on', !!cfg);
    if (!cfg || !built) return;
    const shape = !['pen', 'eraser'].includes(cfg.tool);
    brushEl.classList.toggle('shape', shape);
    const d = Math.max(8, (cfg.size || 4) * (cfg.scale || 1));
    const r = brushEl.querySelector('.cb-ring');
    r.style.width = d + 'px'; r.style.height = d + 'px';
    if (cfg.tool === 'eraser') {
      r.style.borderColor = 'rgba(255,255,255,.85)';
      r.style.background = 'rgba(255,255,255,.08)';
      r.style.borderStyle = 'dashed';
    } else {
      r.style.borderColor = cfg.color;
      r.style.background = hexA(cfg.color, .22);
      r.style.borderStyle = 'solid';
    }
    brushEl.style.color = cfg.tool === 'eraser' ? '#fff' : cfg.color;
    brushEl.style.transform = `translate(${mx}px, ${my}px)`;
  }

  /* ---- magnifier ---- */
  function buildLens() {
    lens = document.createElement('div'); lens.className = 'cursor-lens';
    inner = document.createElement('div'); inner.className = 'cursor-lens-inner';
    glare = document.createElement('div'); glare.className = 'cursor-lens-glare';
    lens.append(inner, glare);
    document.body.appendChild(lens);
    reclone();

    // keep the copy honest as the page changes
    mo = new MutationObserver(muts => {
      for (const m of muts) if (lens.contains(m.target)) return;   // ignore our own subtree
      clearTimeout(recloneT); recloneT = setTimeout(reclone, 220);
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true });

    // cloneNode doesn't copy live field values, so mirror them on input
    document.addEventListener('input', () => { clearTimeout(syncT); syncT = setTimeout(syncValues, 60); }, true);
    // sticky/fixed roots move relative to the document as you scroll
    window.addEventListener('scroll', () => { pinRoots(); placeLens(); }, { passive: true });
    window.addEventListener('resize', () => { clearTimeout(recloneT); recloneT = setTimeout(reclone, 150); });
    lensBuilt = true;
  }

  function reclone() {
    if (!inner) return;
    inner.textContent = '';
    cloneMap = [];
    inner.style.width = document.documentElement.clientWidth + 'px';

    ROOTS.forEach(sel => {
      const orig = document.querySelector(sel);
      if (!orig) return;
      const c = orig.cloneNode(true);
      c.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
      c.removeAttribute('id');
      cloneMap.push({ orig, clone: c });
      inner.appendChild(c);
    });
    pinRoots();
    syncValues();
    placeLens();
  }

  // pin each cloned root at its current document position
  function pinRoots() {
    cloneMap.forEach(({ orig, clone }) => {
      const r = orig.getBoundingClientRect();
      clone.style.position = 'absolute';
      clone.style.margin = '0';
      clone.style.top = (r.top + window.scrollY) + 'px';
      clone.style.left = (r.left + window.scrollX) + 'px';
      clone.style.width = r.width + 'px';
    });
  }

  function syncValues() {
    cloneMap.forEach(({ orig, clone }) => {
      const a = orig.querySelectorAll('input, textarea, select');
      const b = clone.querySelectorAll('input, textarea, select');
      const n = Math.min(a.length, b.length);
      for (let i = 0; i < n; i++) {
        if (a[i].type === 'checkbox' || a[i].type === 'radio') b[i].checked = a[i].checked;
        else if (b[i].tagName === 'TEXTAREA') b[i].textContent = a[i].value;
        else b[i].value = a[i].value;
      }
      // cloneNode gives an empty canvas — copy the bitmap so the lens
      // works over sketches too
      const ca = orig.querySelectorAll('canvas'), cb = clone.querySelectorAll('canvas');
      for (let i = 0; i < Math.min(ca.length, cb.length); i++) {
        try {
          cb[i].width = ca[i].width; cb[i].height = ca[i].height;
          cb[i].getContext('2d').drawImage(ca[i], 0, 0);
        } catch {}
      }
    });
  }

  // map the document point under the pointer to the centre of the lens
  function placeLens() {
    if (!lens) return;
    const dx = mx + window.scrollX, dy = my + window.scrollY;
    lens.style.transform = `translate(${mx - R}px, ${my - R}px)`;
    inner.style.transform = `translate(${R - Z * dx}px, ${R - Z * dy}px) scale(${Z})`;
  }

  function teardownLens() {
    if (mo) { mo.disconnect(); mo = null; }
    if (lens) { lens.remove(); lens = inner = glare = null; }
    cloneMap = []; lensBuilt = false;
  }

  function set(m) {
    mode = fine ? (m || 'ring') : 'off';
    const on = mode !== 'off';
    document.body.classList.toggle('cursor-on', on);
    document.body.classList.toggle('cursor-lens-on', mode === 'lens');
    if (on && !built) build();
    if (built) { dot.style.display = on ? 'block' : 'none'; ring.style.display = (mode === 'ring') ? 'block' : 'none'; }
    if (!on) setBrush(null);
    if (mode === 'lens') { if (!lensBuilt) buildLens(); else { reclone(); lens.style.display = 'block'; } }
    else teardownLens();
  }
  return { set, setBrush, refresh: () => { if (mode === 'lens' && lensBuilt) reclone(); } };
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
  setSeg('#segCursor', s.cursorMode, val => {
    const n = getSettings(); n.cursorMode = val; saveSettings(n); Cursor.set(val); sfx('toggle');
  });
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

  // accent picker
  const accentRow = $('#accentRow');
  if (accentRow) {
    const cur = store.get('accent', 'ripple');
    accentRow.innerHTML = ACCENTS.map(([id, label]) =>
      `<button class="accent-dot ${id === cur ? 'sel' : ''}" data-accent="${id}" title="${label}" aria-label="${label}"><i></i></button>`).join('');
    accentRow.addEventListener('click', e => {
      const b = e.target.closest('.accent-dot'); if (!b) return;
      $$('.accent-dot', accentRow).forEach(x => x.classList.remove('sel'));
      b.classList.add('sel'); applyAccent(b.dataset.accent); sfx('toggle');
    });
  }

  // sync
  const syncKeyIn = $('#syncKeyIn'), syncStatus = $('#syncStatus');
  function renderSync() {
    const key = syncKey();
    syncKeyIn.value = key;
    const last = store.get('sync:last', null);
    syncStatus.innerHTML = key
      ? `<span class="faint">Last synced:</span> <b>${last ? new Date(last).toLocaleString() : 'never'}</b>`
      : `<span class="faint">No sync code yet. Create one, then paste it on your other devices.</span>`;
  }
  renderSync();
  $('#syncMake').addEventListener('click', async () => {
    if (syncKey() && !(await confirmModal('Replace sync code', 'Your current code will be forgotten on this device. Data already in the cloud under the old code stays there.', true))) return;
    store.set('sync:key', makeSyncKey()); store.del('sync:last'); renderSync(); toast('Sync code created'); sfx('complete');
  });
  $('#syncSave').addEventListener('click', () => {
    const v = (syncKeyIn.value || '').trim().toLowerCase();
    if (!/^[a-z0-9]{24,64}$/.test(v)) { toast('That code doesn’t look right'); sfx('error'); return; }
    store.set('sync:key', v); store.del('sync:last'); renderSync(); toast('Sync code saved'); sfx('toggle');
  });
  $('#syncCopy').addEventListener('click', async () => {
    if (!syncKey()) { toast('Create a code first'); return; }
    try { await navigator.clipboard.writeText(syncKey()); toast('Code copied'); }
    catch { syncKeyIn.select(); toast('Press Ctrl+C to copy'); }
  });
  $('#syncPush').addEventListener('click', async e => {
    if (!syncKey()) { toast('Create a sync code first'); sfx('error'); return; }
    const b = e.currentTarget; b.disabled = true; const t = b.textContent; b.textContent = 'Uploading…';
    try { await syncPush(); toast('Uploaded to your cloud ☁️'); sfx('complete'); renderSync(); }
    catch { toast('Upload failed — is the backend deployed?'); sfx('error'); }
    finally { b.disabled = false; b.textContent = t; }
  });
  $('#syncPull').addEventListener('click', async e => {
    if (!syncKey()) { toast('Create a sync code first'); sfx('error'); return; }
    const b = e.currentTarget; b.disabled = true; const t = b.textContent; b.textContent = 'Fetching…';
    try {
      const { data, updated } = await syncPull();
      if (!data) { toast('Nothing in the cloud for this code yet'); return; }
      const go = await confirmModal('Download and replace',
        `This replaces everything in this browser with the cloud copy from ${updated ? new Date(updated).toLocaleString() : 'earlier'}.`, true);
      if (!go) return;
      restoreData(data); store.set('sync:last', updated || new Date().toISOString());
      toast('Synced — reloading…'); sfx('complete');
      setTimeout(() => location.reload(), 900);
    } catch { toast('Download failed — is the backend deployed?'); sfx('error'); }
    finally { b.disabled = false; b.textContent = t; }
  });

  // backup: export / import
  const backupInfo = $('#backupInfo');
  const allData = collectData;
  function renderBackupInfo() {
    const d = allData();
    const notes = (store.get('notes', []) || []).length;
    const tasks = (store.get('tasks', []) || []).length;
    const habits = (store.get('habits', []) || []).length;
    const sketches = (store.get('sketches', []) || []).length;
    const diary = Object.keys(store.get('diary', {}) || {}).length;
    const kb = store.bytes() / 1024;
    const pct = Math.min(100, (kb / 5120) * 100);   // browsers typically allow ~5MB
    backupInfo.innerHTML = `<span class="faint">In this browser:</span> <b>${tasks}</b> tasks · <b>${notes}</b> notes · <b>${diary}</b> diary · <b>${sketches}</b> sketches · <b>${habits}</b> habits
      <div class="use-track" title="${kb.toFixed(0)} KB of roughly 5 MB"><div class="use-bar ${pct > 80 ? 'hot' : ''}" style="width:${Math.max(2, pct)}%"></div></div>
      <span class="faint">${kb < 1024 ? kb.toFixed(0) + ' KB' : (kb / 1024).toFixed(1) + ' MB'} used of about 5 MB${pct > 80 ? ' — time to export a backup' : ''}</span>`;
  }
  renderBackupInfo();

  $('#exportData').addEventListener('click', () => {
    const payload = { app: 'ripple', version: 1, exported: new Date().toISOString(), data: allData() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ripple-backup-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('Backup downloaded'); sfx('complete');
  });

  const fileIn = $('#importFile');
  $('#importData').addEventListener('click', () => fileIn.click());
  fileIn.addEventListener('change', async () => {
    const file = fileIn.files && fileIn.files[0];
    if (!file) return;
    let payload;
    try { payload = JSON.parse(await file.text()); }
    catch { toast('That file isn’t valid JSON'); sfx('error'); fileIn.value = ''; return; }
    if (!payload || payload.app !== 'ripple' || !payload.data || typeof payload.data !== 'object') {
      toast('That doesn’t look like a Ripple backup'); sfx('error'); fileIn.value = ''; return;
    }
    const count = Object.keys(payload.data).length;
    const when = payload.exported ? new Date(payload.exported).toLocaleString() : 'unknown date';
    const go = await confirmModal('Import backup',
      `This replaces what’s in this browser with the backup from ${when} (${count} items). Your current data here will be overwritten.`, true);
    fileIn.value = '';
    if (!go) return;
    restoreData(payload.data);
    toast('Backup restored — reloading…'); sfx('complete');
    setTimeout(() => location.reload(), 900);
  });

  // reading voice
  const voiceSel = $('#setVoice');
  function fillVoices() {
    const voices = (window.speechSynthesis ? window.speechSynthesis.getVoices() : []) || [];
    const cur = getSettings().voice;
    voiceSel.innerHTML = `<option value="">System default</option>` +
      voices.map(v => `<option value="${escapeHtml(v.name)}">${escapeHtml(v.name)} · ${escapeHtml(v.lang)}</option>`).join('');
    voiceSel.value = cur || '';
    if (!voices.length) voiceSel.innerHTML = `<option value="">System default</option>`;
  }
  fillVoices();
  if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = fillVoices;
  voiceSel.addEventListener('change', () => { const n = getSettings(); n.voice = voiceSel.value; saveSettings(n); });

  const rate = $('#setRate');
  rate.value = getSettings().rate || 1;
  rate.addEventListener('input', () => { const n = getSettings(); n.rate = parseFloat(rate.value); saveSettings(n); });

  $('#previewVoice').addEventListener('click', () => {
    const synth = window.speechSynthesis;
    if (!synth) { toast('Speech isn’t supported in this browser'); return; }
    synth.cancel();
    const s = getSettings();
    const u = new SpeechSynthesisUtterance('This is how your thoughts will sound in Ripple.');
    u.rate = s.rate || 1;
    if (s.voice) { const v = synth.getVoices().find(x => x.name === s.voice); if (v) u.voice = v; }
    synth.speak(u);
  });

  // admin card
  const adminCard = $('#adminCard');
  function refreshAdmin() { adminCard.hidden = !isAdmin(); }
  refreshAdmin();
  document.addEventListener('ripple:admin', refreshAdmin);
  $('#adminLogout').addEventListener('click', () => {
    setAdmin(false); document.dispatchEvent(new Event('ripple:admin'));
    toast('Logged out of admin'); refreshAdmin();
  });

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

  // install (PWA) — shown only when the browser offers it, or already installed
  const installRow = $('#installRow'), installBtn = $('#installBtn');
  function refreshInstall() {
    const installed = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    if (installed) { installRow.hidden = false; installBtn.textContent = 'Installed'; installBtn.disabled = true; return; }
    installRow.hidden = !deferredPrompt;
  }
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') toast('Adding Ripple to your device…');
    deferredPrompt = null; refreshInstall();
  });
  document.addEventListener('ripple:installable', refreshInstall);
  document.addEventListener('ripple:installed', () => { toast('Ripple installed 🌊'); refreshInstall(); });
  refreshInstall();

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
    passageEl.innerHTML = [...target].map(c => `<span>${c === ' ' ? ' ' : escapeHtml(c)}</span>`).join('');
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
   ADMIN + CHANGELOG (backend-backed, globally live)
   ============================================================ */
const CHANGELOG_API = '/.netlify/functions/changelog';
const CHANGELOG_DEFAULT = [
  { v: '1.0', date: '2026-07-10', title: 'Ripple launches',
    items: ['Home, Tasks, Focus, Notes, Habits and Convert', 'Liquid-glass design with light and dark'] }
];

function isAdmin() { return store.get('admin', false) === true; }
function setAdmin(on, pw) {
  store.set('admin', !!on);
  if (on && pw != null) store.set('adminpw', pw);
  if (!on) store.del('adminpw');
}
function adminPw() { return store.get('adminpw', ''); }

async function fetchLiveChangelog() {
  try {
    const r = await fetch(CHANGELOG_API, { cache: 'no-store' });
    if (r.ok) { const j = await r.json(); if (j && Array.isArray(j.data)) return j.data; }
  } catch {}
  try {
    const r = await fetch('changelog.json', { cache: 'no-store' });
    if (r.ok) { const d = await r.json(); if (Array.isArray(d)) return d; }
  } catch {}
  return CHANGELOG_DEFAULT;
}
async function adminVerify(password) {
  try {
    const r = await fetch(CHANGELOG_API, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', password })
    });
    return r.ok;
  } catch { return false; }
}
async function adminSave(password, data) {
  const r = await fetch(CHANGELOG_API, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'save', password, data })
  });
  if (!r.ok) throw new Error('save failed ' + r.status);
  return true;
}

/* secret-code login (type "admin-access" anywhere) */
function openAdminLogin() {
  if (isAdmin()) { toast('You’re already in admin mode'); return; }
  if (document.querySelector('.admin-login')) return;
  const scrim = document.createElement('div');
  scrim.className = 'modal-scrim admin-login';
  scrim.innerHTML = `<div class="card modal">
    <div class="modal-logo">${logo('adminLogo')}</div>
    <h2>Admin access</h2>
    <p>Enter your password to edit the changelog.</p>
    <input class="field" id="adminPwIn" type="password" placeholder="Password" autocomplete="off">
    <div style="display:flex;gap:10px;justify-content:center;margin-top:4px">
      <button class="btn ghost" data-a="cancel">Cancel</button>
      <button class="btn" data-a="ok">Unlock</button>
    </div></div>`;
  document.body.appendChild(scrim);
  const pw = scrim.querySelector('#adminPwIn'); pw.focus();
  const submit = async () => {
    if (!pw.value) return;
    pw.disabled = true;
    const ok = await adminVerify(pw.value);
    if (ok) {
      setAdmin(true, pw.value); scrim.remove();
      toast('Admin unlocked 🔓'); sfx('complete');
      document.dispatchEvent(new Event('ripple:admin'));
    } else {
      pw.disabled = false; pw.value = ''; pw.placeholder = 'Wrong password (or backend not set up)'; sfx('error');
    }
  };
  scrim.addEventListener('click', e => {
    const a = e.target.closest('[data-a]'); if (!a) return;
    if (a.dataset.a === 'ok') submit(); else scrim.remove();
  });
  pw.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

function initChangelog() {
  const view = $('#changelogView');
  const bar = $('#adminBar');
  let data = [];
  let loading = true;

  const relDate = d => {
    if (!d) return '';
    const [y, m, day] = String(d).split('-').map(Number);
    const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1];
    return mo ? `${day} ${mo} ${y}` : d;
  };

  const publicCard = rel => `
    <article class="rel">
      <div class="rel-side"><span class="rel-v">v${escapeHtml(rel.v || '')}</span><span class="rel-date">${escapeHtml(relDate(rel.date))}</span></div>
      <div class="rel-body">
        <h3 class="rel-title">${escapeHtml(rel.title || '')}</h3>
        <ul class="rel-items">${(rel.items || []).map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
      </div>
    </article>`;

  const editCard = (rel, idx) => `
    <article class="rel editing" data-idx="${idx}">
      <div class="rel-edit-top">
        <input class="field rel-in" data-f="v" value="${escapeHtml(rel.v || '')}" placeholder="1.0">
        <input class="field rel-in" data-f="date" value="${escapeHtml(rel.date || '')}" placeholder="YYYY-MM-DD">
        <button class="del rel-del" aria-label="Delete release">${TRASH}</button>
      </div>
      <input class="field rel-in" data-f="title" value="${escapeHtml(rel.title || '')}" placeholder="Title">
      <textarea class="field rel-in rel-items-in" data-f="items" placeholder="One change per line">${escapeHtml((rel.items || []).join('\n'))}</textarea>
    </article>`;

  function render() {
    if (loading) { bar.hidden = true; view.innerHTML = '<div class="empty"><p>Loading…</p></div>'; return; }
    if (isAdmin()) {
      bar.hidden = false;
      bar.innerHTML = `<div class="admin-inner">
        <div class="admin-top"><span class="admin-tag">🔓 Admin</span>
          <div class="admin-actions">
            <button class="btn ghost" data-a="add">Add release</button>
            <button class="btn ghost" data-a="reload">Reload</button>
            <button class="btn" data-a="save">Publish live</button>
            <button class="btn coral" data-a="logout">Log out</button>
          </div>
        </div>
        <p class="admin-note">Edits publish for everyone the moment you hit “Publish live”.</p>
      </div>`;
      view.innerHTML = data.map(editCard).join('') || '<div class="empty"><p>No entries. Add one to begin.</p></div>';
    } else {
      bar.hidden = true;
      view.innerHTML = data.length ? data.map(publicCard).join('') : '<div class="empty"><p>No entries yet.</p></div>';
    }
  }

  async function load() { loading = true; render(); data = await fetchLiveChangelog(); loading = false; render(); }

  view.addEventListener('input', e => {
    const art = e.target.closest('.rel.editing'); if (!art) return;
    const idx = +art.dataset.idx; const f = e.target.dataset.f; if (!f || !data[idx]) return;
    if (f === 'items') data[idx].items = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
    else data[idx][f] = e.target.value;
  });
  view.addEventListener('click', e => {
    const del = e.target.closest('.rel-del'); if (!del) return;
    const idx = +del.closest('.rel').dataset.idx;
    data.splice(idx, 1); render(); sfx('delete');
  });
  bar.addEventListener('click', async e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a;
    if (a === 'add') { data.unshift({ v: '', date: todayKey(), title: '', items: [] }); render(); sfx('add'); }
    else if (a === 'reload') { load(); }
    else if (a === 'logout') { setAdmin(false); document.dispatchEvent(new Event('ripple:admin')); toast('Logged out of admin'); render(); }
    else if (a === 'save') {
      b.disabled = true; const label = b.textContent; b.textContent = 'Publishing…';
      try { await adminSave(adminPw(), data); toast('Published — live for everyone 🌊'); sfx('complete'); }
      catch { toast('Couldn’t publish — check the backend is set up'); sfx('error'); }
      finally { b.disabled = false; b.textContent = label; }
    }
  });
  document.addEventListener('ripple:admin', render);

  load();
}

/* ============================================================
   ACCENTS
   ============================================================ */
const ACCENTS = [
  ['ripple', 'Ripple'],
  ['sunset', 'Sunset'],
  ['forest', 'Forest'],
  ['candy', 'Candy'],
  ['mono', 'Mono']
];
function applyAccent(name) {
  if (name === 'ripple') delete document.documentElement.dataset.accent;
  else document.documentElement.dataset.accent = name;
  store.set('accent', name);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const c = getComputedStyle(document.documentElement).getPropertyValue('--violet').trim();
    if (c) meta.setAttribute('content', c);
  }
}

/* ============================================================
   SYNC — optional, across devices via the backend
   ============================================================ */
const SYNC_API = '/.netlify/functions/sync';
const syncKey = () => store.get('sync:key', '');
function makeSyncKey() {
  const a = new Uint8Array(20);
  (crypto || window.crypto).getRandomValues(a);
  return [...a].map(b => b.toString(36).padStart(2, '0')).join('').slice(0, 32).toLowerCase();
}
async function syncPush() {
  const key = syncKey(); if (!key) throw new Error('no key');
  const r = await fetch(SYNC_API, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, data: collectData() })
  });
  if (!r.ok) throw new Error('push failed');
  const j = await r.json();
  store.set('sync:last', j.updated || new Date().toISOString());
  return j.updated;
}
async function syncPull() {
  const key = syncKey(); if (!key) throw new Error('no key');
  const r = await fetch(`${SYNC_API}?key=${encodeURIComponent(key)}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('pull failed');
  const j = await r.json();
  return j; // { data, updated }
}

/* ============================================================
   INSIGHTS
   ============================================================ */
function initInsights() {
  const lastDays = n => [...Array(n)].map((_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (n - 1 - i)); return d;
  });
  const k = d => d.toISOString().slice(0, 10);
  const DAY = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const days = lastDays(7);
  const habits = store.get('habits', []) || [];
  const tasks = store.get('tasks', []) || [];
  const diary = store.get('diary', {}) || {};

  const focus = days.map(d => store.get('focus:' + k(d), 0) || 0);
  const water = days.map(d => store.get('water:' + k(d), 0) || 0);
  const habitPct = days.map(d => {
    const done = (store.get('habits:done:' + k(d), []) || []).length;
    return habits.length ? Math.round((done / habits.length) * 100) : 0;
  });

  const sum = a => a.reduce((x, y) => x + y, 0);
  const avg = a => a.length ? sum(a) / a.length : 0;

  function bars(vals, unit, colorClass) {
    const max = Math.max(1, ...vals);
    return `<div class="chart">${vals.map((v, i) => `
      <div class="bar-col">
        <div class="bar-track"><div class="bar ${colorClass}" style="height:${(v / max) * 100}%"
             title="${escapeHtml(formatDate(days[i]))} — ${v}${unit}"></div></div>
        <span class="bar-lbl">${DAY[days[i].getDay()]}</span>
        <span class="bar-val">${v}</span>
      </div>`).join('')}</div>`;
  }

  // headline numbers
  const pending = tasks.filter(t => !t.done).length;
  const doneTasks = tasks.filter(t => t.done).length;
  const best = store.get('type:best', 0);
  const entries = Object.keys(diary).length;
  const moods = {};
  Object.values(diary).forEach(e => { if (e && e.mood) moods[e.mood] = (moods[e.mood] || 0) + 1; });
  const topMoods = Object.entries(moods).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // longest habit streak across all habits
  let bestStreak = 0;
  habits.forEach(h => {
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const done = store.get('habits:done:' + d.toISOString().slice(0, 10), []) || [];
      if (done.includes(h.id)) s++; else if (i === 0) continue; else break;
    }
    bestStreak = Math.max(bestStreak, s);
  });

  $('#insHead').innerHTML = `
    <div class="stat s1"><div class="num">${sum(focus)}</div><div class="lbl">Focus rounds this week</div></div>
    <div class="stat s2"><div class="num">${Math.round(avg(habitPct))}%</div><div class="lbl">Avg habits done</div></div>
    <div class="stat s3"><div class="num">${bestStreak}</div><div class="lbl">Longest streak</div></div>
    <div class="stat s4"><div class="num">${avg(water).toFixed(1)}</div><div class="lbl">Avg glasses/day</div></div>`;

  $('#insFocus').innerHTML = bars(focus, ' rounds', 'b-violet');
  $('#insHabits').innerHTML = bars(habitPct, '%', 'b-teal');
  $('#insWater').innerHTML = bars(water, ' glasses', 'b-aqua');

  const totalTasks = tasks.length || 1;
  $('#insTasks').innerHTML = `
    <div class="ring-wrap">
      <div class="ring" style="--p:${Math.round((doneTasks / totalTasks) * 100)}"><span>${Math.round((doneTasks / totalTasks) * 100)}%</span></div>
      <div class="ring-legend">
        <div><b>${doneTasks}</b> done</div>
        <div><b>${pending}</b> still open</div>
      </div>
    </div>`;

  $('#insMisc').innerHTML = `
    <div class="misc-row"><span>Diary entries</span><b>${entries}</b></div>
    <div class="misc-row"><span>Best typing speed</span><b>${best} WPM</b></div>
    <div class="misc-row"><span>Habits tracked</span><b>${habits.length}</b></div>
    <div class="misc-row"><span>Breathing cycles this week</span><b>${days.reduce((a, d) => a + (store.get('breathe:' + k(d), 0) || 0), 0)}</b></div>
    <div class="misc-row"><span>Sketches</span><b>${(store.get('sketches', []) || []).length}</b></div>
    ${topMoods.length ? `<div class="misc-row"><span>Most felt</span><b class="mood-list">${topMoods.map(([m, n]) => `${m}<i>${n}</i>`).join('')}</b></div>` : ''}`;

  /* where the focus actually went, last 7 days */
  const since = k(days[0]);
  const byTask = {};
  focusLog().filter(e => e.d >= since).forEach(e => {
    const label = e.text || 'Unassigned';
    byTask[label] = (byTask[label] || 0) + (e.min || 0);
  });
  const ranked = Object.entries(byTask).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const totalMin = ranked.reduce((a, b) => a + b[1], 0);
  const spendEl = $('#insSpend');
  if (spendEl) {
    spendEl.innerHTML = ranked.length
      ? `<div class="spend-total">${prettyMins(totalMin)} focused this week</div>` + ranked.map(([label, m]) => `
        <div class="spend-row">
          <div class="spend-top"><span>${escapeHtml(label)}</span><b>${prettyMins(m)}</b></div>
          <div class="spend-track"><div class="spend-bar" style="width:${Math.round((m / ranked[0][1]) * 100)}%"></div></div>
        </div>`).join('')
      : `<div class="empty" style="padding:24px 10px"><p>Pick a task on the Focus page before a round, and your time will show up here.</p></div>`;
  }

  if (!habits.length && !tasks.length && !sum(focus)) {
    $('#insEmpty').hidden = false;
  }
}

/* ============================================================
   BREATHE — paced breathing as an expanding ripple
   ============================================================ */
const BREATHE_PRESETS = {
  box:   { label: 'Box · 4-4-4-4', phases: [['Breathe in', 4], ['Hold', 4], ['Breathe out', 4], ['Hold', 4]] },
  calm:  { label: 'Calm · 4-7-8',  phases: [['Breathe in', 4], ['Hold', 7], ['Breathe out', 8]] },
  relax: { label: 'Relax · 4-6',   phases: [['Breathe in', 4], ['Breathe out', 6]] }
};

function initBreathe() {
  const orb = $('#bOrb'), phaseEl = $('#bPhase'), countEl = $('#bCount');
  const startBtn = $('#bStart'), cyclesEl = $('#bCycles'), todayEl = $('#bToday');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let preset = store.get('breathe:preset', 'box');
  if (!BREATHE_PRESETS[preset]) preset = 'box';
  let running = false, idx = 0, left = 0, cycles = 0, timer = null, scale = 0.45;

  const phases = () => BREATHE_PRESETS[preset].phases;
  const todayCount = () => store.get('breathe:' + todayKey(), 0) || 0;

  function renderMeta() {
    cyclesEl.textContent = `${cycles} this session`;
    todayEl.textContent = `${todayCount()} today`;
  }

  function setPreset(p) {
    preset = p; store.set('breathe:preset', p);
    $$('#breathePreset button').forEach(b => b.classList.toggle('active', b.dataset.p === p));
    if (!running) reset();
  }

  function reset() {
    stop();
    idx = 0; left = 0; scale = 0.45;
    phaseEl.textContent = 'Ready'; countEl.textContent = '—';
    orb.style.transitionDuration = '.6s';
    orb.style.transform = 'scale(.45)';
    document.body.classList.remove('breathing');
  }

  function startPhase() {
    const [name, dur] = phases()[idx];
    left = dur;
    phaseEl.textContent = name;
    countEl.textContent = left;
    if (name === 'Breathe in') scale = 1;
    else if (name === 'Breathe out') scale = 0.45;
    if (!reduce) {
      orb.style.transitionDuration = (name === 'Hold' ? 0.3 : dur) + 's';
      orb.style.transform = `scale(${scale})`;
    }
    orb.classList.toggle('holding', name === 'Hold');
    sfx(name === 'Breathe in' ? 'add' : name === 'Breathe out' ? 'delete' : 'tap');
    timer = setInterval(() => {
      left--;
      countEl.textContent = Math.max(0, left);
      if (left <= 0) { clearInterval(timer); timer = null; nextPhase(); }
    }, 1000);
  }

  function nextPhase() {
    idx++;
    if (idx >= phases().length) {
      idx = 0; cycles++;
      store.set('breathe:' + todayKey(), todayCount() + 1);
      renderMeta();
      if (cycles % 5 === 0) { toast(`${cycles} cycles — nicely done`); sfx('complete'); }
    }
    if (running) startPhase();
  }

  function start() {
    running = true; startBtn.textContent = 'Stop';
    document.body.classList.add('breathing');
    startPhase();
  }
  function stop() {
    running = false; startBtn.textContent = 'Start';
    clearInterval(timer); timer = null;
    document.body.classList.remove('breathing');
  }

  $('#breathePreset').innerHTML = Object.entries(BREATHE_PRESETS)
    .map(([id, p]) => `<button data-p="${id}" class="${id === preset ? 'active' : ''}">${p.label}</button>`).join('');
  $('#breathePreset').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    setPreset(b.dataset.p); sfx('tap');
  });
  startBtn.addEventListener('click', () => running ? (stop(), reset()) : start());

  renderMeta(); reset();
}

/* ============================================================
   SKETCH — a small vector paint pad.

   Strokes are stored as geometry, not pixels: a PNG data-URL of this
   canvas is ~200KB, while the strokes behind it are ~2KB. That keeps
   localStorage alive, stays crisp at any size, and syncs cheaply.
   All coordinates live in a fixed 1000x700 space so a sketch drawn on
   a phone lands identically on a desktop.
   ============================================================ */
const SK_W = 1000, SK_H = 700, SK_HIDPI = 2;
const SK_TOOLS = [
  ['pen', 'Pen', '<path d="M3 21l3.5-1 11-11-2.5-2.5-11 11z"/><path d="M15 5.5 18.5 9"/>'],
  ['line', 'Line', '<path d="M4 20 20 4"/>'],
  ['rect', 'Rectangle', '<rect x="4" y="6" width="16" height="12" rx="1.5"/>'],
  ['ellipse', 'Ellipse', '<ellipse cx="12" cy="12" rx="8" ry="6"/>'],
  ['arrow', 'Arrow', '<path d="M4 20 20 4"/><path d="M13 4h7v7"/>'],
  ['eraser', 'Eraser', '<path d="M6 18h12"/><path d="M8.5 15.5 4 11l7-7 5 5-6.5 6.5z"/>']
];
const SK_SWATCHES = ['#ffffff', '#0f172a', '#22d3ee', '#2dd4bf', '#3b82f6', '#8b5cf6', '#fb7185', '#ef4444', '#f59e0b', '#22c55e'];

function initSketch() {
  const cv = $('#skCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  cv.width = SK_W * SK_HIDPI; cv.height = SK_H * SK_HIDPI;

  let sketches = store.get('sketches', []) || [];
  let activeId = sketches[0]?.id ?? null;
  let strokes = [], hist = [], hi = -1;
  let tool = store.get('sk:tool', 'pen');
  let color = store.get('sk:color', '#22d3ee');
  let size = store.get('sk:size', 4);
  let fill = false;
  let drawing = false, cur = null;

  const active = () => sketches.find(s => s.id === activeId);
  const paper = () => (active()?.paper === 'light' ? '#ffffff' : '#0f1626');
  const saveAll = () => store.set('sketches', sketches);
  const rnd = n => Math.round(n);

  /* ---- drawing ---- */
  function drawStroke(c, s) {
    c.save();
    c.lineWidth = s.size;
    c.lineCap = 'round'; c.lineJoin = 'round';
    // the eraser simply paints the paper back in — no compositing needed,
    // and it stays correct if the paper colour is changed later
    const col = s.type === 'eraser' ? paper() : s.color;
    c.strokeStyle = col; c.fillStyle = col;

    if (s.type === 'pen' || s.type === 'eraser') {
      const p = s.pts;
      if (!p || !p.length) { c.restore(); return; }
      if (p.length === 1) { c.beginPath(); c.arc(p[0][0], p[0][1], s.size / 2, 0, 7); c.fill(); c.restore(); return; }
      c.beginPath(); c.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2;
        c.quadraticCurveTo(p[i][0], p[i][1], mx, my);   // smooths the hand-drawn line
      }
      c.lineTo(p[p.length - 1][0], p[p.length - 1][1]);
      c.stroke(); c.restore(); return;
    }

    const [x1, y1] = s.from, [x2, y2] = s.to;
    if (s.type === 'line') { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }
    else if (s.type === 'rect') {
      const x = Math.min(x1, x2), y = Math.min(y1, y2), w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
      c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, 2) : c.rect(x, y, w, h);
      s.fill ? c.fill() : c.stroke();
    } else if (s.type === 'ellipse') {
      const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
      c.beginPath(); c.ellipse(cx, cy, Math.abs(x2 - x1) / 2, Math.abs(y2 - y1) / 2, 0, 0, Math.PI * 2);
      s.fill ? c.fill() : c.stroke();
    } else if (s.type === 'arrow') {
      const a = Math.atan2(y2 - y1, x2 - x1), L = Math.max(12, s.size * 3.5);
      c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
      c.beginPath(); c.moveTo(x2, y2);
      c.lineTo(x2 - L * Math.cos(a - 0.42), y2 - L * Math.sin(a - 0.42));
      c.lineTo(x2 - L * Math.cos(a + 0.42), y2 - L * Math.sin(a + 0.42));
      c.closePath(); c.fill();
    }
    c.restore();
  }

  function redraw(preview) {
    ctx.setTransform(SK_HIDPI, 0, 0, SK_HIDPI, 0, 0);
    ctx.clearRect(0, 0, SK_W, SK_H);
    ctx.fillStyle = paper(); ctx.fillRect(0, 0, SK_W, SK_H);
    strokes.forEach(s => drawStroke(ctx, s));
    if (preview) drawStroke(ctx, preview);
  }

  /* ---- history (snapshots, capped) ---- */
  function pushHist() {
    hist = hist.slice(0, hi + 1);
    hist.push(JSON.stringify(strokes));
    if (hist.length > 25) hist.shift();
    hi = hist.length - 1;
    renderUndo();
  }
  function renderUndo() {
    $('#skUndo').disabled = hi <= 0;
    $('#skRedo').disabled = hi >= hist.length - 1;
  }
  function applyHist() {
    strokes = JSON.parse(hist[hi]);
    redraw(); persist(); renderUndo();
  }

  function persist() {
    const s = active(); if (!s) return;
    s.strokes = strokes; s.updated = Date.now();
    if (saveAll()) $('#skStamp').textContent = 'Saved ' + new Date(s.updated).toLocaleTimeString();
    renderList();
  }

  /* ---- brush cursor: mirrors the real brush over the canvas ---- */
  let overCanvas = false;
  function pushBrush() {
    if (!overCanvas) return;
    const r = cv.getBoundingClientRect();
    Cursor.setBrush({ size, color, tool, scale: r.width / SK_W });
  }
  cv.addEventListener('pointerenter', e => {
    if (e.pointerType === 'touch') return;
    overCanvas = true; pushBrush();
  });
  cv.addEventListener('pointerleave', () => { overCanvas = false; Cursor.setBrush(null); });

  /* ---- pointer input ---- */
  const toLogical = e => {
    const r = cv.getBoundingClientRect();
    return [
      rnd((e.clientX - r.left) / r.width * SK_W),
      rnd((e.clientY - r.top) / r.height * SK_H)
    ];
  };
  cv.addEventListener('pointerdown', e => {
    if (!active()) return;
    e.preventDefault();
    cv.setPointerCapture(e.pointerId);
    drawing = true;
    const p = toLogical(e);
    cur = (tool === 'pen' || tool === 'eraser')
      ? { type: tool, color, size, pts: [p] }
      : { type: tool, color, size, fill, from: p, to: p };
    redraw(cur);
  });
  cv.addEventListener('pointermove', e => {
    if (!drawing) return;
    const p = toLogical(e);
    if (cur.type === 'pen' || cur.type === 'eraser') {
      const last = cur.pts[cur.pts.length - 1];
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 2.5) return;  // thin out the points
      cur.pts.push(p);
    } else cur.to = p;
    redraw(cur);
  });
  const endDraw = () => {
    if (!drawing) return;
    drawing = false;
    const moved = cur.pts ? true : (cur.from[0] !== cur.to[0] || cur.from[1] !== cur.to[1]);
    if (moved) { strokes.push(cur); pushHist(); persist(); }
    cur = null; redraw();
  };
  cv.addEventListener('pointerup', endDraw);
  cv.addEventListener('pointercancel', endDraw);
  cv.addEventListener('pointerleave', endDraw);

  /* ---- toolbar ---- */
  $('#skTools').innerHTML = SK_TOOLS.map(([id, label, path]) =>
    `<button class="sk-tool ${id === tool ? 'sel' : ''}" data-tool="${id}" title="${label}" aria-label="${label}">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>
     </button>`).join('');
  $('#skTools').addEventListener('click', e => {
    const b = e.target.closest('.sk-tool'); if (!b) return;
    tool = b.dataset.tool; store.set('sk:tool', tool);
    $$('.sk-tool').forEach(x => x.classList.toggle('sel', x.dataset.tool === tool));
    $('#skFillWrap').hidden = !['rect', 'ellipse'].includes(tool);
    pushBrush();
    sfx('tap');
  });
  $('#skFillWrap').hidden = !['rect', 'ellipse'].includes(tool);

  $('#skSwatches').innerHTML = SK_SWATCHES.map(c =>
    `<button class="sk-sw ${c === color ? 'sel' : ''}" data-c="${c}" style="background:${c}" aria-label="Colour ${c}"></button>`).join('');
  function setColor(c) {
    color = c; store.set('sk:color', c);
    $$('.sk-sw').forEach(x => x.classList.toggle('sel', x.dataset.c === c));
    $('#skColor').value = c;
    pushBrush();
  }
  $('#skSwatches').addEventListener('click', e => {
    const b = e.target.closest('.sk-sw'); if (!b) return;
    setColor(b.dataset.c); sfx('tap');
  });
  $('#skColor').value = color;
  $('#skColor').addEventListener('input', e => setColor(e.target.value));

  const sizeIn = $('#skSize');
  sizeIn.value = size;
  $('#skSizeVal').textContent = size;
  sizeIn.addEventListener('input', () => { size = +sizeIn.value; store.set('sk:size', size); $('#skSizeVal').textContent = size; pushBrush(); });

  $('#skFill').addEventListener('click', e => {
    fill = !fill;
    e.currentTarget.classList.toggle('sel', fill);
    e.currentTarget.setAttribute('aria-pressed', fill);
    sfx('tap');
  });
  $('#skUndo').addEventListener('click', () => { if (hi > 0) { hi--; applyHist(); sfx('tap'); } });
  $('#skRedo').addEventListener('click', () => { if (hi < hist.length - 1) { hi++; applyHist(); sfx('tap'); } });
  $('#skClear').addEventListener('click', async () => {
    if (!strokes.length) return;
    if (!(await confirmModal('Clear sketch', 'Everything on this canvas will be wiped. You can still undo right after.', true))) return;
    strokes = []; pushHist(); redraw(); persist(); sfx('delete');
  });
  $('#skPaper').addEventListener('click', () => {
    const s = active(); if (!s) return;
    s.paper = s.paper === 'light' ? 'dark' : 'light';
    saveAll(); redraw(); renderPaperBtn(); sfx('toggle');
  });
  function renderPaperBtn() {
    const light = active()?.paper === 'light';
    $('#skPaper').textContent = light ? 'Light paper' : 'Dark paper';
  }
  $('#skPng').addEventListener('click', () => {
    const s = active(); if (!s) return;
    const a = document.createElement('a');
    a.download = (s.title || 'sketch').replace(/[^\w-]+/g, '-').toLowerCase() + '.png';
    a.href = cv.toDataURL('image/png');
    document.body.appendChild(a); a.click(); a.remove();
    toast('PNG downloaded'); sfx('complete');
  });

  /* ---- sketch list ---- */
  const listEl = $('#skList'), titleIn = $('#skTitle');
  function renderList() {
    if (!sketches.length) {
      listEl.innerHTML = `<div class="empty" style="padding:24px 10px"><p>No sketches yet. Tap “New sketch”.</p></div>`;
      $('#skEditor').style.display = 'none';
      return;
    }
    $('#skEditor').style.display = 'flex';
    listEl.innerHTML = sketches.map(s => `
      <div class="note-item ${s.id === activeId ? 'active' : ''}" data-id="${s.id}">
        <h4>${escapeHtml(s.title || 'Untitled sketch')}</h4>
        <p>${(s.strokes || []).length} strokes</p>
      </div>`).join('');
  }
  function load() {
    const s = active(); if (!s) return;
    titleIn.value = s.title || '';
    strokes = (s.strokes || []).slice();
    hist = [JSON.stringify(strokes)]; hi = 0;
    renderPaperBtn(); renderUndo(); redraw();
    $('#skStamp').textContent = s.updated ? 'Edited ' + new Date(s.updated).toLocaleString() : 'Not saved yet';
  }
  function newSketch() {
    const s = {
      id: Date.now(), title: '', strokes: [], updated: Date.now(),
      paper: document.documentElement.classList.contains('light') ? 'light' : 'dark'
    };
    sketches.unshift(s); activeId = s.id; saveAll(); renderList(); load(); titleIn.focus();
  }
  listEl.addEventListener('click', e => {
    const it = e.target.closest('.note-item'); if (!it) return;
    activeId = Number(it.dataset.id); renderList(); load();
  });
  let tdeb;
  titleIn.addEventListener('input', () => {
    clearTimeout(tdeb);
    tdeb = setTimeout(() => { const s = active(); if (s) { s.title = titleIn.value; saveAll(); renderList(); } }, 350);
  });
  $('#skNew').addEventListener('click', () => { newSketch(); sfx('add'); });
  $('#skDel').addEventListener('click', async () => {
    if (!active()) return;
    if (!(await confirmModal('Delete sketch', 'This sketch will be removed for good.', true))) return;
    sketches = sketches.filter(s => s.id !== activeId);
    activeId = sketches[0]?.id ?? null;
    saveAll(); renderList();
    if (activeId) load(); else newSketch();
    sfx('delete');
  });

  if (!sketches.length) newSketch(); else { renderList(); load(); }
}

/* ============================================================
   Boot
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  buildFooter();
  attachRipples();
  Cursor.set(getSettings().cursorMode);

  // secret code: type "admin-access" anywhere to open the admin login
  let codeBuf = '';
  document.addEventListener('keydown', e => {
    if (!e.key || e.key.length !== 1) return;
    codeBuf = (codeBuf + e.key.toLowerCase()).slice(-24);
    if (codeBuf.endsWith('admin-access')) { codeBuf = ''; openAdminLogin(); }
  });

  const routes = {
    home: initHome, tasks: initTasks, focus: initFocus,
    notes: initNotes, habits: initHabits, tools: initTools,
    settings: initSettings, type: initType, changelog: initChangelog,
    insights: initInsights, breathe: initBreathe
  };
  const page = document.body.dataset.page;
  if (routes[page]) routes[page]();
});
