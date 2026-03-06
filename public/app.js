/* ============================================================
   ATOM — app.js  v5  Metro Edition
   UV Proxy · Session history · Custom SVG icons
   EasyFun removed — blocked by Akamai WAF
   ============================================================ */

/* ── SITE DATA ── */
const SITES = {
  gaming: [
    { ico:'ico-roblox',  n:'Roblox',          d:'Browse games, avatar, friends',         u:'https://www.roblox.com' },
    { ico:'ico-game',    n:'Crazy Games',      d:'Free browser games — no download',      u:'https://www.crazygames.com' },
    { ico:'ico-poki',    n:'Poki',             d:'Hundreds of free online games',         u:'https://poki.com' },
    { ico:'ico-chess',   n:'Chess.com',        d:'Play chess online',                     u:'https://www.chess.com' },
    { ico:'ico-puzzle',  n:'Coolmath Games',   d:'Puzzle and logic games',                u:'https://www.coolmathgames.com' },
  ],
  web: [
    { ico:'ico-brave',   n:'Brave Search',     d:'Private, independent search engine',    u:'https://search.brave.com' },
    { ico:'ico-youtube', n:'YouTube',          d:'Watch videos',                          u:'https://www.youtube.com' },
    { ico:'ico-discord', n:'Discord',          d:'Chat with friends',                     u:'https://discord.com/app' },
    { ico:'ico-reddit',  n:'Reddit',           d:'Browse communities',                    u:'https://www.reddit.com' },
    { ico:'ico-ai',      n:'ChatGPT',          d:'AI assistant',                          u:'https://chat.openai.com' },
    { ico:'ico-camera',  n:'Instagram',        d:'Photos and reels',                      u:'https://www.instagram.com' },
    { ico:'ico-x-mark',  n:'X / Twitter',      d:'Social media',                         u:'https://x.com' },
    { ico:'ico-pin',     n:'Pinterest',        d:'Find inspiration',                      u:'https://www.pinterest.com' },
  ],
  media: [
    { ico:'ico-music',   n:'Spotify',          d:'Stream music',                          u:'https://open.spotify.com' },
    { ico:'ico-twitch',  n:'Twitch',           d:'Watch live streams',                    u:'https://www.twitch.tv' },
    { ico:'ico-anime',   n:'9anime',           d:'Watch anime',                           u:'https://9anime.to' },
    { ico:'ico-wiki',    n:'Wikipedia',        d:'Free encyclopedia',                     u:'https://www.wikipedia.org' },
  ],
  useful: [
    { ico:'ico-drive',   n:'Google Drive',     d:'Your files in the cloud',               u:'https://drive.google.com' },
    { ico:'ico-mail',    n:'Gmail',            d:'Email',                                 u:'https://mail.google.com' },
    { ico:'ico-docs',    n:'Google Docs',      d:'Write and collaborate',                 u:'https://docs.google.com' },
    { ico:'ico-sheets',  n:'Google Sheets',    d:'Spreadsheets',                          u:'https://sheets.google.com' },
    { ico:'ico-cal',     n:'Google Calendar',  d:'Your schedule',                         u:'https://calendar.google.com' },
  ],
};

/* ── BUILD SITE LISTS ── */
function mkBitem(item) {
  const el = document.createElement('div');
  el.className = 'bitem';
  el.innerHTML = `
    <div class="bi-ico"><svg><use href="#${item.ico}"/></svg></div>
    <div class="bi-text">
      <div class="bi-name">${item.n}</div>
      <div class="bi-desc">${item.d}</div>
    </div>
    <div class="bi-arr"><svg><use href="#ico-arrow-right"/></svg></div>`;
  el.onclick = () => go(item.u, item.n);
  return el;
}
Object.entries(SITES).forEach(([k, arr]) => {
  const el = document.getElementById('b-' + k);
  if (el) arr.forEach(i => el.appendChild(mkBitem(i)));
});

/* ── SESSION HISTORY ── */
const _hist = [];

function addHistory(url, title) {
  const i = _hist.findIndex(h => h.url === url);
  if (i !== -1) _hist.splice(i, 1);
  _hist.unshift({ url, title, time: new Date() });
  if (_hist.length > 40) _hist.length = 40;
}

function renderHistory() {
  const list  = document.getElementById('history-list');
  const empty = document.getElementById('history-empty');
  list.innerHTML = '';
  if (!_hist.length) { empty.style.display = 'flex'; return; }
  empty.style.display = 'none';
  _hist.forEach((h, i) => {
    let hostname = h.url;
    try { hostname = new URL(h.url).hostname.replace('www.', ''); } catch (_) {}
    const ico  = getIcon(hostname);
    const time = fmtTime(h.time);
    const el   = document.createElement('div');
    el.className = 'hist-item';
    el.innerHTML = `
      <div class="hist-favicon"><svg><use href="#${ico}"/></svg></div>
      <div style="overflow:hidden;flex:1;min-width:0">
        <div class="hist-domain">${h.title || hostname}</div>
        <div class="hist-full">${h.url}</div>
      </div>
      <div class="hist-time">${time}</div>
      <div class="hist-remove" data-i="${i}"><svg><use href="#ico-x"/></svg></div>`;
    el.querySelector('.hist-remove').onclick = (e) => {
      e.stopPropagation();
      _hist.splice(+e.currentTarget.dataset.i, 1);
      renderHistory();
    };
    el.onclick = (e) => {
      if (e.target.closest('.hist-remove')) return;
      go(h.url, h.title);
    };
    list.appendChild(el);
  });
}

