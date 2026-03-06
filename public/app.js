/* ============================================================
   ATOM — app.js  v4
   UV Proxy · Session history · No game cards
   ============================================================ */

/* ── STAR CANVAS ── */
(function () {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.3 + 0.25,
      a: Math.random(), da: (Math.random() - 0.5) * 0.007,
      dx: (Math.random() - 0.5) * 0.05, dy: (Math.random() - 0.5) * 0.035,
    }));
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.x += s.dx; s.y += s.dy; s.a += s.da;
      if (s.a < 0) { s.a = 0; s.da *= -1; }
      if (s.a > 1) { s.a = 1; s.da *= -1; }
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(195,225,255,${(s.a * 0.85).toFixed(2)})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize);
  resize(); tick();
})();

/* ── SITE DATA ── */
const SITES = {
  gaming: [
    { e:'🎮', n:'Roblox via EasyFun', d:'Cloud play — no download, 6h free/day', u:'https://easyfun.gg/games/roblox.html' },
    { e:'🌐', n:'Roblox Web',         d:'Browse games, avatar, friends',          u:'https://www.roblox.com' },
    { e:'⚡', n:'Crazy Games',        d:'Browser games, no download',             u:'https://www.crazygames.com' },
    { e:'🕹️', n:'Poki',            d:'Free online games',            u:'https://poki.com' },
    { e:'🧩', n:'Chess.com',       d:'Play chess online',            u:'https://www.chess.com' },
    { e:'🎯', n:'Coolmath Games',  d:'Puzzle & logic games',         u:'https://www.coolmathgames.com' },
  ],
  web: [
    { e:'🦁', n:'Brave Search',    d:'Private, ad-free search',      u:'https://search.brave.com' },
    { e:'📺', n:'YouTube',         d:'Watch videos',                 u:'https://www.youtube.com' },
    { e:'💬', n:'Discord',         d:'Chat with friends',            u:'https://discord.com/app' },
    { e:'🟠', n:'Reddit',          d:'Browse communities',           u:'https://www.reddit.com' },
    { e:'🤖', n:'ChatGPT',         d:'AI assistant',                 u:'https://chat.openai.com' },
    { e:'📸', n:'Instagram',       d:'Photos & reels',               u:'https://www.instagram.com' },
    { e:'🐦', n:'X / Twitter',     d:'Social media',                 u:'https://x.com' },
    { e:'📌', n:'Pinterest',       d:'Find inspiration',             u:'https://www.pinterest.com' },
  ],
  media: [
    { e:'🎵', n:'Spotify',         d:'Stream music',                 u:'https://open.spotify.com' },
    { e:'🟣', n:'Twitch',          d:'Watch streams',                u:'https://www.twitch.tv' },
    { e:'🎬', n:'9anime',          d:'Watch anime',                  u:'https://9anime.to' },
    { e:'📰', n:'Wikipedia',       d:'Free encyclopedia',            u:'https://www.wikipedia.org' },
  ],
  useful: [
    { e:'☁️', n:'Google Drive',    d:'Your files in the cloud',      u:'https://drive.google.com' },
    { e:'📧', n:'Gmail',           d:'Email',                        u:'https://mail.google.com' },
    { e:'📝', n:'Google Docs',     d:'Write & collaborate',          u:'https://docs.google.com' },
    { e:'📊', n:'Google Sheets',   d:'Spreadsheets',                 u:'https://sheets.google.com' },
    { e:'🗓️', n:'Google Calendar', d:'Your schedule',                u:'https://calendar.google.com' },
  ],
};

/* ── BUILD BROWSE LISTS ── */
function mkBitem(item) {
  const el = document.createElement('div');
  el.className = 'bitem';
  el.innerHTML = `
    <div class="bi-ico">${item.e}</div>
    <div>
      <div class="bi-name">${item.n}</div>
      <div class="bi-desc">${item.d}</div>
    </div>
    <div class="bi-arr">›</div>`;
  el.onclick = () => go(item.u, item.n);
  return el;
}
Object.entries(SITES).forEach(([k, arr]) => {
  const el = document.getElementById('b-' + k);
  if (el) arr.forEach(i => el.appendChild(mkBitem(i)));
});

