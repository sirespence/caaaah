/* ============================================================
   ATOM — app.js  v2  (UV 2.x + now.gg cloud)
   ============================================================ */

const ROBLOX   = 'https://www.roblox.com';
const NOWGG_RL = 'https://now.gg/apps/roblox-corporation/5349/roblox.html';

/* Launch mode: 'nowgg' | 'proxy' */
let launchMode = 'nowgg';
function setLaunchMode(m) {
  launchMode = m;
  document.querySelectorAll('.lt-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('lt-'+m).classList.add('active');
}

/* ── GAME DATA ── */
const GAMES = {
  pop: [
    { e:'🍎', n:'Blox Fruits',          t:'~600k', c:'orange', u:`${ROBLOX}/games/2753915549` },
    { e:'🐾', n:'Adopt Me!',             t:'~500k', c:'purple', u:`${ROBLOX}/games/920587237` },
    { e:'🐶', n:'Pet Simulator 99',      t:'~300k', c:'blue',   u:`${ROBLOX}/games/15532962292` },
    { e:'🚪', n:'Doors',                 t:'~200k', c:'red',    u:`${ROBLOX}/games/6516141723` },
    { e:'🏡', n:'Brookhaven RP',         t:'~400k', c:'green',  u:`${ROBLOX}/games/4924922222` },
    { e:'🏙️', n:'Welcome to Bloxburg',   t:'~90k',  c:'gold',   u:`${ROBLOX}/games/185655149` },
  ],
  act: [
    { e:'🔪', n:'Murder Mystery 2',      t:'~180k', c:'red',    u:`${ROBLOX}/games/142823291` },
    { e:'🚔', n:'Jailbreak',             t:'~120k', c:'blue',   u:`${ROBLOX}/games/606849621` },
    { e:'🗼', n:'Tower of Hell',         t:'~90k',  c:'orange', u:`${ROBLOX}/games/1962086868` },
    { e:'🔫', n:'Arsenal',               t:'~80k',  c:'teal',   u:`${ROBLOX}/games/286090429` },
    { e:'⚔️', n:'Bedwars',               t:'~75k',  c:'gold',   u:`${ROBLOX}/games/6872265039` },
    { e:'🌊', n:'Flood Escape 2',        t:'~40k',  c:'blue',   u:`${ROBLOX}/games/738339342` },
  ],
  rp: [
    { e:'👑', n:'Royale High',           t:'~80k',  c:'pink',   u:`${ROBLOX}/games/735030788` },
    { e:'👗', n:'Dress to Impress',      t:'~170k', c:'purple', u:`${ROBLOX}/games/15532962292` },
    { e:'🍕', n:'Work at a Pizza Place', t:'~60k',  c:'orange', u:`${ROBLOX}/games/192800` },
    { e:'🌸', n:'Berry Avenue',          t:'~70k',  c:'pink',   u:`${ROBLOX}/games/8737899170` },
    { e:'🏫', n:'Roblox High School',    t:'~30k',  c:'blue',   u:`${ROBLOX}/games/447452406` },
  ],
  classic: [
    { e:'🌋', n:'Natural Disaster Survival', t:'~20k', c:'red',    u:`${ROBLOX}/games/189` },
    { e:'🏋️', n:'Weight Lifting Sim',        t:'~25k', c:'gold',   u:`${ROBLOX}/games/16196158` },
    { e:'🛸', n:'Build a Boat for Treasure', t:'~35k', c:'teal',   u:`${ROBLOX}/games/537413558` },
    { e:'🃏', n:'Epic Minigames',             t:'~18k', c:'purple', u:`${ROBLOX}/games/189` },
  ],
};

const BROWSE_ROBLOX = [
  { e:'🏠', n:'Roblox Home',    d:'Your feed & recommended games',  u:`${ROBLOX}/home` },
  { e:'🔍', n:'Discover',       d:'Browse all games on Roblox',     u:`${ROBLOX}/discover` },
  { e:'🎨', n:'Avatar',         d:'Customize your look',            u:`${ROBLOX}/my/avatar` },
  { e:'💎', n:'Robux',          d:'Get Robux currency',             u:`${ROBLOX}/upgrades/robux` },
  { e:'👥', n:'Friends',        d:"See who's online right now",     u:`${ROBLOX}/users/friends` },
  { e:'☁️', n:'now.gg Roblox',  d:'Cloud play, no download needed', u: NOWGG_RL },
];

const BROWSE_WEB = [
  { e:'🦁', n:'Brave Search',   d:'Private, ad-free search',  u:'https://search.brave.com' },
  { e:'📺', n:'YouTube',        d:'Watch anything',            u:'https://www.youtube.com' },
  { e:'💬', n:'Discord',        d:'Chat with friends',         u:'https://discord.com/app' },
  { e:'🟠', n:'Reddit',         d:'Browse communities',        u:'https://www.reddit.com' },
  { e:'🤖', n:'ChatGPT',        d:'AI assistant',              u:'https://chat.openai.com' },
  { e:'📸', n:'Instagram',      d:'Photos & reels',            u:'https://www.instagram.com' },
];

/* ── BUILD CARDS ── */
function mkCard(item) {
  const el = document.createElement('div');
  el.className = 'card';
  el.setAttribute('data-color', item.c || 'blue');
  el.innerHTML = `
    <div class="card-thumb"><span>${item.e}</span></div>
    <div class="card-body">
      <div class="c-name">${item.n}</div>
      <div class="c-live"><div class="c-dot"></div>${item.t} playing</div>
    </div>`;
  el.onclick = () => launchGame(item);
  return el;
}

function mkBrow(item) {
  const el = document.createElement('div');
  el.className = 'bitem';
  el.innerHTML = `
    <div class="bi-ico">${item.e}</div>
    <div>
      <div class="bi-name">${item.n}</div>
      <div class="bi-desc">${item.d}</div>
    </div>
    <div class="bi-arrow">›</div>`;
  el.onclick = () => go(item.u, item.n);
  return el;
}

Object.entries(GAMES).forEach(([k, arr]) => {
  const g = document.getElementById('g-' + k);
  if (g) arr.forEach(i => g.appendChild(mkCard(i)));
});
BROWSE_ROBLOX.forEach(i => document.getElementById('b-roblox').appendChild(mkBrow(i)));
BROWSE_WEB.forEach(i => document.getElementById('b-web').appendChild(mkBrow(i)));

/* ── GAME LAUNCHER ── */
let _pendingGame = null;

function launchGame(item) {
  if (launchMode === 'nowgg') {
    openModal(item);
  } else {
    go(item.u, item.n);
  }
}

function openModal(item) {
  _pendingGame = item;
  document.getElementById('modal-emoji').textContent   = item.e;
  document.getElementById('modal-name').textContent    = item.n;
  document.getElementById('modal-players').textContent = item.t + ' currently playing';
  document.getElementById('modal-nowgg').onclick  = () => { closeModal(); go(NOWGG_RL, 'now.gg · ' + item.n); };
  document.getElementById('modal-proxy').onclick  = () => { closeModal(); go(item.u, item.n); };
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  _pendingGame = null;
}

function goNowGG() {
  go(NOWGG_RL, 'Roblox on now.gg');
}

/* ── PAGE NAV ── */
function page(p) {
  ['home','games','browse'].forEach(id => {
    const pg = document.getElementById('pg-' + id);
    const sb = document.getElementById('sib-' + id);
    if (pg) pg.style.display = 'none';
    if (sb) sb.classList.remove('on');
  });
  const tgt = document.getElementById('pg-' + p);
  const btn = document.getElementById('sib-' + p);
  if (tgt) tgt.style.display = (p === 'home') ? 'flex' : 'block';
  if (btn) btn.classList.add('on');
  if (p === 'home') setTimeout(() => document.getElementById('hero').focus(), 50);
}

/* ── UV 2.x PROXY ── */
let _swReady = false;

async function ensureSW() {
  if (_swReady) return;
  if (!navigator.serviceWorker) throw new Error('Service workers not supported');
  const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  await new Promise(resolve => {
    if (reg.active) { resolve(); return; }
    const pending = reg.installing || reg.waiting;
    if (!pending) { resolve(); return; }
    pending.addEventListener('statechange', function () {
      if (this.state === 'activated') resolve();
    });
  });
  _swReady = true;
}

async function go(raw, title) {
  raw = (raw || '').trim();
  if (!raw) return;

  let url = raw;
  if (!url.startsWith('http')) {
    if (url.includes('.') && !url.includes(' ')) {
      url = 'https://' + url;
    } else {
      url = 'https://search.brave.com/search?q=' + encodeURIComponent(url);
    }
  }

  document.getElementById('addr').value         = url;
  document.getElementById('ftitle').textContent  = title || new URL(url).hostname;
  document.getElementById('furl').textContent    = url;
  document.getElementById('viewer').src          = 'about:blank';
  document.getElementById('frame').classList.add('open');
  setStatus('Connecting…', false);

  try {
    await ensureSW();
    document.getElementById('viewer').src = __uv$config.prefix + __uv$config.encodeUrl(url);
    document.getElementById('viewer').onload = () => setStatus('Connected', true);
  } catch (e) {
    console.error('Proxy error:', e);
    setStatus('Error', false);
    showToast('Proxy error: ' + e.message);
  }
}

function closeFrame() {
  document.getElementById('frame').classList.remove('open');
  document.getElementById('viewer').src = 'about:blank';
  setStatus('Ready', true);
}

function setStatus(msg, ok) {
  document.getElementById('stext').textContent = msg;
  const d = document.getElementById('sdot');
  d.style.background  = ok ? 'var(--teal)' : '#f0a830';
  d.style.boxShadow   = ok ? '0 0 6px var(--teal),0 0 14px rgba(42,255,204,.3)' : '0 0 6px #f0a830';
}

let _tt;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_tt);
  _tt = setTimeout(() => el.classList.remove('show'), 3500);
}

function panic() { window.location.replace('https://classroom.google.com'); }

document.addEventListener('keydown', e => {
  if (e.key === ']') panic();
  if (e.key === 'Escape') { closeFrame(); closeModal(); }
});

page('home');