const ICON_MAP = {
  'roblox.com':         'ico-roblox',
  'youtube.com':        'ico-youtube',
  'discord.com':        'ico-discord',
  'reddit.com':         'ico-reddit',
  'chat.openai.com':    'ico-ai',
  'openai.com':         'ico-ai',
  'instagram.com':      'ico-camera',
  'x.com':              'ico-x-mark',
  'twitter.com':        'ico-x-mark',
  'spotify.com':        'ico-music',
  'twitch.tv':          'ico-twitch',
  'drive.google.com':   'ico-drive',
  'mail.google.com':    'ico-mail',
  'docs.google.com':    'ico-docs',
  'sheets.google.com':  'ico-sheets',
  'calendar.google.com':'ico-cal',
  'wikipedia.org':      'ico-wiki',
  'chess.com':          'ico-chess',
  'search.brave.com':   'ico-brave',
  'crazygames.com':     'ico-game',
  'poki.com':           'ico-poki',
  'pinterest.com':      'ico-pin',
  'coolmathgames.com':  'ico-puzzle',
  '9anime.to':          'ico-anime',
};
function getIcon(host) {
  for (const [k, v] of Object.entries(ICON_MAP)) {
    if (host.includes(k)) return v;
  }
  return 'ico-globe';
}
function fmtTime(d) {
  const ms = Date.now() - d;
  if (ms < 60000)   return 'just now';
  if (ms < 3600000) return Math.floor(ms / 60000) + 'm ago';
  if (ms < 86400000)return Math.floor(ms / 3600000) + 'h ago';
  return d.toLocaleDateString();
}

/* ── PAGE NAV ── */
function page(p) {
  ['home', 'browse', 'history'].forEach(id => {
    const pg = document.getElementById('pg-' + id);
    const sb = document.getElementById('sib-' + id);
    if (pg) pg.style.display = 'none';
    if (sb) sb.classList.remove('active');
  });
  const tgt = document.getElementById('pg-' + p);
  const btn = document.getElementById('sib-' + p);
  if (tgt) {
    tgt.style.display = (p === 'home') ? 'flex' : 'block';
    tgt.style.animation = 'pageIn .2s ease both';
  }
  if (btn) btn.classList.add('active');
  if (p === 'home')    setTimeout(() => document.getElementById('hero').focus(), 60);
  if (p === 'history') renderHistory();
}

/* ── UV SERVICE WORKER ── */
let _swReady = false;
async function ensureSW() {
  if (_swReady) return;
  if (!navigator.serviceWorker) throw new Error('Service workers not supported.');
  const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  await new Promise((res, rej) => {
    if (reg.active) { res(); return; }
    const w = reg.installing || reg.waiting;
    if (!w) { res(); return; }
    w.addEventListener('statechange', function () {
      if (this.state === 'activated') res();
      if (this.state === 'redundant') rej(new Error('SW install failed'));
    });
  });
  _swReady = true;
}

/* ── PROXY GO ── */
async function go(raw, title) {
  raw = (raw || '').trim();
  if (!raw) return;

  let url = raw;
  if (!/^https?:\/\//i.test(url)) {
    if (/^[\w-]+\.[\w.-]+(\/|$)/.test(url) && !url.includes(' ')) {
      url = 'https://' + url;
    } else {
      url   = 'https://search.brave.com/search?q=' + encodeURIComponent(url);
      title = title || 'Search: ' + raw;
    }
  }

  let host = url;
  try { host = new URL(url).hostname.replace('www.', ''); } catch (_) {}

  const label = title || host;

  /* update UI */
  document.getElementById('addr').value         = url;
  document.getElementById('ftitle').textContent  = label;
  document.getElementById('furl').textContent    = url;
  document.getElementById('loader-text').textContent = 'connecting';
  document.getElementById('viewer').src          = 'about:blank';

  const loader = document.getElementById('frame-loader');
  loader.classList.remove('hidden');
  document.getElementById('frame').classList.add('open');
  setStatus('connecting', false);
  document.getElementById('sb-info').textContent = 'connecting…';

  try {
    await ensureSW();
    const iframe = document.getElementById('viewer');
    iframe.onload = () => {
      loader.classList.add('hidden');
      setStatus('connected', true);
      document.getElementById('sb-info').textContent = host;
      addHistory(url, label);
    };
    iframe.onerror = () => {
      loader.classList.add('hidden');
      setStatus('error', false);
      document.getElementById('sb-info').textContent = 'load error';
      showToast('failed to load — try a different URL');
    };
    iframe.src = __uv$config.prefix + __uv$config.encodeUrl(url);
  } catch (e) {
    loader.classList.add('hidden');
    setStatus('error', false);
    document.getElementById('sb-info').textContent = 'error';
    showToast('proxy error: ' + e.message);
    console.error('[ATOM]', e);
  }
}

function refreshFrame() {
  const v = document.getElementById('viewer');
  if (v.src && v.src !== 'about:blank') {
    v.src = v.src;
    setStatus('refreshing', false);
  }
}

function closeFrame() {
  document.getElementById('frame').classList.remove('open');
  document.getElementById('viewer').src = 'about:blank';
  document.getElementById('frame-loader').classList.remove('hidden');
  setStatus('ready', true);
  document.getElementById('sb-info').textContent = 'idle';
}

function setStatus(msg, ok) {
  document.getElementById('stext').textContent = msg;
  const d = document.getElementById('sdot');
  d.style.background = ok ? 'var(--teal, #2affcc)' : '#f0a830';
  d.style.boxShadow  = ok
    ? '0 0 8px var(--accent)'
    : '0 0 8px #f0a830';
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
  if (e.key === ']')      panic();
  if (e.key === 'Escape') closeFrame();
});

page('home');