/* ── SESSION HISTORY ── */
const _history = [];

function addHistory(url, title) {
  // Remove duplicate if already present
  const idx = _history.findIndex(h => h.url === url);
  if (idx !== -1) _history.splice(idx, 1);
  _history.unshift({ url, title, time: new Date() });
  if (_history.length > 30) _history.length = 30;
  renderHistory();
}

function renderHistory() {
  const list  = document.getElementById('history-list');
  const empty = document.getElementById('history-empty');
  list.innerHTML = '';
  if (_history.length === 0) {
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';
  _history.forEach((h, i) => {
    let hostname = h.url;
    try { hostname = new URL(h.url).hostname.replace('www.',''); } catch (_) {}
    const favicon = getFavicon(hostname);
    const timeStr = formatTime(h.time);
    const el = document.createElement('div');
    el.className = 'hist-item';
    el.innerHTML = `
      <div class="hist-favicon">${favicon}</div>
      <div style="overflow:hidden;flex:1;min-width:0">
        <div class="hist-domain">${h.title || hostname}</div>
        <div class="hist-full">${h.url}</div>
      </div>
      <div class="hist-time">${timeStr}</div>
      <div class="hist-remove" title="Remove" data-idx="${i}">✕</div>`;
    el.onclick = (e) => {
      if (e.target.classList.contains('hist-remove')) {
        _history.splice(+e.target.dataset.idx, 1);
        renderHistory();
        return;
      }
      go(h.url, h.title);
    };
    list.appendChild(el);
  });
}

function getFavicon(hostname) {
  const map = {
    'easyfun.gg':'🎮','roblox.com':'🕹️','youtube.com':'📺','discord.com':'💬','reddit.com':'🟠',
    'chat.openai.com':'🤖','instagram.com':'📸','x.com':'🐦','twitter.com':'🐦',
    'spotify.com':'🎵','twitch.tv':'🟣','google.com':'🔵','drive.google.com':'☁️',
    'mail.google.com':'📧','docs.google.com':'📝','sheets.google.com':'📊',
    'wikipedia.org':'📰','chess.com':'♟️','crazygames.com':'⚡','poki.com':'🕹️',
    'search.brave.com':'🦁','pinterest.com':'📌','calendar.google.com':'🗓️',
    'coolmathgames.com':'🎯','9anime.to':'🎬',
  };
  for (const [k,v] of Object.entries(map)) {
    if (hostname.includes(k)) return v;
  }
  return '🌐';
}

function formatTime(d) {
  const now = new Date();
  const diffMs = now - d;
  if (diffMs < 60000) return 'Just now';
  if (diffMs < 3600000) return Math.floor(diffMs/60000) + 'm ago';
  if (diffMs < 86400000) return Math.floor(diffMs/3600000) + 'h ago';
  return d.toLocaleDateString();
}

/* ── PAGE NAV ── */
function page(p) {
  ['home','browse','history'].forEach(id => {
    const pg = document.getElementById('pg-' + id);
    const sb = document.getElementById('sib-' + id);
    if (pg) pg.style.display = 'none';
    if (sb) sb.classList.remove('active');
  });
  const tgt = document.getElementById('pg-' + p);
  const btn = document.getElementById('sib-' + p);
  if (tgt) {
    tgt.style.display = (p === 'home') ? 'flex' : 'block';
    tgt.style.animation = 'pageIn .22s ease both';
  }
  if (btn) btn.classList.add('active');
  if (p === 'home') setTimeout(() => document.getElementById('hero').focus(), 60);
  if (p === 'history') renderHistory();
}

const _ps = document.createElement('style');
_ps.textContent = `@keyframes pageIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}`;
document.head.appendChild(_ps);

/* ── UV SERVICE WORKER ── */
let _swReady = false;

async function ensureSW() {
  if (_swReady) return;
  if (!navigator.serviceWorker) throw new Error('Service Workers not supported in this context.');
  const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  await new Promise((resolve, reject) => {
    if (reg.active) { resolve(); return; }
    const w = reg.installing || reg.waiting;
    if (!w) { resolve(); return; }
    w.addEventListener('statechange', function () {
      if (this.state === 'activated') resolve();
      if (this.state === 'redundant') reject(new Error('SW install failed'));
    });
  });
  _swReady = true;
}

/* ── MAIN PROXY GO ── */
async function go(raw, title) {
  raw = (raw || '').trim();
  if (!raw) return;

  // Build full URL
  let url = raw;
  if (!/^https?:\/\//i.test(url)) {
    if (/^[\w-]+\.[\w.-]+(\/|$)/.test(url) && !url.includes(' ')) {
      url = 'https://' + url;
    } else {
      url = 'https://search.brave.com/search?q=' + encodeURIComponent(url);
      title = title || 'Search: ' + raw;
    }
  }

  let hostname = url;
  try { hostname = new URL(url).hostname; } catch (_) {}

  const displayTitle = title || hostname.replace('www.','');

  // Update UI
  document.getElementById('addr').value          = url;
  document.getElementById('ftitle').textContent   = displayTitle;
  document.getElementById('furl').textContent     = url;
  document.getElementById('viewer').src           = 'about:blank';
  document.getElementById('sb-info').textContent  = 'Connecting…';
  document.getElementById('loading-text').textContent = 'Connecting…';

  const loadingEl = document.getElementById('frame-loading');
  loadingEl.classList.remove('hidden');
  document.getElementById('frame').classList.add('open');
  setStatus('Connecting…', false);

  try {
    await ensureSW();

    const proxied = __uv$config.prefix + __uv$config.encodeUrl(url);
    const iframe  = document.getElementById('viewer');

    iframe.onload = () => {
      loadingEl.classList.add('hidden');
      setStatus('Connected', true);
      document.getElementById('sb-info').textContent = hostname.replace('www.','');
      addHistory(url, displayTitle);
    };

    iframe.onerror = () => {
      loadingEl.classList.add('hidden');
      setStatus('Error', false);
      document.getElementById('sb-info').textContent = 'Load error';
      showToast('Failed to load — try a different URL');
    };

    iframe.src = proxied;
  } catch (e) {
    loadingEl.classList.add('hidden');
    setStatus('Error', false);
    showToast('Proxy error: ' + e.message);
    document.getElementById('sb-info').textContent = 'Error';
    console.error('[ATOM proxy error]', e);
  }
}

/* Refresh current proxied page */
function refreshFrame() {
  const iframe = document.getElementById('viewer');
  if (iframe.src && iframe.src !== 'about:blank') {
    iframe.src = iframe.src;
    setStatus('Refreshing…', false);
  }
}

function closeFrame() {
  document.getElementById('frame').classList.remove('open');
  document.getElementById('viewer').src = 'about:blank';
  document.getElementById('frame-loading').classList.remove('hidden');
  setStatus('Ready', true);
  document.getElementById('sb-info').textContent = 'Idle';
}

function setStatus(msg, ok) {
  document.getElementById('stext').textContent = msg;
  const d = document.getElementById('sdot');
  d.style.background = ok ? 'var(--teal)' : '#f0a830';
  d.style.boxShadow  = ok
    ? '0 0 6px var(--teal),0 0 14px rgba(42,255,204,.32)'
    : '0 0 6px #f0a830,0 0 14px rgba(240,168,48,.32)';
}

let _tt;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_tt);
  _tt = setTimeout(() => el.classList.remove('show'), 3500);
}

function panic() {
  window.location.replace('https://classroom.google.com');
}

document.addEventListener('keydown', e => {
  if (e.key === ']') panic();
  if (e.key === 'Escape') closeFrame();
});

/* Init */
page('home');
