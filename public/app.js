/* ============================================================
   ATOM — app.js  (UV 2.x + bare server)
   ============================================================ */

const ROBLOX = 'https://www.roblox.com';

const GAMES = {
  pop: [
    { e:'🍎', n:'Blox Fruits',          t:'~600k', u:`${ROBLOX}/games/2753915549` },
    { e:'🐾', n:'Adopt Me!',             t:'~500k', u:`${ROBLOX}/games/920587237` },
    { e:'🐶', n:'Pet Simulator 99',      t:'~300k', u:`${ROBLOX}/games/15532962292` },
    { e:'🚪', n:'Doors',                 t:'~200k', u:`${ROBLOX}/games/6516141723` },
    { e:'🏡', n:'Brookhaven RP',         t:'~400k', u:`${ROBLOX}/games/4924922222` },
    { e:'🏙️', n:'Welcome to Bloxburg',   t:'~90k',  u:`${ROBLOX}/games/185655149` },
  ],
  act: [
    { e:'🔪', n:'Murder Mystery 2',      t:'~180k', u:`${ROBLOX}/games/142823291` },
    { e:'🚔', n:'Jailbreak',             t:'~120k', u:`${ROBLOX}/games/606849621` },
    { e:'🗼', n:'Tower of Hell',         t:'~90k',  u:`${ROBLOX}/games/1962086868` },
    { e:'🔫', n:'Arsenal',               t:'~80k',  u:`${ROBLOX}/games/286090429` },
  ],
  rp: [
    { e:'👑', n:'Royale High',           t:'~80k',  u:`${ROBLOX}/games/735030788` },
    { e:'👗', n:'Dress to Impress',      t:'~170k', u:`${ROBLOX}/games/15532962292` },
    { e:'🍕', n:'Work at a Pizza Place', t:'~60k',  u:`${ROBLOX}/games/192800` },
    { e:'🌸', n:'Berry Avenue',          t:'~70k',  u:`${ROBLOX}/games/8737899170` },
  ],
};

const BROWSE_ROBLOX = [
  { e:'🏠', n:'Roblox Home',    d:'Your feed',           u:`${ROBLOX}/home` },
  { e:'🔍', n:'Discover',       d:'Browse all games',    u:`${ROBLOX}/discover` },
  { e:'🎨', n:'Avatar',         d:'Customize your look', u:`${ROBLOX}/my/avatar` },
  { e:'💎', n:'Robux',          d:'Get Robux',           u:`${ROBLOX}/upgrades/robux` },
  { e:'👥', n:'Friends',        d:"See who's online",    u:`${ROBLOX}/users/friends` },
];

const BROWSE_WEB = [
  { e:'🦁', n:'Brave Search',   d:'Private search',     u:'https://search.brave.com' },
  { e:'📺', n:'YouTube',        d:'Watch videos',        u:'https://www.youtube.com' },
  { e:'💬', n:'Discord',        d:'Chat',                u:'https://discord.com/app' },
  { e:'🟠', n:'Reddit',         d:'Browse communities', u:'https://www.reddit.com' },
  { e:'🤖', n:'ChatGPT',        d:'AI assistant',        u:'https://chat.openai.com' },
];

/* ── BUILD UI ── */
function mkCard(item) {
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<div class="c-emoji">${item.e}</div><div class="c-name">${item.n}</div><div class="c-live"><div class="c-dot"></div>${item.t} playing</div>`;
  el.onclick = () => go(item.u, item.n);
  return el;
}
function mkBrow(item) {
  const el = document.createElement('div');
  el.className = 'bitem';
  el.innerHTML = `<div class="bi-ico">${item.e}</div><div><div class="bi-name">${item.n}</div><div class="bi-desc">${item.d}</div></div>`;
  el.onclick = () => go(item.u, item.n);
  return el;
}
Object.entries(GAMES).forEach(([k,arr]) => {
  const g = document.getElementById('g-'+k);
  if (g) arr.forEach(i => g.appendChild(mkCard(i)));
});
BROWSE_ROBLOX.forEach(i => document.getElementById('b-roblox').appendChild(mkBrow(i)));
BROWSE_WEB.forEach(i => document.getElementById('b-web').appendChild(mkBrow(i)));

/* ── PAGE NAV ── */
function page(p) {
  ['home','games','browse'].forEach(id => {
    const pg = document.getElementById('pg-'+id);
    const sb = document.getElementById('sib-'+id);
    if (pg) pg.style.display = 'none';
    if (sb) sb.classList.remove('on');
  });
  const tgt = document.getElementById('pg-'+p);
  const btn = document.getElementById('sib-'+p);
  if (tgt) tgt.style.display = (p==='home') ? 'flex' : 'block';
  if (btn) btn.classList.add('on');
  if (p==='home') setTimeout(()=>document.getElementById('hero').focus(), 50);
}

/* ── UV 2.x PROXY ── */
let _swReady = false;

async function ensureSW() {
  if (_swReady) return;
  if (!navigator.serviceWorker) throw new Error('Service workers not supported');
  const reg = await navigator.serviceWorker.register('/uv/uv.sw.js', {
    scope: '/uv/service/',
  });
  await new Promise(resolve => {
    if (reg.active) { resolve(); return; }
    const pending = reg.installing || reg.waiting;
    if (!pending) { resolve(); return; }
    pending.addEventListener('statechange', function() {
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

  document.getElementById('addr').value        = url;
  document.getElementById('ftitle').textContent = title || url;
  document.getElementById('furl').textContent   = url;
  document.getElementById('viewer').src         = 'about:blank';
  document.getElementById('frame').classList.add('open');
  setStatus('Connecting…', false);

  try {
    await ensureSW();
    document.getElementById('viewer').src = __uv$config.prefix + __uv$config.encodeUrl(url);
    document.getElementById('viewer').onload = () => setStatus('Connected', true);
  } catch(e) {
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
  d.style.background = ok ? 'var(--teal)' : '#f0a830';
  d.style.boxShadow  = ok ? '0 0 5px var(--teal),0 0 12px rgba(42,255,204,.3)' : '0 0 5px #f0a830';
}

let _tt;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(_tt); _tt = setTimeout(()=>el.classList.remove('show'), 3500);
}
function panic() { window.location.replace('https://classroom.google.com'); }

document.addEventListener('keydown', e => {
  if (e.key===']') panic();
  if (e.key==='Escape') closeFrame();
});

page('home');
