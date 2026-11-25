// Ethic Messenger — client (Discord-style UI)
'use strict';
(() => {
const LK = window.LivekitClient;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// ---------- icons ----------
const ic = (d, fill = false) => fill
  ? `<svg viewBox="0 0 24 24" fill="currentColor">${d}</svg>`
  : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I = {
  phone: ic('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
  video: ic('<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>'),
  videoOff: ic('<path d="M10.7 6H14a2 2 0 0 1 2 2v3.3l1 1L22 8v8"/><path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="m2 2 20 20"/>'),
  mic: ic('<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>'),
  micOff: ic('<path d="m2 2 20 20"/><path d="M18.9 13.4A7 7 0 0 0 19 11v-1M5 10v1a7 7 0 0 0 11.5 5.4M15 9.3V5a3 3 0 0 0-5.7-1.3M9 9v2a3 3 0 0 0 5.1 2.1M12 18v4"/>'),
  screen: ic('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'),
  hangup: ic('<path d="M10.7 13.3a16 16 0 0 0 3.4 2.6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8" transform="rotate(135 12 12)"/>'),
  send: ic('<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/>'),
  back: ic('<path d="m15 18-6-6 6-6"/>'),
  plus: ic('<path d="M12 5v14M5 12h14"/>'),
  dots: ic('<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>'),
  minimize: ic('<path d="m4 14 6 0 0 6M20 10l-6 0 0-6M14 10l7-7M3 21l7-7"/>'),
  x: ic('<path d="M18 6 6 18M6 6l12 12"/>'),
  gear: ic('<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.6a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.6a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
  support: ic('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.3-2.5 3.8M12 17.2h.01"/>'),
  shield: ic('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  hash: ic('<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>'),
  speaker: ic('<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>'),
  at: ic('<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>'),
  members: ic('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'),
  reply: ic('<path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>'),
  edit: ic('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  trash: ic('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>'),
  copy: ic('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
  download: ic('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'),
  play: ic('<path d="M7 4v16l13-8z"/>', true),
  pause: ic('<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>', true),
  check: ic('<path d="M20 6 9 17l-5-5"/>'),
  checks: ic('<path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>'),
  clock: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  chevron: ic('<path d="m6 9 6 6 6-6"/>'),
  user: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  leave: ic('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
  userPlus: ic('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>'),
  file: '<svg class="file-ico" viewBox="0 0 30 40"><path d="M2 0h18l10 10v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" fill="#e6e6e6"/><path d="M20 0v8a2 2 0 0 0 2 2h8z" fill="#a3a3a3"/><path d="M7 20h16M7 25h16M7 30h10" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>',
};
const CHECK = '<span class="verified" title="Подтверждённый аккаунт"><svg viewBox="0 0 24 24"><path fill="#1d9bf0" d="M12 1.5l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3-3.2-.1L12 22.5l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3 3.2.1z"/><path d="m7.8 12.3 2.8 2.8 5.6-5.8" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
const setIcon = (sel, name) => { $(sel).innerHTML = I[name]; };
setIcon('#newGroupBtn', 'plus'); setIcon('#adminBtn', 'shield'); setIcon('#settingsBtn', 'gear'); setIcon('#backBtn', 'back');
setIcon('#audioCallBtn', 'phone'); setIcon('#videoCallBtn', 'video'); setIcon('#membersBtn', 'members'); setIcon('#chatMenuBtn', 'dots');
setIcon('#replyCancel', 'x'); setIcon('#attachCancel', 'trash'); setIcon('#voiceBtn', 'mic'); setIcon('#sendBtn', 'send');
setIcon('#leaveBtn', 'hangup'); setIcon('#addToCallBtn', 'userPlus'); setIcon('#screenBtn', 'screen'); setIcon('#declineBtn', 'hangup'); setIcon('#acceptAudioBtn', 'phone');
setIcon('#acceptVideoBtn', 'video'); setIcon('#callMinBtn', 'minimize'); setIcon('#callSettingsBtn', 'gear'); setIcon('#adminClose', 'x');
$('#attachBtn').innerHTML = `<span>${I.plus}</span>`;
$('.esc-x').innerHTML = I.x;

// ---------- helpers ----------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const linkify = (s) => esc(s)
  .replace(/(\bhttps?:\/\/[^\s<]+|\bwww\.[^\s<]+)/g, (u) => `<a href="${u.startsWith('www.') ? 'https://' + u : u}" target="_blank" rel="noopener noreferrer">${u}</a>`)
  .replace(/(^|[\s(])@([A-Za-z0-9_.]{2,32})/g, (_, pre, name) => `${pre}<span class="mention" data-mention="${name}">@${name}</span>`);
const pad = (n) => String(n).padStart(2, '0');
const hhmm = (t) => { const d = new Date(t); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const dayKey = (t) => new Date(t).toDateString();
const isToday = (t) => dayKey(t) === new Date().toDateString();
const isYesterday = (t) => { const y = new Date(); y.setDate(y.getDate() - 1); return dayKey(t) === y.toDateString(); };
const dayLabel = (t) => new Date(t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
function fullTime(t) {
  if (isToday(t)) return `Сегодня в ${hhmm(t)}`;
  if (isYesterday(t)) return `Вчера в ${hhmm(t)}`;
  const d = new Date(t);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${hhmm(t)}`;
}
function lastSeenText(u) {
  if (!u) return '';
  if (u.online) return 'В сети';
  const t = u.lastSeen;
  if (!t) return 'Не в сети';
  const mins = Math.floor((Date.now() - t) / 60000);
  if (mins < 1) return 'Был(а) в сети только что';
  if (mins < 60) return `Был(а) в сети ${mins} мин. назад`;
  if (isToday(t)) return `Был(а) в сети сегодня в ${hhmm(t)}`;
  if (isYesterday(t)) return `Был(а) в сети вчера в ${hhmm(t)}`;
  return `Был(а) в сети ${new Date(t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`;
}
const fmtSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} МБ` : b >= 1024 ? `${Math.round(b / 1024)} КБ` : `${b} Б`);
const fmtDur = (s) => { s = Math.max(0, Math.round(s || 0)); return `${Math.floor(s / 60)}:${pad(s % 60)}`; };
const COLORS = ['linear-gradient(160deg, #6e6e73, #2c2c2e)', 'linear-gradient(160deg, #636366, #262628)', 'linear-gradient(160deg, #7a7a7f, #333336)', 'linear-gradient(160deg, #5a5a5e, #222224)',
  'linear-gradient(160deg, #707075, #303033)', 'linear-gradient(160deg, #808085, #3a3a3d)', 'linear-gradient(160deg, #58585c, #1f1f21)', 'linear-gradient(160deg, #75757a, #38383b)'];
const colorOf = (id) => COLORS[Math.abs(id) % COLORS.length];
function avatarRaw(name, id, url, cls = '', status = null) {
  const initials = String(name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const inner = url ? `<img src="${esc(url)}" alt="" loading="lazy">` : esc(initials);
  const dot = status ? `<span class="status ${status}"></span>` : '';
  return `<div class="avatar ${cls}" style="background:${url ? 'transparent' : colorOf(id)}">${inner}${dot}</div>`;
}
// Prefer the freshest cached copy of a user (avatars/names change live).
const fresh = (u) => (u && S.users.get(u.id)) || u;
const avatarOf = (u, cls = '', withStatus = false) => {
  const f = fresh(u) || {};
  return avatarRaw(f.displayName, f.id || 0, f.avatar, cls, withStatus ? (f.online ? 'online' : 'offline') : null);
};
const PLUS_BADGE = '<span class="plus-badge" title="Подписка Ethic+"><img src="/logo.png" alt=""><span>Ethic+</span></span>';
// Next to a name: the blue check and the Ethic+ pill.
const checkOf = (u) => { const f = fresh(u); return (f?.verified ? CHECK : '') + (f?.plus ? PLUS_BADGE : ''); };
const badgeOf = (u) => {
  const f = fresh(u);
  return f?.badge ? `<span class="dev-badge ${f.role === 'owner' ? 'owner' : ''}">${esc(f.badge)}</span>` : '';
};
const DEFAULT_BANNER = 'radial-gradient(120% 140% at 0% 0%, #3d3d42 0%, #161618 45%, #000000 100%)';
// Profile banner: a picked color, an uploaded image, or the default amber gradient.
const bannerStyle = (u) => {
  const b = fresh(u)?.banner;
  if (!b) return `background:${DEFAULT_BANNER}`;
  if (b.startsWith('#')) return `background:${b}`;
  if (/\.(?:mp4|webm)$/.test(b)) return 'background:#1a1a1a';
  // Single quotes + stripped specials: this string also lands inside style="…" attributes.
  return `background:#1a1a1a url('${b.replace(/['"\\()<>\s]/g, '')}') center/cover`;
};
const nameHtml = (u, text) => {
  const st = fresh(u)?.nameStyle;
  return `<span${['red', 'blue', 'purple'].includes(st) ? ` class="grad-${st}"` : ''}>${esc(text)}</span>`;
};
const isVideoBanner = (b) => /^\/uploads\/[a-f0-9]{32}\.(?:mp4|webm)$/.test(b || '');
const bannerVideo = (u) => { const b = fresh(u)?.banner; return isVideoBanner(b) ? `<video class="banner-video" src="${esc(b)}" autoplay loop muted playsinline></video>` : ''; };
const nameColor = (u) => { const f = fresh(u); return f?.role === 'owner' ? '#ffffff' : f?.dev ? '#d4d4d4' : ''; };
let toastTimer;
function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 3500);
}
const store = {
  get(k, d) { try { const v = localStorage.getItem(`ethic.${k}`); return v === null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(`ethic.${k}`, v); } catch {} },
  del(k) { try { localStorage.removeItem(`ethic.${k}`); } catch {} },
};
const isTouch = matchMedia('(pointer: coarse)').matches;

// ---------- state ----------
const S = {
  token: store.get('token', null),
  me: null,
  chats: new Map(),
  users: new Map(), // id -> user (cache for names/avatars)
  view: 'home', // 'home' or a group chat id
  active: null,
  messages: new Map(), // chatId -> { list, hasMore }
  typing: new Map(), // chatId -> Map(userId -> until)
  ws: null,
  attach: null, // { mode: 'image'|'file', blob, w, h, url, name, size, mime }
  replyTo: null, // message
  editing: null, // message
  showMembers: store.get('members', '1') === '1',
  version: null,
  lastDm: null,
};

// A lasting id of this browser: login limits count per device, not per account.
const DEVICE_ID = store.get('deviceId', '') || (() => { const id = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^\w-]/g, ''); store.set('deviceId', id); return id; })();
async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Device-Id': DEVICE_ID, ...(S.token ? { Authorization: `Bearer ${S.token}` } : {}), ...(store.get('maintKey', '') ? { 'X-Maint-Key': store.get('maintKey', '').split(':')[1] } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && data.accountState) {
    showEnded(data);
    throw Object.assign(new Error(data.error), { status: 401, data });
  }
  if (res.status === 401 && S.me) { logout(); throw new Error('Сессия истекла'); }
  if (res.status === 503 && data.maintenance) { store.del('maintKey'); Maint.denied = true; Maint.set(data.maintenance); }
  if (!res.ok) throw Object.assign(new Error(data.error || `Ошибка ${res.status}`), { status: res.status, data });
  return data;
}
// Upload with progress (fetch has no upload progress).
function upload(blob, { kind = 'image', name = '', onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/upload?kind=${kind}&name=${encodeURIComponent(name)}`);
    xhr.setRequestHeader('Authorization', `Bearer ${S.token}`);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress?.(e.loaded / e.total); };
    xhr.onload = () => {
      let data = {};
      try { data = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.error || `Ошибка ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error('Нет соединения'));
    xhr.send(blob);
  });
}

function rememberUsers(list) {
  for (const u of list) {
    if (!u) continue;
    S.users.set(u.id, { ...S.users.get(u.id), ...u });
    if (S.me && u.id === S.me.id) S.me = { ...S.me, ...u };
  }
}
const userName = (id) => (id === S.me?.id ? S.me.displayName : S.users.get(id)?.displayName) || 'Пользователь';
const otherMember = (chat) => chat.members.find((m) => m.id !== S.me.id) || chat.members[0];
// Links people share: the address without a port (port 443 now leads to the messenger too).
// Port 443 belongs to the VPN, so shared links keep the port.
const PUBLIC_ORIGIN = location.hostname === 'ethicmessenger.duckdns.org' ? 'https://ethicmessenger.duckdns.org:8443' : location.origin;
const SAVED_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/></svg>';
const isGroupish = (c) => c?.type === 'group' || c?.type === 'channel';
const isChatAdmin = (c) => !!c && (c.type === 'direct' || c.ownerId === S.me?.id || (c.admins || []).includes(S.me?.id));
const chatName = (chat) => (chat.type === 'saved' ? 'Избранное' : isGroupish(chat) ? chat.title : (fresh(otherMember(chat))?.displayName || 'Чат'));
const chatCheck = (chat) => (chat.type === 'direct' ? checkOf(otherMember(chat)) : '');
const groupAvatar = (chat, cls = '') => avatarRaw(chat.title, chat.id + 3, chat.avatar || null, `group ${cls}`);
function previewText(m) {
  if (!m) return '';
  if (m.image) return m.text ? `📷 ${m.text}` : '📷 Фото';
  if (m.file?.kind === 'voice') return '🎤 Голосовое сообщение';
  if (m.file?.kind === 'circle') return '⭕ Видеосообщение';
  if (m.file) return `📎 ${m.text || m.file.name}`;
  return m.text;
}
const replyKindText = (r) => (r.kind === 'photo' ? 'Фото' : r.kind === 'voice' ? 'Голосовое сообщение' : r.kind ? (r.fileName || 'Файл') : '');

// ---------- sounds ----------
const Sound = (() => {
  let ctx = null;
  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      applySink();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  function applySink() {
    const id = store.get('speaker', '');
    if (ctx?.setSinkId) ctx.setSinkId(id && id !== 'default' ? id : '').catch(() => {});
  }
  // One enveloped oscillator note.
  function note(c, at, freq, dur, { type = 'sine', vol = 0.15, to = null, attack = 0.015 } = {}) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, at);
    if (to) o.frequency.exponentialRampToValueAtTime(to, at + dur);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(c.destination);
    o.start(at);
    o.stop(at + dur + 0.05);
  }
  const once = (fn) => { try { const c = getCtx(); fn(c, c.currentTime + 0.02); } catch {} };
  const RINGTONES = {
    classic: { name: 'Классика', period: 2000, play(c, t) { note(c, t, 880, 0.22); note(c, t + 0.25, 660, 0.22); } },
    marimba: {
      name: 'Маримба', period: 2400,
      play(c, t) { [659, 784, 988, 1319, 988, 1319].forEach((f, i) => note(c, t + i * 0.13, f, 0.35, { type: 'triangle', vol: 0.2, attack: 0.005 })); },
    },
    soft: { name: 'Нежный', period: 2600, play(c, t) { [523, 659, 784].forEach((f) => note(c, t, f, 1.1, { vol: 0.07, attack: 0.25 })); } },
    digital: {
      name: 'Цифровой', period: 1600,
      play(c, t) { for (let i = 0; i < 4; i++) note(c, t + i * 0.12, 1250, 0.07, { type: 'square', vol: 0.05, attack: 0.003 }); },
    },
    retro: {
      name: 'Старый телефон', period: 3000,
      play(c, t) { for (let i = 0; i < 20; i++) note(c, t + i * 0.05, i % 2 ? 480 : 440, 0.05, { type: 'square', vol: 0.04, attack: 0.002 }); },
    },
    none: { name: 'Без звука', period: 2000, play() {} },
  };
  let loop = null;
  function startLoop(fn, period) {
    stop();
    try {
      const c = getCtx();
      fn(c, c.currentTime + 0.02);
      loop = setInterval(() => fn(c, c.currentTime + 0.02), period);
    } catch {}
  }
  function stop() { clearInterval(loop); loop = null; }
  const msgSounds = () => store.get('msgSound', '1') === '1';
  return {
    RINGTONES,
    applySink,
    ring(id = store.get('ringtone', 'classic')) {
      const r = RINGTONES[id] || RINGTONES.classic;
      startLoop((c, t) => r.play(c, t), r.period);
    },
    preview(id) { stop(); once((c, t) => (RINGTONES[id] || RINGTONES.classic).play(c, t)); },
    ringback() { startLoop((c, t) => note(c, t, 425, 1.0, { vol: 0.06, attack: 0.02 }), 4000); },
    stop,
    // Someone entered / left the call: rising vs falling two-tone chime.
    join() { once((c, t) => { note(c, t, 587, 0.16, { type: 'triangle', vol: 0.14, attack: 0.005 }); note(c, t + 0.11, 880, 0.24, { type: 'triangle', vol: 0.14, attack: 0.005 }); }); },
    leave() { once((c, t) => { note(c, t, 880, 0.16, { type: 'triangle', vol: 0.12, attack: 0.005 }); note(c, t + 0.11, 523, 0.26, { type: 'triangle', vol: 0.12, attack: 0.005 }); }); },
    sent() { if (msgSounds()) once((c, t) => note(c, t, 320, 0.14, { vol: 0.07, to: 1400, attack: 0.01 })); },
    MSG_SOUNDS: { drop: 'Капля', bubble: 'Пузырь', bell: 'Колокольчик', none: 'Без звука' },
    received(kind) {
      if (kind === 'none' || !msgSounds()) return;
      if (kind === 'drop') return once((c, t) => note(c, t, 1400, 0.18, { vol: 0.12, to: 500, attack: 0.004 }));
      if (kind === 'bubble') return once((c, t) => { note(c, t, 400, 0.08, { vol: 0.12, to: 900 }); note(c, t + 0.09, 600, 0.1, { vol: 0.1, to: 1300 }); });
      if (kind === 'bell') return once((c, t) => [1568, 2093].forEach((f, i) => note(c, t + i * 0.12, f, 0.6, { type: 'sine', vol: 0.08, attack: 0.003 })));
      if (msgSounds()) once((c, t) => { note(c, t, 988, 0.12, { type: 'triangle', vol: 0.12, attack: 0.004 }); note(c, t + 0.09, 1319, 0.18, { type: 'triangle', vol: 0.1, attack: 0.004 }); });
    },
  };
})();

// ---------- noise suppression ----------
// off: raw mic · standard: browser's built-in processing · strong: RNNoise neural net in an AudioWorklet.
const NS = {
  lib: null, wasm: null,
  mode: () => store.get('noise', 'standard'),
  constraints(deviceId) {
    const on = NS.mode() !== 'off';
    const c = { echoCancellation: true, noiseSuppression: on, autoGainControl: on, channelCount: 1 };
    if (deviceId) c.deviceId = { exact: deviceId };
    return c;
  },
  async load() {
    if (!this.lib) this.lib = await import('/vendor/ns/index.js');
    if (!this.wasm) this.wasm = await this.lib.loadRnnoise({ url: '/vendor/ns/rnnoise.wasm', simdUrl: '/vendor/ns/rnnoise_simd.wasm' });
  },
  // Pipes a raw mic track through RNNoise; returns the cleaned track and a stop().
  async wrap(raw) {
    await this.load();
    const ctx = new AudioContext({ sampleRate: 48000 });
    await ctx.audioWorklet.addModule('/vendor/ns/rnnoise/workletProcessor.js');
    const src = ctx.createMediaStreamSource(new MediaStream([raw]));
    const node = new this.lib.RnnoiseWorkletNode(ctx, { wasmBinary: this.wasm, maxChannels: 1 });
    const dest = ctx.createMediaStreamDestination();
    src.connect(node).connect(dest);
    if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
    return {
      track: dest.stream.getAudioTracks()[0],
      stop() {
        try { src.disconnect(); node.disconnect(); node.destroy?.(); } catch {}
        ctx.close().catch(() => {});
        raw.stop();
      },
    };
  },
  async rawStream() {
    const id = store.get('mic', '');
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: this.constraints(id) });
    } catch (e) {
      // A saved device may have been unplugged: fall back to the default mic.
      if (id && (e.name === 'OverconstrainedError' || e.name === 'NotFoundError')) return navigator.mediaDevices.getUserMedia({ audio: this.constraints() });
      throw e;
    }
  },
  // Mic stream honoring the chosen mode; stop() releases everything.
  async micStream() {
    const stream = await this.rawStream();
    const stopRaw = () => stream.getTracks().forEach((t) => t.stop());
    if (this.mode() !== 'strong') return { stream, stop: stopRaw };
    try {
      const w = await this.wrap(stream.getAudioTracks()[0]);
      return { stream: new MediaStream([w.track]), stop: () => w.stop() };
    } catch (e) {
      console.error('RNNoise unavailable', e);
      return { stream, stop: stopRaw };
    }
  },
};

// ---------- auth ----------
let authMode = 'login';
function setAuthMode(mode) {
  authMode = mode;
  const reg = mode === 'register';
  $('#auth').classList.toggle('register', reg);
  $('#authTitle').textContent = reg ? 'Создать учётную запись' : 'С возвращением!';
  $('#authSub').textContent = reg ? 'Добро пожаловать в Ethic' : 'Рады видеть вас снова в Ethic!';
  $('#authSubmit').textContent = reg ? 'Продолжить' : 'Вход';
  $('#authSwitchText').textContent = reg ? 'Уже есть учётная запись?' : 'Нужна учётная запись?';
  $('#authSwitch').textContent = reg ? 'Войти' : 'Зарегистрироваться';
  $('#authForm').password.autocomplete = reg ? 'new-password' : 'current-password';
  $('#loginLabel').textContent = reg || !emailEnabled ? 'Логин' : 'Логин или почта';
  $('#authError').textContent = '';
  showLoginCode(false);
}
function showLoginCode(on, email) {
  const form = $('#authForm');
  $('#loginCodeRow').classList.toggle('hidden', !on);
  $('#loginCodeHint').textContent = on ? `Код отправлен на ${email}` : '';
  form.loginCode.value = '';
  form.loginCode.required = on;
  if (on) form.loginCode.focus();
}
$('#authSwitch').addEventListener('click', (e) => { e.preventDefault(); setAuthMode(authMode === 'login' ? 'register' : 'login'); });

// ---------- email codes ----------
let emailEnabled = false;
// Button that sends a code, then counts down a minute before it can be pressed again.
async function sendCodeBtn(btn, errorEl, request) {
  errorEl.textContent = '';
  btn.disabled = true;
  try {
    const res = await request();
    let left = 60;
    const label = btn.dataset.label || (btn.dataset.label = btn.textContent);
    btn.textContent = `Ещё раз (${left})`;
    const t = setInterval(() => {
      left--;
      if (left > 0) { btn.textContent = `Ещё раз (${left})`; return; }
      clearInterval(t);
      btn.textContent = label;
      btn.disabled = false;
    }, 1000);
    return res;
  } catch (err) {
    errorEl.textContent = err.message;
    btn.disabled = false;
    return null;
  }
}
$('#regCodeBtn').addEventListener('click', async () => {
  const email = $('#authForm').email.value.trim();
  if (!email) return ($('#authError').textContent = 'Введите почту');
  if (await sendCodeBtn($('#regCodeBtn'), $('#authError'), () => api('/api/register/code', { method: 'POST', body: { email } }))) {
    toast(`Код отправлен на ${email}`);
    $('#authForm').emailCode.focus();
  }
});

function showReset(on) {
  $('#authForm').classList.toggle('hidden', on);
  $('#resetForm').classList.toggle('hidden', !on);
  $('#authTitle').textContent = on ? 'Сброс пароля' : 'С возвращением!';
  $('#authSub').textContent = on ? 'Пришлём код на почту, привязанную к аккаунту' : 'Рады видеть вас снова в Ethic!';
  $('#resetError').textContent = '';
  if (on) {
    $('#resetForm').login.value = $('#authForm').username.value;
    $('#resetHint').textContent = '';
  }
}
$('#forgotLink').addEventListener('click', (e) => { e.preventDefault(); showReset(true); });
$('#resetBack').addEventListener('click', (e) => { e.preventDefault(); showReset(false); });
$('#resetCodeBtn').addEventListener('click', async () => {
  const login = $('#resetForm').login.value.trim();
  if (!login) return ($('#resetError').textContent = 'Введите логин или почту');
  const res = await sendCodeBtn($('#resetCodeBtn'), $('#resetError'), () => api('/api/password/forgot', { method: 'POST', body: { login } }));
  if (res) {
    $('#resetHint').textContent = `Код отправлен на ${res.email}`;
    $('#resetForm').code.focus();
  }
});
$('#resetForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  $('#resetError').textContent = '';
  try {
    const data = await api('/api/password/reset', { method: 'POST', body: f });
    S.token = data.token;
    store.set('token', data.token);
    toast('Пароль изменён');
    await enterApp(data.user);
  } catch (err) { $('#resetError').textContent = err.message; }
});

$('#authForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  $('#authError').textContent = '';
  $('#authSubmit').disabled = true;
  try {
    const data = await api(`/api/${authMode}`, { method: 'POST', body: Object.fromEntries(f) });
    S.token = data.token;
    store.set('token', data.token);
    await enterApp(data.user);
  } catch (err) {
    if (err.status === 428) showLoginCode(true, err.data.email);
    else $('#authError').textContent = err.message;
  } finally {
    $('#authSubmit').disabled = false;
  }
});

async function logout() {
  if (call) leaveCall();
  try { if (S.token) await fetch('/api/logout', { method: 'POST', headers: { Authorization: `Bearer ${S.token}` } }); } catch {}
  store.del('token');
  location.reload();
}

async function boot() {
  document.body.classList.add('no-email');
  api('/api/config').then((c) => {
    Maint.set(c.maintenance);
    Announce.set(c.announcement);
    $('.invite-field').classList.toggle('hidden', !c.inviteRequired);
    emailEnabled = !!c.emailEnabled;
    S.stt = !!c.stt;
    document.body.classList.toggle('no-email', !emailEnabled);
    setAuthMode(authMode);
  }).catch(() => {});
  if (S.token) {
    try {
      const { user } = await api('/api/me');
      return enterApp(user);
    } catch (err) {
      // Banned or deleted: the window stays until the person signs out, even after a reload.
      if (err.data?.accountState) return;
      // Closed for maintenance: the sign-in is kept, so everyone is still in their account when it opens again.
      if (err.status === 503 && err.data?.maintenance) return;
      store.del('token'); S.token = null;
    }
  }
  $('#auth').classList.remove('hidden');
  // Came by the QR code and not signed in: a greeting page first, its button leads to the sign-in form.
  if (store.get('promo', '')) $('#promoScreen').classList.remove('hidden');
}
// On a phone the page first offers the app (its own link needs no site check); the browser stays as the second way.
if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && !/EthicMessenger/i.test(navigator.userAgent)) {
  $('#promoApp').classList.remove('hidden');
  $('#promoGo').classList.remove('primary'); $('#promoGo').classList.add('second');
}
$('#promoGo').addEventListener('click', () => { if (S.me) return claimPromo(); promoAccepted = true; $('#promoScreen').classList.add('hidden'); });

// ---------- gift by link ----------
// The QR code on the hoodie opens /hoodie. The gift is remembered until the person is signed in, then offered once.
if (location.pathname === '/hoodie') { store.set('promo', 'hoodie'); history.replaceState(null, '', '/'); }
// The link from Boosty: …/sponsor. Remembered until the person is signed in, then the window with screenshots opens.
if (location.pathname === '/sponsor') { store.set('sponsor', '1'); history.replaceState(null, '', '/'); }
// Signed in: the same greeting page, and its button gives the gift at once.
let promoAccepted = false; // pressed «Войти в аккаунт и получить» before signing in: no need to ask twice
function offerPromo() {
  if (!store.get('promo', '') || !S.me) return;
  if (promoAccepted) return claimPromo();
  $('#promoGo').textContent = 'Получить подарок';
  $('#promoScreen').classList.remove('hidden');
}
async function claimPromo() {
  const name = store.get('promo', '');
  store.del('promo');
  $('#promoScreen').classList.add('hidden');
  try {
    const res = await api(`/api/promo/${name}`, { method: 'POST', body: {} });
    rememberUsers([res.user]);
    S.me = { ...S.me, ...res.user };
    renderMe();
    toast(`Подарок получен: Ethic+ активен до ${fmtDate(res.until)}`);
  } catch (err) { toast(err.message); }
}

async function enterApp(user) {
  S.me = user;
  Maint.render();
  offerPromo();
  Sponsor.offer();
  rememberUsers([user]);
  api('/api/warnings').then((r) => queueWarnings(r.warnings)).catch(() => {});
  $('#auth').classList.add('hidden');
  $('#app').classList.remove('hidden');
  renderMe();
  await loadChats();
  connectWs();
  if (S.me.support) api('/api/tickets/count').then((r) => Tickets.setCount(r.open)).catch(() => {});
  if (S.me.dev) api('/api/admin/stats').then((r) => setReports(r.reports)).catch(() => {});
  applyMute();
  applyTheme();
  api('/api/chats/saved', { method: 'POST' }).then((r) => { upsertChat(r.chat); renderSide(); }).catch(() => {});
  S.folder = store.get('folder', 'all');
  if (/^\d+$/.test(S.folder)) S.folder = Number(S.folder);
  api('/api/folders').then((r) => { S.folders = r.folders; renderSide(); }).catch(() => {});
  const code = joinCodeOf(location.href);
  if (code) { history.replaceState(null, '', '/'); Join.ask(code); }
  const hash = Number(location.hash.slice(1));
  if (hash && S.chats.has(hash)) openChat(hash);
  else renderNav();
}

function renderMe() {
  $('#meAvatar').innerHTML = avatarOf(S.me, '', true);
  $('#meName').innerHTML = `${nameHtml(S.me, S.me.displayName)}${checkOf(S.me)}`;
  $('#meTag').textContent = `@${S.me.username}`;
  $('#adminItem').classList.toggle('hidden', !S.me.dev);
  $('#ticketsItem').classList.toggle('hidden', !S.me.support);
  $('#plusTab').classList.remove('hidden'); // everyone sees what Ethic+ gives and where to buy it
  Shop.checkOffer();
}

// ---------- navigation: rail + side ----------
async function loadChats() {
  const { chats } = await api('/api/chats');
  S.chats.clear();
  for (const c of chats) { S.chats.set(c.id, c); rememberUsers(c.members); }
  renderNav();
  if (S.active && S.chats.has(S.active)) renderChatHeader();
}
const byRecent = (a, b) => (b.lastMessage?.createdAt ?? b.createdAt) - (a.lastMessage?.createdAt ?? a.createdAt);
const directs = () => [...S.chats.values()].filter((c) => c.type === 'direct').sort(byRecent);
const groups = () => [...S.chats.values()].filter((c) => isGroupish(c)).sort(byRecent);
const unreadOf = (c) => (c.id === S.active && document.visibilityState === 'visible' ? 0 : c.unread || 0);

function renderNav() {
  renderRail();
  renderSide();
  renderMembers();
  const total = [...S.chats.values()].reduce((n, c) => n + unreadOf(c), 0);
  document.title = total ? `(${total}) Ethic Messenger` : 'Ethic Messenger';
}

function renderRail() {
  const homeUnread = directs().reduce((n, c) => n + unreadOf(c), 0);
  $('[data-rail="home"]').classList.toggle('active', S.view === 'home');
  $('#homeBadge').textContent = homeUnread;
  $('#homeBadge').classList.toggle('hidden', !homeUnread);
  $('#railGroups').innerHTML = groups().map((c) => {
    const n = unreadOf(c);
    return `<div class="rail-item ${S.view === c.id ? 'active' : ''} ${n ? 'unread' : ''}" title="${esc(c.title)}">
      <span class="rail-pill"></span>
      <button class="rail-btn" data-group="${c.id}">${esc(c.title.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase())}</button>
      ${n ? `<span class="rail-badge">${n > 99 ? '99+' : n}</span>` : ''}
    </div>`;
  }).join('');
}
// Search in the navigation rail / bottom tab bar opens the same «Найти» window as Ctrl+K.
$('#railFindBtn').addEventListener('click', () => openFind());
$('#railGroups').addEventListener('click', (e) => {
  const b = e.target.closest('[data-group]');
  if (b) openChat(Number(b.dataset.group));
});
$('#homeBtn').addEventListener('click', () => {
  S.view = 'home';
  const target = S.lastDm && S.chats.has(S.lastDm) ? S.lastDm : null;
  if (target && !matchMedia('(max-width: 760px)').matches) openChat(target);
  else { closeChat(); renderNav(); }
});

// One list for everything: personal chats first, then groups.
// Time of the last message on the right of a row (presentation only).
const sideTime = (m) => (m?.createdAt ? (isToday(m.createdAt) ? hhmm(m.createdAt) : new Date(m.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '')) : '');
function sideItem(c) {
  const n = unreadOf(c);
  const draft = c.id !== S.active && store.get(`draft:${c.id}`, '');
  if (c.type === 'saved') {
    return `<button class="dm ${c.id === S.active ? 'active' : ''}" data-chat="${c.id}">
      <span class="avatar saved-av">${SAVED_ICON}</span>
      <span class="dm-names"><span class="dm-name"><span>Избранное</span></span><span class="dm-sub">${draft ? `<span class="draft">Черновик:</span> ${esc(draft)}` : esc(previewText(c.lastMessage) || 'Заметки и пересланное')}</span></span>
      <span class="dm-meta"><span class="dm-time">${sideTime(c.lastMessage)}</span></span>
    </button>`;
  }
  const typing = typingNames(c.id);
  const inCall = c.call?.participants?.length;
  if (isGroupish(c)) {
    const sub = typing.length ? `${typing[0]} печатает…` : inCall ? `🔊 В звонке: ${inCall}` : c.lastMessage
      ? `${c.lastMessage.userId === S.me.id ? 'Вы' : userName(c.lastMessage.userId)}: ${previewText(c.lastMessage)}` : `${c.members.length} участн.`;
    return `<button class="dm ${c.id === S.active ? 'active' : ''} ${n ? 'unread' : ''}" data-chat="${c.id}">
      ${groupAvatar(c)}
      <span class="dm-names"><span class="dm-name"><span>${c.type === 'channel' ? '📢 ' : ''}${esc(c.title)}</span></span><span class="dm-sub">${draft ? `<span class="draft">Черновик:</span> ${esc(draft)}` : esc(sub)}</span></span>
      <span class="dm-meta"><span class="dm-time">${sideTime(c.lastMessage)}</span>${n ? `<span class="dm-badge">${n}</span>` : ''}</span>
    </button>`;
  }
  const o = fresh(otherMember(c));
  const sub = c.request ? (c.request.from === S.me.id ? '⏳ Заявка отправлена' : '✉️ Хочет написать вам')
    : typing.length ? 'печатает…' : inCall ? '🔊 Идёт звонок' : previewText(c.lastMessage) || lastSeenText(o);
  return `<button class="dm ${c.id === S.active ? 'active' : ''} ${n ? 'unread' : ''}" data-chat="${c.id}">
    ${avatarOf(o, '', true)}
    <span class="dm-names"><span class="dm-name">${nameHtml(o, o?.displayName)}${checkOf(o)}</span><span class="dm-sub">${draft ? `<span class="draft">Черновик:</span> ${esc(draft)}` : esc(sub)}</span></span>
    <span class="dm-meta"><span class="dm-time">${sideTime(c.lastMessage)}</span>${n ? `<span class="dm-badge">${n}</span>` : ''}</span>
  </button>`;
}
function renderSide() {
  $('#sideHead').innerHTML = `
    <div class="side-brand">
      <span class="logo"><img src="/ethic-symbol.webp" alt=""><span class="logo-text">Ethic Messenger</span></span>
      <span class="row">
        ${S.me?.support ? `<button class="icon-btn has-badge" data-act="tickets" title="Обращения в поддержку">${I.support}<span class="hd-badge${Tickets.count ? '' : ' hidden'}" id="ticketsHeadBadge">${Tickets.count > 99 ? '99+' : Tickets.count}</span></button>` : ''}
        ${S.me?.dev ? `<button class="icon-btn has-badge" data-act="admin" title="Админ-панель">${I.shield}<span class="hd-badge${S.reports ? '' : ' hidden'}" id="reportsHeadBadge">${S.reports > 99 ? '99+' : S.reports || ''}</span></button>` : ''}
        <button class="icon-btn" data-act="group" title="Создать">${I.plus}</button>
      </span>
    </div>
    <button class="find-btn" id="findBtn">Найти человека или беседу · Ctrl+K</button>`;
  const inFolder = (c) => {
    if (S.folder === 'direct') return c.type === 'direct';
    if (S.folder === 'groups') return isGroupish(c);
    const f = (S.folders || []).find((x) => x.id === S.folder);
    return !f || f.chatIds.includes(c.id);
  };
  const dms = directs().filter(inFolder), grs = groups().filter(inFolder);
  const tabs = [['all', 'Все'], ['direct', 'Личные'], ['groups', 'Группы'], ...(S.folders || []).map((f) => [f.id, f.name])];
  const saved = !S.folder || S.folder === 'all' ? [...S.chats.values()].filter((c) => c.type === 'saved') : [];
  $('#sideBody').innerHTML = `<div class="folder-tabs">${tabs.map(([id, name]) => `<button class="folder-tab ${String(S.folder || 'all') === String(id) ? 'active' : ''}" data-folder="${id}">${esc(name)}</button>`).join('')}<button class="folder-tab" data-folder-edit title="Настроить папки">⋯</button></div>`
    + saved.map(sideItem).join('') + ((dms.length || grs.length)
    ? (dms.length ? `<div class="side-section"><span>Личные</span></div>${dms.map(sideItem).join('')}` : '')
      + (grs.length ? `<div class="side-section"><span>Группы и каналы</span></div>${grs.map(sideItem).join('')}` : '')
    : `<div class="side-empty">${S.folder && S.folder !== 'all' ? 'В этой папке пока пусто.' : 'Пока нет бесед.<br>Найдите друга через поиск выше.'}</div>`);
}
$('#sideHead').addEventListener('click', (e) => {
  if (e.target.closest('#findBtn')) openFind();
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'group') createTypes();
  if (act === 'admin') $('#adminBtn').click();
  if (act === 'tickets') Tickets.open(true);
});
$('#sideBody').addEventListener('click', (e) => {
  const chatBtn = e.target.closest('[data-chat]');
  if (chatBtn) openChat(Number(chatBtn.dataset.chat));
  const tab = e.target.closest('[data-folder]');
  if (tab) { S.folder = /^\d+$/.test(tab.dataset.folder) ? Number(tab.dataset.folder) : tab.dataset.folder; store.set('folder', String(S.folder)); renderSide(); }
  if (e.target.closest('[data-folder-edit]')) Folders.open();
});
$('#emptyFindBtn').addEventListener('click', () => openFind());

function renderMembers() {
  const chat = S.chats.get(S.active);
  const box = $('#memberList');
  const show = isGroupish(chat) && S.showMembers;
  box.classList.toggle('hidden', !show);
  $('#membersBtn').classList.toggle('hidden', !isGroupish(chat));
  $('#membersBtn').classList.toggle('active', !!show);
  if (!show) return;
  const members = chat.members.map(fresh);
  const on = members.filter((m) => m.online), off = members.filter((m) => !m.online);
  const row = (m) => `<button class="member ${m.online ? '' : 'offline'}" data-profile="${m.id}">${avatarOf(m, '', true)}
    <span class="name" style="color:${nameColor(m)}">${nameHtml(m, m.displayName)}${checkOf(m)}${badgeOf(m)}</span></button>`;
  box.innerHTML = (on.length ? `<div class="side-section">В сети — ${on.length}</div>${on.map(row).join('')}` : '')
    + (off.length ? `<div class="side-section">Не в сети — ${off.length}</div>${off.map(row).join('')}` : '');
}
$('#memberList').addEventListener('click', (e) => { const p = e.target.closest('[data-profile]'); if (p) showUser(Number(p.dataset.profile)); });
$('#membersBtn').addEventListener('click', () => { S.showMembers = !S.showMembers; store.set('members', S.showMembers ? '1' : '0'); renderMembers(); });

// ---------- find / quick switcher ----------
let findSel = 0, findItems = [];
function openFind() {
  $('#findInput').value = '';
  $('#findModal').classList.remove('hidden');
  $('#findInput').focus();
  renderFind('').catch(() => {});
}
let findTimer;
async function renderFind(term) {
  let users = [];
  if (term) {
    ({ users } = await api(`/api/users?q=${encodeURIComponent(term)}`));
    rememberUsers(users);
  }
  findItems = users.map((user) => ({ user }));
  findSel = 0;
  $('#findResults').innerHTML = findItems.map(({ user }, i) => `<button class="find-item ${i === 0 ? 'sel' : ''}" data-i="${i}">${avatarOf(user, 'sm', true)}${nameHtml(user, user.displayName)}${checkOf(user)}<span class="muted">@${esc(user.username)}</span>
      <span class="find-action">${directWith(user.id) ? 'Открыть чат' : 'Отправить заявку'}</span></button>`).join('')
    || (term ? '<div class="side-empty">Нет пользователя с таким username</div>' : '');
}
const directWith = (id) => directs().find((c) => otherMember(c)?.id === id);
async function pickFind(i) {
  const it = findItems[i];
  if (!it) return;
  $('#findModal').classList.add('hidden');
  try {
    const isNew = !directWith(it.user.id);
    await openDirect(it.user.id);
    if (isNew) toast(`Заявка отправлена: @${it.user.username}`);
  } catch (err) { toast(err.message); }
}
$('#findInput').addEventListener('input', (e) => { clearTimeout(findTimer); findTimer = setTimeout(() => renderFind(e.target.value.trim()).catch(() => {}), 180); });
$('#findInput').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    findSel = Math.max(0, Math.min(findItems.length - 1, findSel + (e.key === 'ArrowDown' ? 1 : -1)));
    $$('#findResults .find-item').forEach((el, i) => el.classList.toggle('sel', i === findSel));
  } else if (e.key === 'Enter') { e.preventDefault(); pickFind(findSel); }
});
$('#findResults').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) pickFind(Number(b.dataset.i)); });

async function openDirect(userId) {
  const { chat } = await api('/api/chats/direct', { method: 'POST', body: { userId } });
  upsertChat(chat);
  openChat(chat.id);
}

function upsertChat(chat) {
  S.chats.set(chat.id, chat);
  rememberUsers(chat.members);
  renderNav();
  if (chat.id === S.active) renderChatHeader();
}

// ---------- open chat ----------
async function openChat(id) {
  const chat = S.chats.get(id);
  if (!chat) return;
  if (S.active !== id) {
    // Each chat keeps its own unsent text.
    if (S.active && !S.editing) store.set(`draft:${S.active}`, input.value);
    input.value = store.get(`draft:${id}`, '');
    autosize(); updateComposerButtons();
  }
  if (S.active !== id) { clearAttach(); clearReply(); cancelEdit(); }
  S.active = id;
  S.view = isGroupish(chat) ? id : 'home';
  if (chat.type === 'direct') S.lastDm = id;
  history.replaceState(null, '', `#${id}`);
  $('#app').classList.add('chat-open');
  $('#emptyState').classList.add('hidden');
  $('#chatView').classList.remove('hidden');
  input.placeholder = chat.type === 'saved' ? 'Заметка для себя' : isGroupish(chat) ? `Сообщение в «${chat.title}»` : `Сообщение для ${fresh(otherMember(chat))?.displayName || ''}`;
  $('#audioCallBtn').classList.toggle('hidden', chat.type === 'saved');
  $('#videoCallBtn').classList.toggle('hidden', chat.type === 'saved');
  renderChatHeader();
  renderNav();
  renderTyping();
  const box = $('#messages');
  if (!S.messages.has(id)) {
    box.innerHTML = '';
    try {
      const data = await api(`/api/chats/${id}/messages`);
      S.messages.set(id, { list: data.messages, hasMore: data.hasMore });
    } catch (err) { toast(err.message); return; }
  }
  if (S.active !== id) return;
  renderMessages(true);
  markRead();
  if (!isTouch) input.focus();
}
function closeChat() {
  S.active = null;
  clearAttach(); clearReply(); cancelEdit();
  history.replaceState(null, '', location.pathname);
  $('#app').classList.remove('chat-open');
  $('#chatView').classList.add('hidden');
  $('#emptyState').classList.remove('hidden');
}
$('#backBtn').addEventListener('click', () => { closeChat(); renderNav(); });

function markRead() {
  const chat = S.chats.get(S.active);
  const list = S.messages.get(S.active)?.list;
  if (!chat || !list?.length || document.visibilityState !== 'visible') return;
  const last = [...list].reverse().find((m) => !m.pending);
  if (!last) return;
  if (chat.unread) { chat.unread = 0; renderNav(); }
  wsSend({ type: 'read', chatId: chat.id, messageId: last.id });
}

function renderRequestBar() {
  const chat = S.chats.get(S.active);
  const bar = $('#requestBar');
  const req = chat?.request;
  const readOnly = chat?.type === 'channel' && !isChatAdmin(chat);
  $('#composer').classList.toggle('hidden', !!req || readOnly);
  if (readOnly) { bar.classList.remove('hidden'); bar.innerHTML = '<div class="muted">Это канал: писать могут только администраторы. Читайте и ставьте реакции.</div>'; return; }
  if (!req) { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  const name = esc(chatName(chat));
  bar.innerHTML = req.from === S.me.id
    ? `<div><b>Заявка отправлена</b><div class="muted small">${name} увидит её и сможет принять. Писать и звонить можно после этого.</div></div>`
    : `<div><b>${name} хочет написать вам</b><div class="muted small">Примите заявку, чтобы переписываться и созваниваться.</div></div>
       <div class="row"><button class="btn" data-req="decline">Отклонить</button><button class="btn primary" data-req="accept">Принять</button></div>`;
}

function renderChatHeader() {
  const chat = S.chats.get(S.active);
  if (!chat) return;
  renderRequestBar();
  if (isGroupish(chat)) {
    const online = chat.members.filter((m) => fresh(m).online).length;
    $('#chatIcon').innerHTML = groupAvatar(chat);
    $('#chatTitle').innerHTML = `<span>${esc(chat.title)}</span>`;
    $('#chatStatus').textContent = `${chat.type === 'channel' ? 'Канал · ' : ''}${chat.members.length} участн. · ${online} в сети${chat.disappear ? ' · ⏱ исчезающие' : ''}`;
  } else if (chat.type === 'saved') {
    $('#chatIcon').innerHTML = `<span class="avatar saved-av">${SAVED_ICON}</span>`;
    $('#chatTitle').innerHTML = '<span>Избранное</span>';
    $('#chatStatus').textContent = 'Заметки и пересланные сообщения';
  } else {
    const o = fresh(otherMember(chat));
    $('#chatIcon').innerHTML = avatarOf(o, '', true);
    $('#chatTitle').innerHTML = `${nameHtml(o, o?.displayName)}${checkOf(o)}`;
    $('#chatStatus').textContent = lastSeenText(o) + (chat.disappear ? ' · ⏱ исчезающие' : '');
  }
  renderCallBanner();
  renderMembers();
}
// Keep "был(а) в сети N мин. назад" fresh.
setInterval(() => { if (S.active) renderChatHeader(); }, 60_000);

function renderCallBanner() {
  const chat = S.chats.get(S.active);
  const parts = chat?.call?.participants || [];
  const show = parts.length > 0 && !(call && call.chatId === chat.id);
  $('#callBanner').classList.toggle('hidden', !show);
  if (show) $('#callBannerText').textContent = `Идёт звонок · ${parts.map(userName).join(', ')}`;
}

// ---------- typing ----------
const typingTimers = new Map();
function typingNames(chatId) {
  const m = S.typing.get(chatId);
  if (!m) return [];
  const now = Date.now();
  return [...m.entries()].filter(([, until]) => until > now).map(([uid]) => userName(uid));
}
function renderTyping() {
  const names = S.active ? typingNames(S.active) : [];
  $('#typingLine').innerHTML = names.length
    ? `<span class="typing-dots"><i></i><i></i><i></i></span><span><b>${names.map(esc).join(', ')}</b> ${names.length > 1 ? 'печатают' : 'печатает'}…</span>`
    : '';
}
function setTyping(chatId, userId, on) {
  if (!S.typing.has(chatId)) S.typing.set(chatId, new Map());
  const m = S.typing.get(chatId);
  const had = m.has(userId);
  if (on) m.set(userId, Date.now() + 4000); else m.delete(userId);
  clearTimeout(typingTimers.get(`${chatId}:${userId}`));
  if (on) typingTimers.set(`${chatId}:${userId}`, setTimeout(() => setTyping(chatId, userId, false), 4100));
  if (chatId === S.active) renderTyping();
  if (had !== on) renderSide();
}

// ---------- messages ----------
const FRESH_MS = 260;
function barsFor(id) {
  // Stable pseudo-waveform per message.
  let x = (Number(String(id).replace(/\D/g, '')) || 7) * 9301 + 49297;
  return Array.from({ length: 48 }, () => { x = (x * 9301 + 49297) % 233280; return 25 + Math.round((x / 233280) * 75); });
}
function attachmentHtml(m) {
  if (m.image) {
    const { w, h } = m.image;
    const pw = w && h ? Math.round(Math.min(400, w, (350 * w) / h)) : 300;
    const style = `width:${pw}px${w && h ? `;aspect-ratio:${w}/${h}` : ''}`;
    // After 30 days the server no longer has the file: the browser shows its cached copy, otherwise a note.
    const gone = m.imageGone ? ` onerror="this.outerHTML='<div class=&quot;att att-gone&quot;>Фото удалено с сервера через 30 дней</div>'"` : '';
    return `<img class="att att-photo" src="${esc(m.localUrl || m.image.url)}" data-full="${esc(m.image.url)}" alt="Фото" style="${style}"${gone}>`;
  }
  const f = m.file;
  if (!f) return '';
  const url = m.localUrl || f.url;
  if (f.gone) return `<div class="att att-gone">${f.kind === 'circle' ? 'Видеокружок' : 'Видео'} удалено с сервера через 30 дней</div>`;
  if (f.kind === 'voice') {
    return `<div class="att voice" data-voice="${m.id}" data-src="${esc(url)}" data-dur="${f.duration || 0}">
      <button class="voice-play" title="Воспроизвести">${I.play}</button>
      <div class="voice-bars">${barsFor(m.id).map((h) => `<i style="height:${h}%"></i>`).join('')}</div>
      <span class="voice-time">${fmtDur(f.duration)}</span></div>`;
  }
  if (f.kind === 'circle') return `<div class="att"><video class="att-circle" src="${esc(url)}" playsinline loop preload="metadata" data-circle title="Нажмите, чтобы смотреть со звуком"></video></div>`;
  if (f.kind === 'video' && !m.pending) return `<video class="att att-video" src="${esc(url)}" controls preload="metadata"></video>`;
  const link = `<a class="file-name" href="${esc(f.url)}" download="${esc(f.name)}" target="_blank" rel="noopener">${esc(f.name)}</a>`;
  if (f.kind === 'audio' && !m.pending) {
    return `<div class="att att-audio">${link}<span class="file-size">${fmtSize(f.size || 0)}</span><audio controls preload="none" src="${esc(url)}"></audio></div>`;
  }
  return `<div class="att att-file">${I.file}<div class="file-meta">${m.pending ? `<span class="file-name">${esc(f.name)}</span>` : link}<span class="file-size">${fmtSize(f.size || 0)}</span></div>
    ${m.pending ? '' : `<a class="icon-btn" href="${esc(f.url)}" download="${esc(f.name)}" title="Скачать">${I.download}</a>`}</div>`;
}
function replyRefHtml(r) {
  if (!r) return '';
  if (r.deleted) return `<div class="reply-ref" data-jump="${r.id}"><i>Исходное сообщение было удалено</i></div>`;
  const u = { id: r.userId };
  const body = r.text ? esc(r.text) : `<i>${esc(replyKindText(r))}</i>`;
  return `<div class="reply-ref" data-jump="${r.id}">${avatarOf(u, 'xs')}<b style="color:${nameColor(u)}">${nameHtml(u, `@${userName(r.userId)}`)}</b><span>${body}</span></div>`;
}
function messageHtml(m, chat, start) {
  const mine = m.userId === S.me.id;
  const since = m.freshAt ? Date.now() - m.freshAt : Infinity;
  const cls = ['msg', mine && 'mine', start && 'start', start && m.replyTo && 'has-reply', m.pending && 'pending',
    since < FRESH_MS && 'fresh', S.replyTo?.id === m.id && 'replying', S.editing?.id === m.id && 'editing'].filter(Boolean).join(' ');
  const anim = since < FRESH_MS ? ` style="animation-delay:-${since}ms"` : '';
  const u = { id: m.userId };
  const head = start
    ? `${replyRefHtml(m.replyTo)}<div class="msg-avatar" data-profile="${m.userId}">${avatarOf(u)}</div>
       <div class="msg-head"><span class="msg-author" data-profile="${m.userId}" style="color:${nameColor(u)}">${nameHtml(u, userName(m.userId))}${checkOf(u)}${badgeOf(u)}</span><span class="msg-time">${fullTime(m.createdAt)}</span></div>`
    : `<span class="msg-side-time">${hhmm(m.createdAt)}</span>`;
  const fwd = m.forwardFrom ? `<div class="fwd">Переслано от <b>${esc(m.forwardFrom.name)}</b></div>` : '';
  const text = m.text ? `${fwd}<div class="msg-text">${linkify(m.text)}${m.editedAt ? '<span class="edited">(изменено)</span>' : ''}</div>` : fwd;
  const card = m.pending ? '' : previewHtml(m);
  const said = m.transcript ? `<div class="transcript">«${esc(m.transcript)}»</div>` : '';
  const reacts = (m.reactions || []).length ? `<div class="reacts">${m.reactions.map((r) => `<button class="react ${r.users.includes(S.me.id) ? 'on' : ''}" data-react="${r.emoji}" title="${esc(r.users.map(userName).join(', '))}">${r.emoji} ${r.users.length}</button>`).join('')}</div>` : '';
  const progress = m.pending && m.progress != null ? `<div class="upload-progress"><div style="width:${Math.round(m.progress * 100)}%"></div></div>` : '';
  let ticks = '';
  if (mine) {
    const read = !m.pending && m.id <= (chat.othersRead || 0);
    ticks = `<span class="ticks ${read ? 'read' : ''}" title="${m.pending ? 'Отправляется' : read ? 'Прочитано' : 'Отправлено'}">${m.pending ? I.clock : read ? I.checks : I.check}</span>`;
  }
  // Everything else is behind one «⋯» button.
  const tools = m.pending ? '' : `<div class="msg-tools">
      <button data-act="reply" title="Ответить">${I.reply}</button>
      <button data-act="more" title="Ещё">${I.dots}</button>
    </div>`;
  const mentioned = !mine && m.text && new RegExp(`@(${S.me.username.replace(/[.]/g, '\\.')}|all)\\b`, 'i').test(m.text);
  return `<div class="${cls}${mentioned ? ' mentioned' : ''}${m.sticker ? ' sticker' : ''}" data-id="${m.id}"${anim}>${head}${text}${card}${attachmentHtml(m)}${said}${reacts}${progress}${ticks}${tools}</div>`;
}

function renderMessages(scrollToEnd, keepFrom) {
  const box = $('#messages');
  const state = S.messages.get(S.active);
  const chat = S.chats.get(S.active);
  if (!state || !chat) return;
  const html = [];
  if (state.hasMore) html.push('<button class="btn small load-more" id="loadMore">Показать ранее</button>');
  else {
    const o = chat.type === 'direct' ? fresh(otherMember(chat)) : null;
    html.push(o
      ? `<div class="messages-top">${avatarOf(o, 'lg')}<h3>${nameHtml(o, o.displayName)}${checkOf(o)}</h3><p>Это начало истории ваших личных сообщений с <b>@${esc(o.username)}</b>.</p></div>`
      : chat.type === 'saved' ? `<div class="messages-top"><span class="avatar saved-av lg">${SAVED_ICON}</span><h3>Избранное</h3><p>Ваши заметки. Сюда же можно пересылать сообщения из любых чатов.</p></div>`
      : `<div class="messages-top">${groupAvatar(chat, 'lg')}<h3>${esc(chat.title)}</h3><p>${chat.type === 'channel' ? 'Начало канала. Подписчиков' : 'Начало истории группы. Участников'}: ${chat.members.length}.</p></div>`);
  }
  let prev = null;
  for (const m of state.list) {
    const newDay = !prev || dayKey(m.createdAt) !== dayKey(prev.createdAt);
    if (newDay) html.push(`<div class="day"><span>${dayLabel(m.createdAt)}</span></div>`);
    const start = newDay || m.userId !== prev.userId || m.createdAt - prev.createdAt > 7 * 60_000 || !!m.replyTo;
    html.push(messageHtml(m, chat, start));
    prev = m;
  }
  const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 200;
  const oldHeight = box.scrollHeight;
  box.innerHTML = html.join('');
  const toEnd = () => { box.scrollTop = box.scrollHeight; };
  if (keepFrom != null) box.scrollTop = box.scrollHeight - oldHeight + keepFrom;
  else if (scrollToEnd || nearBottom) {
    toEnd();
    box.querySelectorAll('img').forEach((img) => { if (!img.complete) img.addEventListener('load', toEnd, { once: true }); });
  }
  Voice.paint();
}

function findMessage(id) {
  return S.messages.get(S.active)?.list.find((m) => String(m.id) === String(id));
}
function jumpTo(id) {
  const el = $(`#messages .msg[data-id="${id}"]`);
  if (!el) return toast('Это сообщение выше в истории — нажмите «Показать ранее»');
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  el.classList.remove('highlight');
  void el.offsetWidth;
  el.classList.add('highlight');
}

$('#messages').addEventListener('click', async (e) => {
  const t = e.target;
  const photo = t.closest('img.att-photo');
  if (photo) return openLightbox(photo.dataset.full, photo.currentSrc || photo.src);
  const vp = t.closest('.voice-play');
  if (vp) return Voice.toggle(vp.closest('[data-voice]'));
  const bars = t.closest('.voice-bars');
  if (bars) { const r = bars.getBoundingClientRect(); return Voice.seek(bars.closest('[data-voice]'), (e.clientX - r.left) / r.width); }
  const jump = t.closest('[data-jump]');
  if (jump) return jumpTo(jump.dataset.jump);
  const prof = t.closest('[data-profile]');
  if (prof) return showUser(Number(prof.dataset.profile));
  const cv = t.closest('video[data-circle]');
  if (cv) { if (cv.paused) { cv.muted = false; cv.play().catch(() => {}); } else cv.pause(); return; }
  const react = t.closest('[data-react]');
  if (react) return wsSend({ type: 'react', chatId: S.active, messageId: Number(react.closest('.msg').dataset.id), emoji: react.dataset.react });
  const link = t.closest('a[href]');
  const code = link && joinCodeOf(link.href);
  if (code) { e.preventDefault(); return Join.ask(code); }
  const act = t.closest('.msg-tools [data-act]');
  if (act?.dataset.act === 'more') {
    const r = act.getBoundingClientRect();
    return msgMenu(findMessage(act.closest('.msg').dataset.id), r.left - 160, r.bottom + 4, act.closest('.msg'));
  }
  if (act) return msgAction(act.dataset.act, findMessage(act.closest('.msg').dataset.id), e);
  if (t.id === 'loadMore') {
    const id = S.active;
    const state = S.messages.get(id);
    const before = state.list.find((m) => !m.pending)?.id;
    t.disabled = true;
    const data = await api(`/api/chats/${id}/messages?before=${before}`);
    state.list = [...data.messages, ...state.list];
    state.hasMore = data.hasMore;
    if (S.active === id) renderMessages(false, $('#messages').scrollTop);
    return;
  }
  // Touch: tap a message to reveal its tools.
  if (isTouch) {
    const msg = t.closest('.msg');
    $$('#messages .msg.touch-tools').forEach((el) => el !== msg && el.classList.remove('touch-tools'));
    msg?.classList.toggle('touch-tools');
  }
});
$('#messages').addEventListener('dblclick', (e) => {
  const msg = e.target.closest('.msg');
  if (!msg || e.target.closest('a, button, video, audio, img')) return;
  const m = findMessage(msg.dataset.id);
  if (m && !m.pending) startReply(m);
});
$('#messages').addEventListener('contextmenu', (e) => {
  const el = e.target.closest('.msg');
  if (!el || e.target.closest('a, video, audio')) return;
  const m = findMessage(el.dataset.id);
  if (!m || m.pending) return;
  e.preventDefault();
  msgMenu(m, e.clientX, e.clientY, el);
});
function msgMenu(m, x, y, el) {
  if (!m || m.pending) return;
  const mine = m.userId === S.me.id;
  const items = [
    ['reply', 'Ответить', I.reply],
    ['react', 'Реакция…'],
    ['forward', 'Переслать…'],
    mine && m.file?.kind !== 'voice' && ['edit', 'Изменить сообщение', I.edit],
    m.text && ['copy', 'Копировать текст', I.copy],
    S.stt && ['voice', 'circle'].includes(m.file?.kind) && !m.transcript && ['transcribe', 'Расшифровать в текст'],
    S.me.plus && m.image && ['sticker', 'Добавить в стикеры'],
    (mine || S.me.dev) && ['delete', 'Удалить сообщение', I.trash, true],
    !mine && ['report', 'Пожаловаться', '', true],
  ].filter(Boolean);
  el?.classList.add('menu-open');
  showMenu(x, y, items, (act) => (act === 'react' ? reactPanel(m, x, y) : msgAction(act, m)), () => el?.classList.remove('menu-open'));
}
const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👎', '🎉'];
function reactPanel(m, x, y) {
  setTimeout(() => {
    showMenu(x, y, REACTIONS.map((r) => [r, r]), (r) => wsSend({ type: 'react', chatId: m.chatId, messageId: m.id, emoji: r }), () => $('#ctxMenu').classList.remove('emoji-grid'));
    $('#ctxMenu').classList.add('emoji-grid');
  });
}
async function forwardMessage(m) {
  const targets = [...S.chats.values()].filter((c) => !c.request && (c.type !== 'channel' || isChatAdmin(c))).sort(byRecent);
  const r = await ask({ title: 'Переслать сообщение', ok: 'Переслать', fields: [{ name: 'to', label: 'Куда', value: String(targets[0]?.id || ''), options: targets.map((c) => [String(c.id), chatName(c)]) }] });
  if (!r?.to) return;
  wsSend({ type: 'forward', chatId: Number(r.to), messageId: m.id, clientId: `f${Date.now()}` });
  toast('Переслано');
}

function msgAction(act, m, ev) {
  if (!m) return;
  if (act === 'reply') startReply(m);
  if (act === 'edit') startEdit(m);
  if (act === 'copy') navigator.clipboard?.writeText(m.text).then(() => toast('Скопировано')).catch(() => {});
  if (act === 'report') reportMessage(m);
  if (act === 'forward') forwardMessage(m);
  if (act === 'sticker') api('/api/stickers', { method: 'POST', body: { url: m.image.url } }).then(() => toast('Добавлено в стикеры')).catch((err) => toast(err.message));
  if (act === 'transcribe') {
    toast('Расшифровываем…');
    api(`/api/messages/${m.id}/transcript`, { method: 'POST' }).then((r) => { m.transcript = r.text || '(тишина)'; if (m.chatId === S.active) renderMessages(false); }).catch((err) => toast(err.message));
  }
  if (act === 'delete') {
    if (!ev?.shiftKey && !confirm('Удалить это сообщение? Его нельзя будет восстановить.')) return;
    wsSend({ type: 'delete', chatId: m.chatId, messageId: m.id });
  }
}

// ---------- context menu ----------
let menuClose = null;
function showMenu(x, y, items, onPick, onClose) {
  const menu = $('#ctxMenu');
  hideMenu();
  menu.innerHTML = items.map(([id, label, icon, danger]) => (id === '-' ? '<hr>' : `<button data-m="${id}" class="${danger ? 'danger' : ''}"><span>${label}</span>${icon || ''}</button>`)).join('');
  menu.classList.remove('hidden');
  const r = menu.getBoundingClientRect();
  menu.style.left = `${Math.max(8, Math.min(x, innerWidth - r.width - 8))}px`;
  menu.style.top = `${Math.max(8, Math.min(y, innerHeight - r.height - 8))}px`;
  menu.onclick = (e) => { const b = e.target.closest('[data-m]'); if (b) { hideMenu(); onPick(b.dataset.m); } };
  menuClose = onClose;
}
function hideMenu() {
  $('#ctxMenu').classList.add('hidden');
  menuClose?.();
  menuClose = null;
}
document.addEventListener('click', (e) => { if (!e.target.closest('#ctxMenu, #chatMenuBtn, #groupHeadBtn, #attachBtn, [data-more], [data-rep-more], [data-member-more], .msg-tools [data-act="more"], .profile-actions [data-act="more"]')) hideMenu(); });
window.addEventListener('blur', hideMenu);

function groupMenu(x, y) {
  const chat = S.chats.get(S.view);
  if (!chat) return;
  showMenu(x, y, [['add', 'Добавить участника', I.plus], ['info', 'Участники', I.members], ['-'], ['leave', 'Покинуть группу', I.leave, true]], (a) => {
    if (a === 'add') { if (S.active !== chat.id) openChat(chat.id); openGroupModal('add'); }
    if (a === 'info') showGroup(chat);
    if (a === 'leave') leaveChat(chat);
  });
}
$('#chatMenuBtn').addEventListener('click', (e) => {
  const chat = S.chats.get(S.active);
  if (!chat) return;
  const r = e.currentTarget.getBoundingClientRect();
  const admin = isChatAdmin(chat);
  const items = isGroupish(chat)
    ? [(chat.type === 'group' || admin) && ['add', 'Добавить участника', I.plus], ['info', 'Участники', I.members], ['search', 'Поиск по сообщениям'],
      chat.type === 'group' && ['room', 'Голосовая комната'], ['sounds', 'Звуки чата…'],
      admin && ['settings', chat.type === 'channel' ? 'Настройки канала…' : 'Настройки группы…'], ['-'], ['leave', chat.type === 'channel' ? 'Покинуть канал' : 'Покинуть группу', I.leave, true]].filter(Boolean)
    : chat.type === 'saved' ? [['search', 'Поиск по сообщениям'], ['scheduled', 'Отложенные сообщения']]
    : [['info', 'Профиль', I.user], ['search', 'Поиск по сообщениям'], ['scheduled', 'Отложенные сообщения'], ['timer', 'Исчезающие сообщения…'], ['sounds', 'Звуки чата…'], ['-'], ['leave', 'Закрыть беседу', I.leave, true]];
  if (isGroupish(chat) && (chat.type === 'group' || admin)) items.splice(3, 0, ['scheduled', 'Отложенные сообщения']);
  showMenu(r.right - 200, r.bottom + 4, items, (a) => {
    if (a === 'add') openGroupModal('add');
    if (a === 'info') { if (isGroupish(chat)) showGroup(chat); else showUser(otherMember(chat).id); }
    if (a === 'search') Search.open(chat.id);
    if (a === 'settings') GroupSettings.open(chat);
    if (a === 'timer') GroupSettings.timer(chat);
    if (a === 'room') startCall(chat.id, false, null, { room: true });
    if (a === 'sounds') chatSounds(chat);
    if (a === 'scheduled') Scheduled.list(chat.id);
    if (a === 'leave') leaveChat(chat);
  });
});
async function leaveChat(chat) {
  if (!confirm(`${isGroupish(chat) ? 'Покинуть группу' : 'Закрыть беседу с'} «${chatName(chat)}»? История пропадёт из вашего списка.`)) return;
  try {
    await api(`/api/chats/${chat.id}/members/me`, { method: 'DELETE' });
    S.chats.delete(chat.id);
    S.messages.delete(chat.id);
    S.view = 'home';
    closeChat();
    renderNav();
  } catch (err) { toast(err.message); }
}

// ---------- reply / edit ----------
function startReply(m) {
  cancelEdit();
  S.replyTo = m;
  $('#replyBar').classList.remove('hidden', 'editing');
  $('#replyText').innerHTML = `Ответ для <b>${esc(userName(m.userId))}</b>`;
  renderMessages(false);
  input.focus();
}
function clearReply() {
  if (!S.replyTo) return;
  S.replyTo = null;
  $('#replyBar').classList.add('hidden');
  if (S.active) renderMessages(false);
}
function startEdit(m) {
  clearReply();
  clearAttach();
  S.editing = m;
  input.value = m.text;
  autosize();
  $('#replyBar').classList.remove('hidden');
  $('#replyBar').classList.add('editing');
  $('#replyText').innerHTML = 'Редактирование сообщения · <b>Esc</b> — отмена, <b>Enter</b> — сохранить';
  renderMessages(false);
  updateComposerButtons();
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}
function cancelEdit() {
  if (!S.editing) return;
  S.editing = null;
  input.value = '';
  autosize();
  $('#replyBar').classList.add('hidden');
  $('#replyBar').classList.remove('editing');
  if (S.active) renderMessages(false);
  updateComposerButtons();
}
$('#replyCancel').addEventListener('click', () => { if (S.editing) cancelEdit(); else clearReply(); });

function openLightbox(full, shown) {
  $('#lightboxImg').src = shown || full;
  $('#lightboxOpen').href = full;
  $('#lightbox').classList.remove('hidden');
}
$('#lightbox').addEventListener('click', (e) => { if (e.target.id !== 'lightboxOpen') $('#lightbox').classList.add('hidden'); });

// ---------- voice playback ----------
const Voice = {
  audio: null, id: null, dur: 0,
  toggle(el) {
    if (!el) return;
    const id = el.dataset.voice;
    if (this.id === id && this.audio) {
      if (this.audio.paused) this.audio.play().catch(() => {}); else this.audio.pause();
      return;
    }
    this.stop();
    const a = new Audio(el.dataset.src);
    const spk = store.get('speaker', '');
    if (spk && a.setSinkId) a.setSinkId(spk === 'default' ? '' : spk).catch(() => {});
    this.audio = a;
    this.id = id;
    this.dur = Number(el.dataset.dur) || 0;
    a.onplay = a.onpause = a.onseeked = () => { this.paint(); this.animate(); };
    a.onended = () => this.stop();
    a.play().catch(() => { toast('Не удалось воспроизвести'); this.stop(); });
  },
  seek(el, frac) {
    if (!el) return;
    if (this.id !== el.dataset.voice) this.toggle(el);
    const a = this.audio;
    if (!a) return;
    const set = () => { a.currentTime = Math.max(0, Math.min(1, frac)) * (this.dur || a.duration || 0); this.paint(); };
    if (a.readyState >= 1) set(); else a.addEventListener('loadedmetadata', set, { once: true });
  },
  stop() {
    this.audio?.pause();
    this.audio = null;
    this.id = null;
    this.paint();
  },
  paint() {
    for (const el of $$('[data-voice]')) {
      const active = el.dataset.voice === this.id && this.audio;
      const playing = active && !this.audio.paused;
      el.querySelector('.voice-play').innerHTML = playing ? I.pause : I.play;
      this.fill(el, active);
    }
  },
  // Each bar fills partially (--p from 0 to 1), so progress moves smoothly instead of bar by bar.
  fill(el, active) {
    const dur = Number(el.dataset.dur) || (active && Number.isFinite(this.audio.duration) ? this.audio.duration : 0);
    const t = active ? this.now() : 0;
    const frac = dur ? Math.min(1, t / dur) : 0;
    const bars = el.querySelectorAll('.voice-bars i');
    const pos = frac * bars.length;
    bars.forEach((b, i) => b.style.setProperty('--p', Math.max(0, Math.min(1, pos - i)).toFixed(3)));
    el.querySelector('.voice-time').textContent = fmtDur(active && t > 0 ? t : dur);
  },
  // Browsers advance currentTime in coarse steps; between them the position is extrapolated from the clock.
  now() {
    const a = this.audio;
    if (!a) return 0;
    const ct = a.currentTime;
    if (a.paused || ct !== this.lastCt) { this.lastCt = ct; this.lastAt = performance.now(); return ct; }
    return ct + ((performance.now() - this.lastAt) / 1000) * a.playbackRate;
  },
  // Repaint every frame while playing (timeupdate fires only ~4 times a second).
  animate() {
    cancelAnimationFrame(this.raf);
    const step = () => {
      if (!this.audio || this.audio.paused) return;
      const el = $(`[data-voice="${this.id}"]`);
      if (el) this.fill(el, true);
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  },
};

// ---------- attachments ----------
const loadImage = (url) => new Promise((ok, fail) => { const img = new Image(); img.onload = () => ok(img); img.onerror = fail; img.src = url; });
const canvasBlob = (canvas, type, q) => new Promise((ok) => canvas.toBlob(ok, type, q));
async function encodeCanvas(canvas) {
  let blob = await canvasBlob(canvas, 'image/webp', 0.86);
  if (!blob || blob.type !== 'image/webp') blob = await canvasBlob(canvas, 'image/jpeg', 0.88);
  return blob;
}
const IMG_EXT = /\.(jpe?g|png|gif|webp|bmp|avif|heic|heif)$/i;
// Some Android pickers hand over files with an empty MIME type.
const isImageFile = (f) => f.type.startsWith('image/') || (!f.type && IMG_EXT.test(f.name));
const HEIC_MSG = 'Формат HEIC (фото с iPhone) браузер не открывает. Сохраните фото как JPG или отправьте файлом.';
async function decodeImage(file) {
  const heic = /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    return { src: bmp, w: bmp.width, h: bmp.height };
  } catch {}
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    return { src: img, w: img.naturalWidth, h: img.naturalHeight };
  } catch {
    throw new Error(heic ? HEIC_MSG : 'Не удалось открыть изображение. Попробуйте JPG или PNG.');
  } finally {
    URL.revokeObjectURL(url);
  }
}
// Shrinks big photos before upload; GIFs go as-is to keep animation.
async function prepareImage(file) {
  const { src, w, h } = await decodeImage(file);
  const MAX = 2560;
  if (file.type === 'image/gif' || (Math.max(w, h) <= MAX && file.size <= 1.5 * 1024 * 1024 && /jpeg|png|webp/.test(file.type))) {
    if (file.size > uploadLimits().photo) throw new Error(`Изображение больше ${fmtGb(uploadLimits().photo)}`);
    return { blob: file, w, h, url: URL.createObjectURL(file) };
  }
  const scale = Math.min(1, MAX / Math.max(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  canvas.getContext('2d').drawImage(src, 0, 0, canvas.width, canvas.height);
  const blob = await encodeCanvas(canvas);
  if (!blob) throw new Error('Не удалось обработать изображение');
  return { blob, w: canvas.width, h: canvas.height, url: URL.createObjectURL(blob) };
}

// Photos, videos and files: 1 GB; Ethic+ doubles it. Big photos are made smaller by the server.
const GB = 1024 ** 3;
const uploadLimits = () => (S.me?.plus ? { photo: 2 * GB, video: 2 * GB } : { photo: GB, video: GB });
const fmtGb = (b) => `${Math.round(b / GB)} ГБ`;
const isVideoFile = (f) => /^video\//.test(f.type) || /\.(mp4|webm|mov|mkv|avi|m4v|3gp)$/i.test(f.name || '');
async function setAttach(file) {
  if (!S.active || !file) return;
  cancelEdit();
  try {
    clearAttach();
    const cap = isVideoFile(file) ? uploadLimits().video : uploadLimits().photo;
    if (file.size > cap) throw new Error(`${isVideoFile(file) ? 'Видео' : 'Файл'} больше ${fmtGb(cap)}${S.me?.plus ? '' : ' (с Ethic+ — вдвое больше)'}`);
    if (isImageFile(file) && !/heic|heif/i.test(file.type + file.name)) {
      const img = await prepareImage(file);
      S.attach = { mode: 'image', ...img, name: file.name || 'фото', size: img.blob.size };
      $('#attachThumb').innerHTML = `<img src="${img.url}" alt="">`;
      $('#attachInfo').textContent = `${img.w}×${img.h} · ${fmtSize(img.blob.size)}`;
    } else {
      S.attach = { mode: 'file', blob: file, name: file.name || 'файл', size: file.size, mime: file.type, url: URL.createObjectURL(file) };
      $('#attachThumb').innerHTML = I.file;
      $('#attachInfo').textContent = fmtSize(file.size);
    }
    $('#attachName').textContent = S.attach.name;
    $('#attachPreview').classList.remove('hidden');
    updateComposerButtons();
    input.focus();
  } catch (err) { toast(err.message); }
}
function clearAttach(revoke = true) {
  if (S.attach && revoke) URL.revokeObjectURL(S.attach.url);
  S.attach = null;
  $('#attachPreview').classList.add('hidden');
  $('#fileInput').value = '';
  updateComposerButtons();
}
$('#attachBtn').addEventListener('click', (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  const items = [['file', 'Фото или файл'], ['circle', 'Видеокружок'], S.me?.plus && ['stickers', 'Стикеры']].filter(Boolean);
  showMenu(r.left, r.top - 40 * items.length, items, (a) => (a === 'file' ? $('#fileInput').click() : a === 'stickers' ? Stickers.open() : Circle.start()));
});
$('#fileInput').addEventListener('change', (e) => { const f = e.target.files[0]; if (f) setAttach(f); });
$('#attachCancel').addEventListener('click', () => clearAttach());
let dragDepth = 0;
const chatView = $('#chatView');
chatView.addEventListener('dragenter', (e) => { if ([...e.dataTransfer.types].includes('Files')) { dragDepth++; $('#dropOverlay').classList.remove('hidden'); } });
chatView.addEventListener('dragleave', () => { if (--dragDepth <= 0) { dragDepth = 0; $('#dropOverlay').classList.add('hidden'); } });
chatView.addEventListener('dragover', (e) => e.preventDefault());
chatView.addEventListener('drop', (e) => {
  e.preventDefault();
  dragDepth = 0;
  $('#dropOverlay').classList.add('hidden');
  const file = e.dataTransfer.files[0];
  if (file) setAttach(file);
});

// ---------- composer ----------
const input = $('#messageInput');
// Measured only while the field is on screen: a hidden field measures 0 and stays squashed.
const autosize = () => { if (!input.offsetParent) { input.style.height = ''; return; } input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, innerHeight * 0.5) + 'px'; };
function updateComposerButtons() {
  const hasContent = !!input.value.trim() || !!S.attach || !!S.editing;
  $('#sendBtn').classList.toggle('hidden', !hasContent);
  $('#voiceBtn').classList.toggle('hidden', hasContent);
}
let lastTyping = 0;
let draftTimer;
input.addEventListener('input', () => {
  autosize();
  updateComposerButtons();
  const draftChat = S.active;
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => { if (draftChat && !S.editing) { if (input.value.trim()) store.set(`draft:${draftChat}`, input.value); else store.del(`draft:${draftChat}`); } }, 400);
  if (Date.now() - lastTyping > 2500 && input.value.trim() && !S.editing) {
    lastTyping = Date.now();
    wsSend({ type: 'typing', chatId: S.active });
  }
});
input.addEventListener('paste', (e) => {
  const file = [...(e.clipboardData?.files || [])][0];
  if (file) { e.preventDefault(); setAttach(file); }
});
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && !isTouch) {
    e.preventDefault();
    $('#composer').requestSubmit();
  } else if (e.key === 'Escape') {
    if (S.editing) cancelEdit(); else if (S.replyTo) clearReply(); else if (S.attach) clearAttach();
  } else if (e.key === 'ArrowUp' && !input.value && !S.editing) {
    // Discord: ↑ in an empty box edits your last message.
    const mine = [...(S.messages.get(S.active)?.list || [])].reverse().find((m) => m.userId === S.me.id && !m.pending && m.file?.kind !== 'voice');
    if (mine) { e.preventDefault(); startEdit(mine); }
  }
});

// Right click (or a long press) on «Отправить» opens the one extra choice: send it later.
function sendLaterMenu(x, y) {
  if (S.editing || !input.value.trim()) return;
  showMenu(x, y - 50, [['later', 'Отправить позже…', I.clock]], () => Scheduled.ask());
}
$('#sendBtn').addEventListener('contextmenu', (e) => { e.preventDefault(); sendLaterMenu(e.clientX, e.clientY); });
{
  let pressTimer = null;
  $('#sendBtn').addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    pressTimer = setTimeout(() => { pressTimer = 'fired'; sendLaterMenu(t.clientX, t.clientY); }, 500);
  }, { passive: true });
  $('#sendBtn').addEventListener('touchend', (e) => {
    if (pressTimer === 'fired') e.preventDefault(); else clearTimeout(pressTimer);
    pressTimer = null;
  });
}

function pushPending(chatId, extra) {
  const clientId = Math.random().toString(36).slice(2);
  const r = S.replyTo;
  const pending = {
    id: `p-${clientId}`, clientId, chatId, userId: S.me.id, text: '', createdAt: Date.now(), pending: true, freshAt: Date.now(),
    replyTo: r ? { id: r.id, userId: r.userId, text: (r.text || '').slice(0, 140), kind: r.image ? 'photo' : r.file?.kind || null, fileName: r.file?.name } : null,
    ...extra,
  };
  S.messages.get(chatId)?.list.push(pending);
  return pending;
}
function dropPending(chatId, clientId) {
  const list = S.messages.get(chatId)?.list;
  const i = list?.findIndex((m) => m.clientId === clientId) ?? -1;
  if (i >= 0) list.splice(i, 1);
  if (S.active === chatId) renderMessages(false);
}
async function uploadAndSend(chatId, pending, blob, { kind, name, build }) {
  const replyTo = pending.replyTo?.id;
  try {
    const res = await upload(blob, {
      kind, name,
      onProgress: (p) => {
        pending.progress = p;
        const bar = $(`#messages .msg[data-id="${pending.id}"] .upload-progress div`);
        if (bar) bar.style.width = `${Math.round(p * 100)}%`;
      },
    });
    wsSend({ type: 'message', chatId, clientId: pending.clientId, text: pending.text, replyTo, ...build(res) });
  } catch (err) {
    toast(`Не отправлено: ${err.message}`);
    dropPending(chatId, pending.clientId);
  }
}

$('#composer').addEventListener('submit', async (e) => {
  e.preventDefault();
  const chatId = S.active;
  if (!chatId) return;
  if (!S.ws || S.ws.readyState !== 1) return toast('Нет соединения с сервером, переподключаемся…');
  const text = input.value.trim();

  if (S.editing) {
    const m = S.editing;
    if (text !== m.text && (text || m.image || m.file)) {
      wsSend({ type: 'edit', chatId, messageId: m.id, text });
      m.text = text;
      m.editedAt = Date.now();
    }
    return cancelEdit();
  }

  const attach = S.attach;
  if (!text && !attach) return;
  input.value = '';
  store.del(`draft:${chatId}`);
  autosize();
  clearAttach(false);
  const replyTo = S.replyTo?.id;

  if (!attach) {
    const p = pushPending(chatId, { text });
    clearReply();
    renderMessages(true);
    Sound.sent();
    return wsSend({ type: 'message', chatId, text, clientId: p.clientId, replyTo });
  }
  if (attach.mode === 'image') {
    const p = pushPending(chatId, { text, image: { url: attach.url, w: attach.w, h: attach.h }, localUrl: attach.url, progress: 0 });
    clearReply();
    renderMessages(true);
    Sound.sent();
    return uploadAndSend(chatId, p, attach.blob, { kind: 'image', name: attach.name, build: (r) => ({ image: { url: r.url, w: attach.w, h: attach.h } }) });
  }
  const p = pushPending(chatId, { text, file: { url: attach.url, name: attach.name, size: attach.size, kind: 'file' }, localUrl: attach.url, progress: 0 });
  clearReply();
  renderMessages(true);
  Sound.sent();
  uploadAndSend(chatId, p, attach.blob, {
    kind: 'file', name: attach.name,
    build: (r) => {
      const media = ['mp4', 'webm', 'ogg', 'mp3', 'wav'].includes(r.ext);
      const kind = media && /^video\//.test(attach.mime) ? 'video' : media && /^audio\//.test(attach.mime) ? 'audio' : 'file';
      return { file: { url: r.url, name: attach.name, size: r.size, kind } };
    },
  });
});

// ---------- voice recording ----------
const Rec = { mr: null, stream: null, chunks: [], started: 0, timer: null, cancelled: false, chatId: null };
async function startRecording() {
  if (!S.active || Rec.mr) return;
  if (!window.MediaRecorder) return toast('Браузер не поддерживает запись голоса');
  let mic;
  try { mic = await NS.micStream(); } catch (e) { return toast(mediaError(e, 'микрофону')); }
  Rec.stream = mic.stream;
  Rec.micStop = mic.stop;
  const mime = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/mp4', 'audio/webm'].find((t) => MediaRecorder.isTypeSupported(t));
  // 128 kbps Opus: near-transparent voice (32 kbps sounded muddy).
  Rec.mr = new MediaRecorder(Rec.stream, mime ? { mimeType: mime, audioBitsPerSecond: 128000 } : { audioBitsPerSecond: 128000 });
  Rec.chunks = [];
  Rec.cancelled = false;
  Rec.chatId = S.active;
  Rec.mr.ondataavailable = (e) => { if (e.data.size) Rec.chunks.push(e.data); };
  Rec.mr.onstop = () => {
    const dur = (Date.now() - Rec.started) / 1000;
    Rec.micStop();
    clearInterval(Rec.timer);
    $('#recordBar').classList.add('hidden');
    $('#composer').classList.remove('hidden');
    const blob = new Blob(Rec.chunks, { type: Rec.mr.mimeType || 'audio/webm' });
    const { cancelled, chatId } = Rec;
    Rec.mr = null;
    if (cancelled) return;
    if (dur < 0.6 || !blob.size) return toast('Слишком короткое сообщение');
    sendVoice(chatId, blob, dur);
  };
  Rec.mr.start(250);
  Rec.started = Date.now();
  $('#recTime').textContent = '0:00';
  $('#recordBar').classList.remove('hidden');
  $('#composer').classList.add('hidden');
  Rec.timer = setInterval(() => {
    const s = (Date.now() - Rec.started) / 1000;
    $('#recTime').textContent = fmtDur(s);
    if (s >= 300) stopRecording(false); // 5 min cap
  }, 250);
}
function stopRecording(cancel) {
  if (!Rec.mr || Rec.mr.state === 'inactive') return;
  Rec.cancelled = cancel;
  Rec.mr.stop();
}
function sendVoice(chatId, blob, duration) {
  const url = URL.createObjectURL(blob);
  const ext = blob.type.includes('ogg') ? 'ogg' : blob.type.includes('mp4') ? 'm4a' : 'webm';
  const p = pushPending(chatId, { file: { url, name: 'Голосовое сообщение', size: blob.size, kind: 'voice', duration }, localUrl: url, progress: 0 });
  clearReply();
  if (S.active === chatId) renderMessages(true);
  Sound.sent();
  uploadAndSend(chatId, p, blob, {
    kind: 'voice', name: `voice.${ext}`,
    build: (r) => ({ file: { url: r.url, name: 'Голосовое сообщение', size: r.size, kind: 'voice', duration } }),
  });
}
$('#voiceBtn').addEventListener('click', startRecording);
$('#recCancel').addEventListener('click', () => stopRecording(true));
$('#recSend').addEventListener('click', () => stopRecording(false));

// ---------- websocket ----------
let wsRetry = 0;
function connectWs() {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  const mk = store.get('maintKey', '').split(':')[1] || '';
  const ws = new WebSocket(`${proto}://${location.host}/ws?token=${S.token}${mk ? `&mk=${encodeURIComponent(mk)}` : ''}`);
  S.ws = ws;
  ws.onopen = () => {
    if (wsRetry > 0) loadChats().then(() => {
      S.messages.clear();
      if (S.active) openChat(S.active);
    });
    wsRetry = 0;
    if (call) wsSend({ type: 'call:join', chatId: call.chatId });
  };
  ws.onmessage = (e) => handleEvent(JSON.parse(e.data));
  ws.onclose = (e) => {
    if (S.ended) return;
    // Banned or deleted: asking the server once more brings the window with the reason.
    if (e.code === 4001 && e.reason === 'banned') return api('/api/me').catch(() => {});
    if (e.code === 4001) { toast('Сессия завершена'); return setTimeout(logout, 800); }
    if (e.code === 4003) { api('/api/me').catch(() => {}); setTimeout(connectWs, 30_000); return; }
    wsRetry++;
    setTimeout(connectWs, Math.min(1000 * 2 ** wsRetry, 15000));
  };
}
function wsSend(obj) { if (S.ws?.readyState === 1) S.ws.send(JSON.stringify(obj)); }

function replaceMessage(m) {
  const state = S.messages.get(m.chatId);
  if (state) {
    const i = state.list.findIndex((x) => x.id === m.id);
    if (i >= 0) state.list[i] = { ...m, localUrl: state.list[i].localUrl };
  }
  const chat = S.chats.get(m.chatId);
  if (chat?.lastMessage?.id === m.id) chat.lastMessage = m;
}

function handleEvent(ev) {
  if (ev.type === 'maintenance') return Maint.set(ev);
  if (ev.type === 'announcement') return Announce.set(ev.announcement);
  switch (ev.type) {
    case 'hello': {
      // A redeploy changes the version; reload so nobody keeps running an old page.
      if (!S.version) S.version = ev.version;
      else if (ev.version !== S.version) {
        if (call) S.reloadAfterCall = true;
        else { toast('Вышло обновление, перезагружаем…'); setTimeout(() => location.reload(), 1200); }
      }
      return;
    }
    case 'message': return onMessage(ev.message, ev.clientId);
    case 'message:update':
      replaceMessage(ev.message);
      if (ev.message.chatId === S.active) renderMessages(false);
      renderSide();
      return;
    case 'message:delete': {
      const state = S.messages.get(ev.chatId);
      if (state) {
        state.list = state.list.filter((m) => m.id !== ev.messageId);
        for (const m of state.list) if (m.replyTo?.id === ev.messageId) m.replyTo = { id: ev.messageId, deleted: true };
      }
      if (Voice.id === String(ev.messageId)) Voice.stop();
      if (S.editing?.id === ev.messageId) cancelEdit();
      if (S.replyTo?.id === ev.messageId) clearReply();
      const chat = S.chats.get(ev.chatId);
      if (chat) chat.lastMessage = ev.lastMessage;
      if (ev.chatId === S.active) renderMessages(false);
      renderSide();
      return;
    }
    case 'read': {
      const chat = S.chats.get(ev.chatId);
      if (!chat || ev.userId === S.me.id) return;
      chat.othersRead = Math.max(chat.othersRead || 0, ev.messageId);
      if (ev.chatId === S.active) {
        // Only the tick marks change; update them in place.
        for (const el of $$('#messages .msg')) {
          const m = findMessage(el.dataset.id);
          const t = el.querySelector('.ticks');
          if (!m || !t || m.pending || m.id > chat.othersRead) continue;
          t.classList.add('read');
          t.innerHTML = I.checks;
          t.title = 'Прочитано';
        }
      }
      return;
    }
    case 'coins': Shop.setCoins(ev.coins); return;
    case 'shop': Shop.refresh(); return;
    case 'scooter:ready': Shop.askBuild(); return;
    case 'gift': toast(`${ev.from} дарит вам ${ev.name} №${ev.serial}`); return;
    case 'chat': upsertChat(ev.chat); if (ev.chat.id === S.active) renderRequestBar(); return;
    case 'notice': return toast(ev.text);
    case 'warning': return queueWarnings([ev.warning]);
    case 'reactions': {
      const m = S.messages.get(ev.chatId)?.list.find((x) => x.id === ev.messageId);
      if (m) { m.reactions = ev.reactions; if (ev.chatId === S.active) renderMessages(false); }
      return;
    }
    case 'transcript': {
      const m = S.messages.get(ev.chatId)?.list.find((x) => x.id === ev.messageId);
      if (m) { m.transcript = ev.text || '(тишина)'; if (ev.chatId === S.active) renderMessages(false); }
      return;
    }
    case 'mention':
      if (ev.chatId !== S.active) toast(`${ev.from} упомянул(а) вас в «${ev.title}»`);
      return;
    case 'chat:removed': {
      S.chats.delete(ev.chatId);
      S.messages.delete(ev.chatId);
      if (ev.text) toast(ev.text);
      if (S.active === ev.chatId) { S.active = null; location.hash = ''; location.reload(); return; }
      renderNav();
      return;
    }
    case 'ticket': return Tickets.onEvent(ev);
    case 'tickets:count': return Tickets.setCount(ev.open);
    case 'reports:count':
      if (ev.open > (S.reports || 0)) toast('Новая жалоба на сообщение');
      setReports(ev.open);
      if (!$('#adminModal').classList.contains('hidden')) loadAdmin().catch(() => {});
      return;
    case 'mute':
      S.me = { ...S.me, mute: ev.mute };
      return applyMute();
    case 'user': {
      rememberUsers([ev.user]);
      for (const c of S.chats.values()) c.members = c.members.map((m) => (m.id === ev.user.id ? { ...m, ...ev.user } : m));
      if (ev.user.id === S.me.id) renderMe();
      renderNav(); renderChatHeader();
      if (S.active) renderMessages(false);
      return;
    }
    case 'presence': {
      rememberUsers([{ id: ev.userId, online: ev.online, lastSeen: ev.lastSeen }]);
      if (ev.userId === S.me.id) renderMe();
      renderNav(); renderChatHeader();
      return;
    }
    case 'typing': return setTyping(ev.chatId, ev.userId, true);
    case 'call:ring': return onRing(ev);
    case 'call:state': {
      const chat = S.chats.get(ev.chatId);
      if (chat) chat.call = ev.call;
      if (incoming && incoming.chatId === ev.chatId && !ev.call) hideIncoming();
      renderSide();
      if (ev.chatId === S.active) renderCallBanner();
      return;
    }
    case 'call:invited':
      if (ev.user) rememberUsers([ev.user]);
      if (call && call.chatId === ev.chatId && ev.by !== S.me.id) toast(`${userName(ev.by)} зовёт в звонок: ${ev.user?.displayName || userName(ev.userId)}`);
      return;
    case 'call:declined':
      if (call && call.chatId === ev.chatId) {
        toast(`${userName(ev.userId)} отклоняет звонок`);
        Sound.stop();
      }
      return;
  }
}

function onMessage(m, clientId) {
  const chat = S.chats.get(m.chatId);
  if (!chat) { loadChats(); return; }
  const state = S.messages.get(m.chatId);
  const mine = m.userId === S.me.id;
  if (state) {
    const i = clientId ? state.list.findIndex((x) => x.clientId === clientId) : -1;
    // Keep the local preview and animation timing so the row doesn't flicker.
    if (i >= 0) state.list[i] = { ...m, localUrl: state.list[i].localUrl, freshAt: state.list[i].freshAt };
    else state.list.push({ ...m, freshAt: Date.now() });
  }
  chat.lastMessage = m;
  setTyping(m.chatId, m.userId, false);
  const visible = m.chatId === S.active && document.visibilityState === 'visible';
  if (!mine) {
    Sound.received(chatSound(m.chatId).msg);
    if (!visible) {
      chat.unread = (chat.unread || 0) + 1;
      notify(chatName(chat), (isGroupish(chat) ? userName(m.userId) + ': ' : '') + previewText(m), m.chatId);
    }
  }
  renderNav();
  if (m.chatId === S.active) {
    renderMessages(mine);
    if (visible) markRead();
  }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.active) { markRead(); renderNav(); } });

// ---------- notifications ----------
const notifyEnabled = () => store.get('notify', '0') === '1' && 'Notification' in window && Notification.permission === 'granted';
function notify(title, body, chatId) {
  if (!notifyEnabled() || document.visibilityState === 'visible') return;
  try {
    const n = new Notification(title, { body: String(body).slice(0, 140), icon: '/logo.png', tag: `chat-${chatId}` });
    n.onclick = () => { window.focus(); openChat(chatId); n.close(); };
  } catch {}
}

// ---------- modals ----------
document.querySelectorAll('.modal').forEach((m) => m.addEventListener('click', (e) => {
  // The scooter question needs an answer, so it does not close by a click past it.
  if (m.id === 'giftModal' && $('#giftBody [data-scooter-no]')) return;
  if ((e.target === m || e.target.closest('[data-close]')) && m.id !== 'incoming') m.classList.add('hidden');
}));
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && S.me) { e.preventDefault(); openFind(); return; }
  if (e.key !== 'Escape') return;
  if (!$('#lightbox').classList.contains('hidden')) return $('#lightbox').classList.add('hidden');
  if (!$('#ctxMenu').classList.contains('hidden')) return hideMenu();
  if (!$('#settings').classList.contains('hidden')) return closeSettings();
  const open = $$('.modal:not(.hidden)').filter((m) => m.id !== 'incoming').pop();
  if (open) open.classList.add('hidden');
});

// Group creation / adding a member share one picker.
let groupMode = 'create';
const picked = new Set();
let groupTimer;
async function fillGroupUsers(term = '') {
  const { users } = await api(`/api/users?contacts=1&q=${encodeURIComponent(term)}`);
  rememberUsers(users);
  let filtered = users;
  if (groupMode === 'add') {
    const chat = S.chats.get(S.active);
    filtered = users.filter((u) => !chat.members.some((m) => m.id === u.id));
  } else if (groupMode === 'invite' && call) {
    // Don't offer people who are already in the call.
    const inCall = new Set([...call.room.remoteParticipants.values()].map((p) => Number(p.identity)));
    filtered = users.filter((u) => !inCall.has(u.id));
  }
  $('#groupUsers').innerHTML = filtered.map((u) => `
    <label class="pick">${avatarOf(u, 'sm', true)}
      <span class="name">${nameHtml(u, u.displayName)}${checkOf(u)}<small>@${esc(u.username)}</small></span>
      <input type="${groupMode === 'create' ? 'checkbox' : 'radio'}" name="pick" value="${u.id}" ${picked.has(u.id) ? 'checked' : ''}>
    </label>`).join('') || '<div class="side-empty">Никого не найдено</div>';
}
// «Создать»: first choose the type, then name and people.
function createTypes() {
  openPanel('Выберите тип', `
    <button class="create-type" data-create="group"><span class="ico">${I.members}</span><span><b>Группа</b><span class="muted">Общайтесь вместе: писать могут все участники</span></span></button>
    <button class="create-type" data-create="channel"><span class="ico">${I.speaker}</span><span><b>Канал</b><span class="muted">Пишут только администраторы, остальные читают и ставят реакции</span></span></button>`);
}
$('#panelBody').addEventListener('click', (e) => {
  const b = e.target.closest('[data-create]');
  if (!b) return;
  closePanel();
  openGroupModal('create', b.dataset.create === 'channel');
});
let createChannel = false;
function openGroupModal(mode, channel = false) {
  groupMode = mode;
  createChannel = mode === 'create' && channel;
  picked.clear();
  const T = {
    create: channel ? ['Новый канал', 'Название и первые подписчики — их можно добавить и позже.', 'Создать'] : ['Новая группа', 'Название и участники — их можно добавить и позже.', 'Создать'],
    add: ['Добавить участника', 'Выберите, кого пригласить в группу.', 'Добавить'],
    invite: ['Добавить в звонок', 'Выберите, кого позвать — ему придёт входящий звонок.', 'Позвонить'],
  }[mode];
  $('#groupModalTitle').textContent = T[0];
  $('#groupModalSub').textContent = T[1];
  $('#groupSubmit').textContent = T[2];
  $('#groupTitleLabel').classList.toggle('hidden', mode !== 'create');
  $('#groupTitle').placeholder = channel ? 'Мой канал' : 'Моя группа';
  $('#groupTitle').value = '';
  $('#groupSearch').value = '';
  $('#groupError').textContent = '';
  $('#groupModal').classList.remove('hidden');
  fillGroupUsers().catch(() => {});
  (mode === 'create' ? $('#groupTitle') : $('#groupSearch')).focus();
}
$('#newGroupBtn').addEventListener('click', () => openGroupModal('create'));
$('#groupSearch').addEventListener('input', (e) => { clearTimeout(groupTimer); groupTimer = setTimeout(() => fillGroupUsers(e.target.value.trim()).catch(() => {}), 200); });
$('#groupUsers').addEventListener('change', (e) => {
  const id = Number(e.target.value);
  if (groupMode !== 'create') picked.clear();
  if (e.target.checked) picked.add(id); else picked.delete(id);
});
$('#groupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    if (groupMode === 'invite') {
      if (!picked.size || !call) throw new Error('Выберите, кого позвать');
      const uid = [...picked][0];
      await api(`/api/chats/${call.chatId}/call/invite`, { method: 'POST', body: { userId: uid } });
      $('#groupModal').classList.add('hidden');
      return toast(`Звоним: ${userName(uid)}…`);
    }
    let chat;
    if (groupMode === 'create') {
      ({ chat } = await api('/api/chats/group', { method: 'POST', body: { title: $('#groupTitle').value, memberIds: [...picked], channel: createChannel } }));
    } else {
      if (!picked.size) throw new Error('Выберите пользователя');
      ({ chat } = await api(`/api/chats/${S.active}/members`, { method: 'POST', body: { userId: [...picked][0] } }));
    }
    upsertChat(chat);
    $('#groupModal').classList.add('hidden');
    openChat(chat.id);
  } catch (err) { $('#groupError').textContent = err.message; }
});

// ---------- profiles ----------
async function showUser(userId) {
  let u = S.users.get(userId);
  let blocked = false;
  try { ({ user: u, blocked } = await api(`/api/users/${userId}`)); rememberUsers([u]); } catch {}
  if (!u) return;
  const isMe = u.id === S.me.id;
  const since = u.createdAt ? new Date(u.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  $('#infoBody').innerHTML = `
    <div class="profile-banner" style="${bannerStyle(u)}">${bannerVideo(u)}</div>
    <div class="profile-body">
      ${avatarOf(u, 'xl', true)}
      <div class="profile-box">
        <div class="title">${nameHtml(u, u.displayName)}${checkOf(u)}</div>
        <div class="muted username-line"><span>@${esc(u.username)}</span>${badgeOf(u)}</div>
        ${u.bio ? `<div class="profile-bio">${esc(u.bio)}</div>` : ''}
        <hr>
        <h4>Статус</h4><p class="muted">${esc(lastSeenText(u))}</p>
        <hr>
        <h4>В Ethic с</h4><p class="muted">${since}</p>
        <div id="profileGifts" class="hidden"></div>
      </div>
      <div class="profile-actions">
        ${isMe ? '<button class="btn primary" data-act="edit">Редактировать профиль</button>' : `
          <button class="btn primary" data-act="write">Написать</button>
          <button class="btn" data-act="call">Позвонить</button>
          <button class="btn" data-act="gift">Подарить</button>
          <button class="btn" data-act="more" title="Ещё">${I.dots}</button>`}
      </div>
    </div>`;
  $('#infoBody').dataset.user = u.id;
  $('#infoBody').dataset.blocked = blocked ? '1' : '0';
  Shop.loadProfile(u.id);
  $('#infoModal').classList.remove('hidden');
}
function showGroup(chat) {
  $('#infoBody').innerHTML = `
    <div class="profile-banner" style="background:${colorOf(chat.id + 3)}"></div>
    <div class="profile-body">
      ${groupAvatar(chat, 'xl')}
      <div class="profile-box">
        <div class="title">${esc(chat.title)}</div>
        <div class="muted">${chat.members.length} участн.</div>
        <hr>
        <div class="profile-members">${chat.members.map((m) => `
          <div class="panel-row"><button class="member grow" data-profile="${m.id}">${avatarOf(m, '', true)}
            <span class="member-text"><span class="name" style="color:${nameColor(m)}">${nameHtml(m, fresh(m).displayName)}${checkOf(m)}${badgeOf(m)}</span>
            ${m.id === chat.ownerId ? '<span class="member-role">создатель</span>' : (chat.admins || []).includes(m.id) ? '<span class="member-role">администратор</span>' : ''}</span></button>
            ${isChatAdmin(chat) && m.id !== S.me.id && m.id !== chat.ownerId ? `<button class="icon-btn" data-member-more="${m.id}" title="Действия">${I.dots}</button>` : ''}</div>`).join('')}</div>
      </div>
      <div class="profile-actions"><button class="btn primary" data-act="add">Добавить участника</button></div>
    </div>`;
  $('#infoModal').classList.remove('hidden');
}
$('#chatInfoBtn').addEventListener('click', () => {
  const chat = S.chats.get(S.active);
  if (!chat) return;
  if (isGroupish(chat)) showGroup(chat); else showUser(otherMember(chat).id);
});
$('#profileBtn').addEventListener('click', () => showUser(S.me.id));
$('#infoBody').addEventListener('click', async (e) => {
  const mm = e.target.closest('[data-member-more]');
  if (mm) {
    const chat = S.chats.get(S.active);
    const uid = Number(mm.dataset.memberMore);
    const isAdmin = (chat.admins || []).includes(uid);
    const r = mm.getBoundingClientRect();
    const items = [chat.ownerId === S.me.id && ['admin', isAdmin ? 'Снять администратора' : 'Сделать администратором'], ['kick', 'Исключить', '', true]].filter(Boolean);
    return showMenu(r.right - 200, r.bottom + 4, items, async (a) => {
      try {
        const res = a === 'admin'
          ? await api(`/api/chats/${chat.id}/admins`, { method: 'POST', body: { userId: uid, admin: !isAdmin } })
          : confirm(`Исключить ${userName(uid)}?`) ? await api(`/api/chats/${chat.id}/members/${uid}`, { method: 'DELETE' }) : null;
        if (res) { upsertChat(res.chat); showGroup(res.chat); }
      } catch (err) { toast(err.message); }
    });
  }
  const giftCell = e.target.closest('[data-gift-cell]');
  if (giftCell) return Shop.showGift(Number(giftCell.dataset.giftCell));
  const prof = e.target.closest('[data-profile]');
  if (prof) return showUser(Number(prof.dataset.profile));
  const moreBtn = e.target.closest('[data-act="more"]');
  if (moreBtn) {
    const uid = Number($('#infoBody').dataset.user);
    const blocked = $('#infoBody').dataset.blocked === '1';
    const r = moreBtn.getBoundingClientRect();
    return showMenu(r.left, r.bottom + 4, [['block', blocked ? 'Разблокировать' : 'Заблокировать', '', !blocked]], async () => {
      if (!blocked && !confirm(`Заблокировать ${userName(uid)}? Он не сможет писать вам и звонить.`)) return;
      try { await api(`/api/users/${uid}/block`, { method: 'POST', body: { blocked: !blocked } }); toast(blocked ? 'Разблокирован' : 'Заблокирован'); showUser(uid); } catch (err) { toast(err.message); }
    });
  }
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (!act) return;
  const uid = Number($('#infoBody').dataset.user);
  $('#infoModal').classList.add('hidden');
  try {
    if (act === 'edit') openSettings();
    if (act === 'gift') { Shop.to = S.users.get(uid)?.username || ''; openSettings('shop'); }
    if (act === 'add') openGroupModal('add');
    if (act === 'write') await openDirect(uid);
    if (act === 'call') { await openDirect(uid); startCall(S.active, false); }
  } catch (err) { toast(err.message); }
});

// ---------- settings ----------
function switchSettings(pane) {
  $$('.settings-tab[data-pane]').forEach((t) => t.classList.toggle('active', t.dataset.pane === pane));
  $$('.settings-pane').forEach((p) => p.classList.toggle('hidden', p.dataset.paneId !== pane));
  if (pane === 'plus') renderPlus();
  if (pane === 'privacy') Privacy.open();
  if (pane === 'devices') Devices.open();
  if (pane === 'shop') Shop.open();
  if (pane === 'voice') openDevicePane(); else stopMeter();
}
$$('.settings-tab[data-pane]').forEach((t) => t.addEventListener('click', () => switchSettings(t.dataset.pane)));
function renderProfileForm() {
  $('#profileAvatar').innerHTML = avatarOf(S.me, '', true);
  $('#profileTitle').innerHTML = `${nameHtml(S.me, S.me.displayName)}${checkOf(S.me)}`;
  $('#profileBadge').innerHTML = badgeOf(S.me);
  $('#profileLogin').textContent = `@${S.me.username}`;
  $('#profileUsername').value = S.me.username;
  const next = S.me.usernameNextChange;
  const locked = !!next && next > Date.now();
  $('#profileUsername').disabled = locked;
  $('#profileUsernameHint').textContent = locked ? `Следующая смена будет доступна ${new Date(next).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}` : 'Менять можно раз в 30 дней. Латиница, цифры, _ и точка.';
  $('#emailCurrent').textContent = S.me.email ? `· ${S.me.email}` : '· не привязана';
  $('#emailCodeBtn').textContent = $('#emailCodeBtn').disabled ? $('#emailCodeBtn').textContent : (S.me.email ? 'Сменить' : 'Привязать');
  $('#avatarRemove').classList.toggle('hidden', !S.me.avatar);
  $('#accountBanner').setAttribute('style', bannerStyle(S.me));
  $('#accountBanner').innerHTML = bannerVideo(S.me);
  $('#bannerRemove').classList.toggle('hidden', !S.me.banner);
  $('#bannerSwatches').innerHTML = BANNER_COLORS.map((c) =>
    `<button type="button" class="swatch ${S.me.banner === c ? 'sel' : ''}" data-color="${c}" style="background:${c}" title="${c}"></button>`).join('');
}
const BANNER_COLORS = ['#ffffff', '#a3a3a3', '#525252', '#262626', '#000000', '#1d9bf0', '#2563eb', '#dc2626', '#16a34a', '#9333ea'];
function openSettings(pane = 'account') {
  renderProfileForm();
  $('#profileName').value = S.me.displayName;
  $('#profileBio').value = S.me.bio || '';
  $('#notifyToggle').checked = notifyEnabled();
  $('#settings').classList.remove('hidden');
  switchSettings(pane);
}
function closeSettings() {
  $('#settings').classList.add('hidden');
  stopMeter();
  Sound.stop();
}
$('#settingsBtn').addEventListener('click', () => openSettings());
$('#callSettingsBtn').addEventListener('click', () => openSettings('voice'));
$('#settingsClose').addEventListener('click', closeSettings);

$('#notifyToggle').addEventListener('change', async (e) => {
  if (e.target.checked) {
    if (!('Notification' in window)) { e.target.checked = false; return toast('Браузер не поддерживает уведомления'); }
    const p = await Notification.requestPermission();
    if (p !== 'granted') { e.target.checked = false; return toast('Разрешение на уведомления не выдано'); }
  }
  store.set('notify', e.target.checked ? '1' : '0');
});
$('#profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const body = { displayName: $('#profileName').value, bio: $('#profileBio').value };
    const username = $('#profileUsername').value.trim().replace(/^@/, '');
    if (username && username !== S.me.username) body.username = username; // sent only when it really changes: it is allowed once in 30 days
    const { user } = await api('/api/me', { method: 'PATCH', body });
    rememberUsers([user]);
    renderMe(); renderProfileForm();
    toast('Сохранено');
  } catch (err) { toast(err.message); }
});
$('#logoutBtn').addEventListener('click', logout);

$('#emailCodeBtn').addEventListener('click', async () => {
  const email = $('#emailNew').value.trim();
  if (!email) return ($('#emailError').textContent = 'Введите почту');
  if (await sendCodeBtn($('#emailCodeBtn'), $('#emailError'), () => api('/api/me/email/code', { method: 'POST', body: { email } }))) {
    $('#emailCodeRow').classList.remove('hidden');
    $('#emailCode').focus();
    toast(`Код отправлен на ${email}`);
  }
});
$('#emailForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#emailError').textContent = '';
  try {
    const { user } = await api('/api/me/email', { method: 'POST', body: { email: $('#emailNew').value.trim(), code: $('#emailCode').value } });
    S.me = { ...S.me, ...user };
    $('#emailNew').value = ''; $('#emailCode').value = '';
    $('#emailCodeRow').classList.add('hidden');
    renderProfileForm();
    toast('Почта привязана');
  } catch (err) { $('#emailError').textContent = err.message; }
});

// Center-crop to a 512px square and upload; returns the photo's address.
async function uploadAvatar(file) {
  if (!isImageFile(file)) throw new Error('Выберите изображение (JPG, PNG, WebP или GIF)');
  // A GIF keeps moving only for Ethic+; for everyone else its first frame becomes the photo.
  if (file.type === 'image/gif' && S.me?.plus) {
    if (file.size > 15 * 1024 * 1024) throw new Error('Анимированная аватарка — до 15 МБ');
    return (await upload(file, { kind: 'image', name: 'avatar' })).url;
  }
  const { src, w, h } = await decodeImage(file);
  const side = Math.min(w, h);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = Math.min(512, side);
  canvas.getContext('2d').drawImage(src, (w - side) / 2, (h - side) / 2, side, side, 0, 0, canvas.width, canvas.height);
  const blob = await encodeCanvas(canvas);
  if (!blob) throw new Error('Не удалось обработать изображение');
  return (await upload(blob, { kind: 'image', name: 'avatar' })).url;
}
$('#avatarEdit').addEventListener('click', () => $('#avatarInput').click());
$('#avatarUpload').addEventListener('click', () => $('#avatarInput').click());
$('#avatarInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    toast('Загружаем аватар…');
    const url = await uploadAvatar(file);
    const { user } = await api('/api/me', { method: 'PATCH', body: { avatar: url } });
    rememberUsers([user]);
    renderMe(); renderProfileForm(); renderNav();
    toast('Аватар обновлён');
  } catch (err) { toast(err.message || 'Не удалось загрузить аватар'); }
});
$('#avatarRemove').addEventListener('click', async () => {
  try {
    const { user } = await api('/api/me', { method: 'PATCH', body: { avatar: null } });
    rememberUsers([{ ...user, avatar: null }]);
    renderMe(); renderProfileForm(); renderNav();
  } catch (err) { toast(err.message); }
});

// Banner
async function saveBanner(banner) {
  const { user } = await api('/api/me', { method: 'PATCH', body: { banner } });
  rememberUsers([{ ...user, banner: user.banner }]);
  renderProfileForm();
}
$('#bannerSwatches').addEventListener('click', (e) => {
  const b = e.target.closest('[data-color]');
  if (b) saveBanner(b.dataset.color).catch((err) => toast(err.message));
});
$('#bannerRemove').addEventListener('click', () => saveBanner(null).catch((err) => toast(err.message)));
$('#bannerUpload').addEventListener('click', () => $('#bannerInput').click());
$('#bannerInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    if (!isImageFile(file)) throw new Error('Выберите изображение (JPG, PNG, WebP или GIF)');
    toast('Загружаем баннер…');
    const { src, w, h } = await decodeImage(file);
    // Center-crop to 3:1, at most 1200px wide.
    let sw = w, sh = Math.round(w / 3);
    if (sh > h) { sh = h; sw = Math.round(h * 3); }
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(1200, sw);
    canvas.height = Math.round(canvas.width / 3);
    canvas.getContext('2d').drawImage(src, (w - sw) / 2, (h - sh) / 2, sw, sh, 0, 0, canvas.width, canvas.height);
    const blob = await encodeCanvas(canvas);
    if (!blob) throw new Error('Не удалось обработать изображение');
    const { url } = await upload(blob, { kind: 'image', name: 'banner' });
    await saveBanner(url);
    toast('Баннер обновлён');
  } catch (err) { toast(err.message || 'Не удалось загрузить баннер'); }
});

// Devices
const ringSel = $('#ringtoneSelect');
ringSel.innerHTML = Object.entries(Sound.RINGTONES).map(([id, r]) => `<option value="${id}">${r.name}</option>`).join('');
ringSel.value = store.get('ringtone', 'classic');
ringSel.addEventListener('change', () => { store.set('ringtone', ringSel.value); Sound.preview(ringSel.value); });
$('#ringtonePreview').addEventListener('click', () => Sound.preview(ringSel.value));
$('#msgSoundToggle').checked = store.get('msgSound', '1') === '1';
$('#msgSoundToggle').addEventListener('change', (e) => { store.set('msgSound', e.target.checked ? '1' : '0'); if (e.target.checked) Sound.received(); });
const canPickSpeaker = 'setSinkId' in HTMLMediaElement.prototype;

let meter = null; // { mic, ctx, raf }
function stopMeter() {
  if (!meter) return;
  cancelAnimationFrame(meter.raf);
  meter.mic.stop();
  meter.ctx.close().catch(() => {});
  meter = null;
  $('#micMeter').style.width = '0';
}
async function startMeter() {
  stopMeter();
  // During a call LiveKit already holds the mic; don't open a second capture.
  if (call) return;
  // The meter shows the level *after* noise suppression, so the effect is visible.
  const mic = await NS.micStream();
  const ctx = new AudioContext();
  const an = ctx.createAnalyser();
  an.fftSize = 512;
  ctx.createMediaStreamSource(mic.stream).connect(an);
  const data = new Uint8Array(an.fftSize);
  meter = { mic, ctx, raf: 0 };
  const tick = () => {
    an.getByteTimeDomainData(data);
    let peak = 0;
    for (const v of data) peak = Math.max(peak, Math.abs(v - 128));
    $('#micMeter').style.width = `${Math.min(100, (peak / 128) * 160)}%`;
    if (meter) meter.raf = requestAnimationFrame(tick);
  };
  tick();
}
async function fillDeviceSelects() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const fill = (sel, kind, key, fallback) => {
    const list = devices.filter((d) => d.kind === kind);
    const saved = store.get(key, '');
    sel.innerHTML = list.length
      ? list.map((d, i) => `<option value="${esc(d.deviceId)}">${esc(d.label || `${fallback} ${i + 1}`)}</option>`).join('')
      : '<option value="">Не найдено</option>';
    if (saved && list.some((d) => d.deviceId === saved)) sel.value = saved;
    return list;
  };
  const mics = fill($('#micSelect'), 'audioinput', 'mic', 'Микрофон');
  fill($('#speakerSelect'), 'audiooutput', 'speaker', 'Динамик');
  fill($('#camSelect'), 'videoinput', 'cam', 'Камера');
  $('#speakerSelect').disabled = !canPickSpeaker;
  const hints = [];
  if (call) hints.push('Во время звонка индикатор микрофона не работает, но устройства переключаются сразу.');
  if (!canPickSpeaker) hints.push('Выбор устройства вывода поддерживается в Chrome, Edge и Яндекс Браузере.');
  if (mics.length && !mics[0].label) hints.push('Разрешите доступ к микрофону, чтобы увидеть названия устройств.');
  $('#deviceHint').textContent = hints.join(' ');
}
async function openDevicePane() {
  try { await startMeter(); } catch (e) { $('#deviceHint').textContent = mediaError(e, 'микрофону'); }
  await fillDeviceSelects().catch(() => {});
}
const KIND = { micSelect: ['mic', 'audioinput'], speakerSelect: ['speaker', 'audiooutput'], camSelect: ['cam', 'videoinput'] };
for (const [selId, [key, kind]] of Object.entries(KIND)) {
  $(`#${selId}`).addEventListener('change', async (e) => {
    const id = e.target.value;
    store.set(key, id);
    if (key === 'speaker') Sound.applySink();
    if (key === 'mic') startMeter().catch(() => {});
    if (call) {
      // A noise-suppressed mic is our own pipeline, so rebuild it instead of swapping the device underneath.
      if (kind === 'audioinput' && NS.mode() === 'strong') { await republishMic(); toast('Устройство переключено'); return; }
      try { await call.room.switchActiveDevice(kind, id); toast('Устройство переключено'); }
      catch { toast('Не удалось переключить устройство'); }
    }
  });
}
navigator.mediaDevices?.addEventListener('devicechange', () => fillDeviceSelects().catch(() => {}));
$('#noiseSelect').value = NS.mode();
$('#noiseSelect').addEventListener('change', async (e) => {
  store.set('noise', e.target.value);
  if (e.target.value === 'strong') NS.load().catch(() => toast('Сильное шумоподавление не поддерживается этим браузером'));
  if (meter) startMeter().catch(() => {});
  if (call) { await republishMic(); toast('Шумоподавление применено'); }
});

// ---------- admin panel ----------
async function loadAdmin() {
  const term = $('#adminSearch').value.trim();
  const [stats, { users }] = await Promise.all([
    api('/api/admin/stats'),
    api(`/api/admin/users?q=${encodeURIComponent(term)}`),
  ]);
  rememberUsers(users.map(({ banned, grantedCheck, customBadge, messages, ...u }) => u));
  const cards = [
    ['Пользователей', stats.users], ['Сейчас в сети', stats.online], ['Чатов', stats.chats],
    ['Сообщений', stats.messages], ['За сутки', stats.messagesToday], ['Фото', stats.photos],
    ['Файлов', stats.files], ['Идёт звонков', stats.activeCalls], ['Заблокировано', stats.banned],
  ];
  const gb = (b) => (b / 1024 ** 3).toFixed(1).replace('.', ',') + ' ГБ';
  if (stats.diskFree != null) cards.push([`Свободно на диске из ${gb(stats.diskTotal)}`, gb(stats.diskFree), stats.diskLow]);
  cards.push(['Файлы пользователей', gb(stats.uploadsBytes || 0)]);
  cards.push([stats.lastBackup ? `Автобэкапов, последний ${stats.lastBackup.split('-').reverse().join('.')}` : 'Автобэкапов', stats.backups || 0]);
  $('#adminStats').innerHTML = cards.map(([k, v, warn]) => `<div class="stat${warn ? ' warn' : ''}"><b>${v}</b><span>${k}</span></div>`).join('');
  if (stats.diskLow) toast('На сервере заканчивается место на диске');
  $('#adminInvite').textContent = stats.inviteCode || 'не требуется';
  $('#adminInvite').dataset.code = stats.inviteCode || '';
  adminUsers = new Map(users.map((u) => [u.id, u]));
  setReports(stats.reports);
  renderReports(await api('/api/admin/reports').then((r) => r.reports).catch(() => []));
  $('#adminUsers').innerHTML = users.map((u) => {
    const more = adminActions(u).length ? `<button class="icon-btn admin-more" data-more title="Действия">${I.dots}</button>` : '';
    return `<div class="admin-row" data-id="${u.id}">
      ${avatarOf(u, 'sm', true)}
      <div class="meta">
        <div class="name">${nameHtml(u, u.displayName)}${checkOf(u)} ${u.banned ? `<span class="ban-badge">заблокирован</span>${u.banUntil ? ` <span class="small ban-until">до ${fmtDate(u.banUntil)}</span>` : ''}` : ''}${u.mute ? `<span class="mute-badge">мут${u.mute.until ? ` до ${fmtDate(u.mute.until)}` : ''}</span>` : ''}</div>
        <div class="small muted username-line">ID ${u.id} · @${esc(u.username)}${badgeOf(u)} · ${u.messages} сообщ.${u.warnings ? ` · <span class="warn-count">предупреждений: ${u.warnings} из ${u.warnLimit}</span>` : ''} · с ${new Date(u.createdAt).toLocaleDateString('ru-RU')}</div>
        ${u.banned && u.banReason ? `<div class="small muted">Причина: ${esc(u.banReason)}</div>` : ''}
      </div>
      ${more}
    </div>`;
  }).join('') || '<div class="side-empty">Никого не найдено</div>';
}
$('#adminBtn').addEventListener('click', async () => {
  Maint.render();
  $('#adminSearch').value = '';
  $('#adminModal').classList.remove('hidden');
  try { await loadAdmin(); } catch (err) { toast(err.message); }
});
let adminTimer;
$('#adminSearch').addEventListener('input', () => { clearTimeout(adminTimer); adminTimer = setTimeout(() => loadAdmin().catch((e) => toast(e.message)), 250); });
// Everything that can be done to a person sits behind the «⋯» button of their row.
let adminUsers = new Map();
const ROLES = [['user', 'Без роли'], ['tester', 'Тестер'], ['support', 'Поддержка'], ['dev', 'Разработчик']];
function adminActions(u) {
  const owner = S.me.role === 'owner';
  const items = [];
  if (owner && !u.dev) items.push(['verify', u.grantedCheck ? 'Снять галочку' : 'Выдать галочку']);
  if (owner) items.push(['badge', 'Надпись…']);
  if (owner && u.role !== 'owner') items.push(['role', 'Роль…']);
  const canBan = u.id !== S.me.id && u.role !== 'owner' && (u.role !== 'dev' || owner);
  const canDelete = owner && u.role !== 'owner' && !u.username.startsWith('deleted_');
  if (items.length && (canBan || canDelete)) items.push(['-']);
  if (canBan && !u.banned) items.push(['warn', 'Предупредить…']);
  if (canBan && !u.banned) items.push(u.mute ? ['unmute', 'Снять мут'] : ['mute', 'Замутить…']);
  if (canBan) items.push(u.banned ? ['unban', 'Разблокировать'] : ['ban', 'Заблокировать…', '', true]);
  if (canDelete) items.push(['delete', 'Удалить аккаунт…', '', true]);
  return items;
}
async function adminAction(a, u) {
  const url = `/api/admin/users/${u.id}`;
  const who = `@${u.username}`;
  try {
    if (a === 'verify') await api(`${url}/verify`, { method: 'POST', body: { verified: !u.grantedCheck } });
    if (a === 'badge') {
      const r = await ask({ title: `Надпись у ${who}`, text: 'Видна рядом с именем. Пустое поле убирает её. У разработчиков без своей надписи показывается «разработчик».', ok: 'Сохранить',
        fields: [{ name: 'badge', label: 'Надпись, до 24 символов', value: u.customBadge, max: 24 }] });
      if (!r) return;
      await api(`${url}/badge`, { method: 'POST', body: { badge: r.badge } });
    }
    if (a === 'role') {
      const r = await ask({ title: `Роль ${who}`, ok: 'Сохранить', fields: [{ name: 'role', label: 'Роль', value: u.role, options: ROLES }] });
      if (!r || r.role === u.role) return;
      await api(`${url}/role`, { method: 'POST', body: { role: r.role } });
      toast('Роль изменена');
    }
    if (a === 'ban') {
      const r = await ask({ title: `Заблокировать ${who}?`, text: 'Он сразу выйдет из аккаунта и увидит окно с причиной и сроком. Блокировка на время снимется сама.', ok: 'Заблокировать', danger: true,
        fields: [{ name: 'hours', label: 'Срок', value: '24', options: DURATIONS }, { name: 'reason', label: 'Причина, необязательно', multiline: true, placeholder: 'Например: спам' }] });
      if (!r) return;
      const { until } = await api(`${url}/ban`, { method: 'POST', body: { banned: true, reason: r.reason, hours: Number(r.hours) || null } });
      toast(until ? `${who} заблокирован до ${fmtDate(until)}` : `${who} заблокирован навсегда`);
    }
    if (a === 'mute') {
      const r = await ask({ title: `Замутить ${who}?`, text: 'Он сможет читать чаты, но не сможет писать. Увидит срок и причину.', ok: 'Замутить',
        fields: [{ name: 'hours', label: 'Срок', value: '1', options: DURATIONS }, { name: 'reason', label: 'Причина, необязательно', multiline: true, placeholder: 'Например: флуд' }] });
      if (!r) return;
      const { until } = await api(`${url}/mute`, { method: 'POST', body: { muted: true, reason: r.reason, hours: Number(r.hours) || null } });
      toast(until ? `${who} не может писать до ${fmtDate(until)}` : `${who} не может писать`);
    }
    if (a === 'unmute') {
      await api(`${url}/mute`, { method: 'POST', body: { muted: false } });
      toast(`${who} снова может писать`);
    }
    if (a === 'warn') {
      const n = (u.warnings || 0) + 1;
      const r = await ask({ title: `Предупредить ${who}?`,
        text: n >= u.warnLimit ? `Это ${n}-е предупреждение: аккаунт сразу заблокируется с этой причиной.` : `Это ${n}-е предупреждение из ${u.warnLimit}. Он увидит окно с причиной, на ${u.warnLimit}-м аккаунт заблокируется сам.`,
        ok: n >= u.warnLimit ? 'Предупредить и заблокировать' : 'Предупредить', danger: n >= u.warnLimit,
        fields: [{ name: 'reason', label: 'Причина', multiline: true, placeholder: 'Например: оскорбления в чате' }] });
      if (!r) return;
      const { count, banned } = await api(`${url}/warn`, { method: 'POST', body: { reason: r.reason } });
      toast(banned ? `${who} получил ${count}-е предупреждение и заблокирован` : `${who} предупреждён: ${count} из ${u.warnLimit}`);
    }
    if (a === 'unban') {
      await api(`${url}/ban`, { method: 'POST', body: { banned: false } });
      toast(`${who} разблокирован`);
    }
    if (a === 'delete') {
      const r = await ask({ title: `Удалить аккаунт ${who}?`, text: 'Логин, фото, почта и вход будут удалены навсегда, отменить нельзя. Причину он увидит при попытке войти.', ok: 'Удалить навсегда', danger: true,
        fields: [{ name: 'reason', label: 'Причина, необязательно', multiline: true }, { name: 'confirm', label: 'Для подтверждения напишите: удалить', confirmWord: 'удалить' }] });
      if (!r) return;
      await api(`${url}/delete`, { method: 'POST', body: { reason: r.reason } });
      toast('Аккаунт удалён');
    }
    await loadAdmin();
  } catch (err) { toast(err.message); }
}
// ---------- link previews ----------
const Previews = {
  cache: new Map(), pending: new Set(), timer: null,
  get(url) {
    if (this.cache.has(url)) return this.cache.get(url);
    if (!this.pending.has(url)) {
      this.pending.add(url);
      api(`/api/preview?url=${encodeURIComponent(url)}`).then((r) => this.cache.set(url, r.preview || null)).catch(() => this.cache.set(url, null))
        .finally(() => { clearTimeout(this.timer); this.timer = setTimeout(() => { if (S.active) renderMessages(false); }, 150); });
    }
    return null;
  },
};
function previewHtml(m) {
  const u = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/.exec(m.text || '')?.[1];
  if (!u) return '';
  const url = u.startsWith('www.') ? `https://${u}` : u;
  if (joinCodeOf(url)) return '';
  const p = Previews.get(url);
  if (!p) return '';
  return `<a class="link-card" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}
    <span class="lc-site">${esc(p.site)}</span><b>${esc(p.title)}</b>${p.description ? `<span class="lc-desc">${esc(p.description)}</span>` : ''}</a>`;
}

// ---------- per-chat sounds ----------
function chatSound(id) { try { return JSON.parse(store.get(`chatSound:${id}`, '{}')) || {}; } catch { return {}; } }
async function chatSounds(chat) {
  const cur = chatSound(chat.id);
  const r = await ask({ title: 'Звуки чата', text: `Свои звуки для «${chatName(chat)}». Остальные чаты звучат как обычно.`, ok: 'Сохранить',
    fields: [{ name: 'msg', label: 'Новое сообщение', value: cur.msg || '', options: [['', 'Как обычно'], ...Object.entries(Sound.MSG_SOUNDS)] },
      { name: 'ring', label: 'Звонок', value: cur.ring || '', options: [['', 'Как обычно'], ...Object.entries(Sound.RINGTONES).map(([k, v]) => [k, v.name])] }] });
  if (!r) return;
  store.set(`chatSound:${chat.id}`, JSON.stringify({ msg: r.msg || undefined, ring: r.ring || undefined }));
  if (r.msg) Sound.received(r.msg); else if (r.ring) Sound.preview(r.ring);
  toast('Звуки сохранены');
}

// ---------- round video messages ----------
const Circle = {
  stream: null, rec: null, chunks: [], started: 0, timer: null, chatId: null, send: false,
  async start() {
    if (!S.active) return;
    try { this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 480, facingMode: 'user' }, audio: NS.constraints() }); }
    catch { return toast('Нет доступа к камере или микрофону'); }
    this.chatId = S.active; this.chunks = []; this.send = false;
    openPanel('Видеокружок', `<video class="circle-rec" id="circlePreview" autoplay muted playsinline></video>
      <div class="panel-row"><span id="circleTime">0:00 / 1:00</span><span class="grow"></span><button class="btn" data-circle="cancel">Отмена</button><button class="btn primary" data-circle="send">Отправить</button></div>`);
    $('#circlePreview').srcObject = this.stream;
    const type = ['video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find((t) => MediaRecorder.isTypeSupported(t)) || '';
    this.rec = new MediaRecorder(this.stream, type ? { mimeType: type, videoBitsPerSecond: 600_000 } : undefined);
    this.rec.ondataavailable = (e) => e.data.size && this.chunks.push(e.data);
    this.rec.onstop = () => this.finish();
    this.rec.start(500);
    this.started = Date.now();
    this.timer = setInterval(() => {
      const s = (Date.now() - this.started) / 1000;
      if ($('#panelModal').classList.contains('hidden')) return this.stop(false);
      $('#circleTime').textContent = `${fmtDur(s)} / 1:00`;
      if (s >= 60) this.stop(true);
    }, 250);
  },
  stop(send) {
    clearInterval(this.timer);
    this.send = send;
    if (this.rec?.state === 'recording') this.rec.stop(); else this.finish();
  },
  finish() {
    this.stream?.getTracks().forEach((t) => t.stop());
    closePanel();
    if (!this.send || !this.chunks.length) return;
    const blob = new Blob(this.chunks, { type: this.rec.mimeType || 'video/webm' });
    const duration = (Date.now() - this.started) / 1000;
    const url = URL.createObjectURL(blob);
    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
    const p = pushPending(this.chatId, { file: { url, name: 'Видеосообщение', size: blob.size, kind: 'circle', duration }, localUrl: url, progress: 0 });
    if (S.active === this.chatId) renderMessages(true);
    Sound.sent();
    uploadAndSend(this.chatId, p, blob, { kind: 'voice', name: `circle.${ext}`, build: (r) => ({ file: { url: r.url, name: 'Видеосообщение', size: r.size, kind: 'circle', duration } }) });
  },
};
$('#panelBody').addEventListener('click', (e) => { const b = e.target.closest('[data-circle]'); if (b) Circle.stop(b.dataset.circle === 'send'); });

// ---------- devices ----------
const Devices = {
  async open() {
    $('#linkDeviceBtn').classList.toggle('hidden', !(isTouch && 'BarcodeDetector' in window));
    try {
      const { devices } = await api('/id/v1/devices');
      const icon = (d) => (/Android|iPhone/i.test(d.name) || d.platform === 'android' || d.platform === 'ios' ? '📱' : '💻');
      const when = (d) => (d.current ? '<span class="now">это устройство</span>' : d.lastSeen ? `активно ${fullTime(d.lastSeen)}` : `вход ${fullTime(d.createdAt)}`);
      const app = (d) => ({ 'ethic-id': 'Ethic ID', clicker: 'Ethic Clicker', messenger: '' }[d.app] ?? '');
      $('#deviceList').innerHTML = devices.map((d) => `<div class="device"><span class="ico">${icon(d)}</span>
        <div class="grow"><div>${esc(d.name)}${app(d) ? ` <span class="muted small">· ${app(d)}</span>` : ''}</div><div class="muted small">${when(d)}</div></div>
        ${d.current ? '' : `<button class="btn small" data-end-device="${esc(d.id)}">Завершить</button>`}</div>`).join('') || '<div class="muted small">Нет устройств</div>';
    } catch (err) { toast(err.message); }
  },
};
$('#deviceList').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-end-device]');
  if (!b || !confirm('Завершить сеанс на этом устройстве? Там придётся войти заново.')) return;
  try { await api(`/id/v1/devices/${encodeURIComponent(b.dataset.endDevice)}`, { method: 'DELETE' }); toast('Сеанс завершён'); Devices.open(); } catch (err) { toast(err.message); }
});
$('#logoutOthers').addEventListener('click', async () => {
  if (!confirm('Выйти на всех устройствах, кроме этого?')) return;
  try { const r = await api('/id/v1/devices/logout-others', { method: 'POST' }); toast(`Завершено сеансов: ${r.count}`); Devices.open(); } catch (err) { toast(err.message); }
});
// A phone browser can scan the code from a computer screen.
const Scanner = {
  stream: null, timer: null,
  async open() {
    try { this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); }
    catch { return toast('Нет доступа к камере'); }
    openPanel('Привязать устройство', '<video class="scan-video" id="scanVideo" autoplay muted playsinline></video><p class="muted small">Наведите камеру на QR-код на экране компьютера.</p>');
    $('#scanVideo').srcObject = this.stream;
    const detector = new BarcodeDetector({ formats: ['qr_code'] });
    this.timer = setInterval(async () => {
      if ($('#panelModal').classList.contains('hidden')) return this.close();
      const codes = await detector.detect($('#scanVideo')).catch(() => []);
      const token = codes.map((c) => /^ethic:\/\/qr\/([\w-]+)$/.exec(c.rawValue)?.[1]).find(Boolean);
      if (!token) return;
      this.close();
      try { const r = await api(`/api/qr/${token}/approve`, { method: 'POST' }); toast(`Вход выполнен: ${r.device || 'компьютер'}`); Devices.open(); } catch (err) { toast(err.message); }
    }, 400);
  },
  close() { clearInterval(this.timer); this.stream?.getTracks().forEach((t) => t.stop()); closePanel(); },
};
$('#linkDeviceBtn').addEventListener('click', () => Scanner.open());

// ---------- privacy and the block list ----------
const Privacy = {
  async open() {
    $('#lastSeenSelect').value = S.me.lastSeenPrivacy || 'all';
    try {
      const { users } = await api('/api/blocks');
      $('#blockList').innerHTML = users.map((u) => `<div class="panel-row">${avatarOf(u, 'sm')}<span class="grow">${nameHtml(u, u.displayName)} <span class="muted small">@${esc(u.username)}</span></span>
        <button class="btn small" data-unblock="${u.id}">Разблокировать</button></div>`).join('') || '<div class="muted small">Никого</div>';
    } catch (err) { toast(err.message); }
  },
};
$('#lastSeenSelect').addEventListener('change', async (e) => {
  try { const { user } = await api('/api/me', { method: 'PATCH', body: { lastSeenPrivacy: e.target.value } }); S.me = { ...S.me, ...user }; toast('Сохранено'); } catch (err) { toast(err.message); }
});
$('#blockList').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-unblock]');
  if (!b) return;
  try { await api(`/api/users/${b.dataset.unblock}/block`, { method: 'POST', body: { blocked: false } }); Privacy.open(); } catch (err) { toast(err.message); }
});

// ---------- panels: one button opens them ----------
function openPanel(title, html) {
  $('#panelTitle').textContent = title;
  $('#panelBody').innerHTML = html;
  $('#panelModal').classList.remove('hidden');
}
const closePanel = () => $('#panelModal').classList.add('hidden');

// ---------- group and channel settings ----------
const TIMERS = [['0', 'Выключены'], ['3600', 'Через 1 час'], ['86400', 'Через 1 день'], ['604800', 'Через 7 дней']];
const GroupSettings = {
  chat: null,
  open(chat) {
    this.chat = chat;
    const link = chat.inviteCode ? `${PUBLIC_ORIGIN}/join/${chat.inviteCode}` : '';
    openPanel(chat.type === 'channel' ? 'Настройки канала' : 'Настройки группы', `
      <div class="panel-section gs-photo">${groupAvatar(chat, 'xl')}
        <div class="panel-row"><button class="btn small primary" data-gs="photo">${chat.avatar ? 'Сменить фото' : 'Поставить фото'}</button>${chat.avatar ? '<button class="btn small" data-gs="nophoto">Убрать</button>' : ''}</div>
        <input type="file" id="gsPhoto" accept="image/*" hidden></div>
      <div class="panel-section"><h4>Название</h4>
        <div class="panel-row"><input class="grow" id="gsTitle" maxlength="64" value="${esc(chat.title)}"><button class="btn small" data-gs="title">Сохранить</button></div></div>
      <div class="panel-section"><h4>Ссылка-приглашение</h4>
        ${link ? `<div class="invite-link">${esc(link)}</div><div class="panel-row"><button class="btn small" data-gs="copy">Скопировать</button><button class="btn small" data-gs="new">Новая ссылка</button><button class="btn small" data-gs="off">Выключить</button></div>`
        : '<div class="muted small">По ссылке человек сам вступит, без вашего приглашения.</div><div class="panel-row"><button class="btn small primary" data-gs="new">Создать ссылку</button></div>'}</div>
      <div class="panel-section"><h4>Исчезающие сообщения</h4>
        <select id="gsTimer">${TIMERS.map(([v, l]) => `<option value="${v}"${String(chat.disappear || 0) === v ? ' selected' : ''}>${l}</option>`).join('')}</select>
        <div class="muted small">Новые сообщения удалятся у всех через выбранное время.</div></div>
      <div class="panel-section"><h4>Участники и администраторы</h4>
        <div class="muted small">Откройте «Участники» и нажмите ⋯ у человека: назначить администратором или исключить.</div>
        <div class="panel-row"><button class="btn small" data-gs="members">Участники</button></div></div>`);
  },
  async timer(chat) {
    const r = await ask({ title: 'Исчезающие сообщения', text: 'Новые сообщения в этом чате удалятся у обоих через выбранное время.', ok: 'Сохранить',
      fields: [{ name: 't', label: 'Удалять', value: String(chat.disappear || 0), options: TIMERS }] });
    if (!r) return;
    try { upsertChat((await api(`/api/chats/${chat.id}`, { method: 'PATCH', body: { disappear: Number(r.t) } })).chat); renderChatHeader(); toast('Сохранено'); } catch (err) { toast(err.message); }
  },
};
$('#panelBody').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-gs]');
  const chat = GroupSettings.chat;
  if (!b || !chat) return;
  try {
    let res;
    if (b.dataset.gs === 'title') res = await api(`/api/chats/${chat.id}`, { method: 'PATCH', body: { title: $('#gsTitle').value } });
    if (b.dataset.gs === 'new') res = await api(`/api/chats/${chat.id}/invite`, { method: 'POST', body: {} });
    if (b.dataset.gs === 'off') res = await api(`/api/chats/${chat.id}/invite`, { method: 'POST', body: { off: true } });
    if (b.dataset.gs === 'copy') { await navigator.clipboard.writeText(`${PUBLIC_ORIGIN}/join/${chat.inviteCode}`); return toast('Ссылка скопирована'); }
    if (b.dataset.gs === 'members') { closePanel(); return showGroup(chat); }
    if (b.dataset.gs === 'photo') return $('#gsPhoto').click();
    if (b.dataset.gs === 'nophoto') res = await api(`/api/chats/${chat.id}`, { method: 'PATCH', body: { avatar: null } });
    if (res) { upsertChat(res.chat); GroupSettings.open(res.chat); renderChatHeader(); toast('Сохранено'); }
  } catch (err) { toast(err.message); }
});
$('#panelBody').addEventListener('change', async (e) => {
  if (e.target.id === 'gsPhoto' && GroupSettings.chat) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      toast('Загружаем фото…');
      const avatar = await uploadAvatar(file);
      const { chat } = await api(`/api/chats/${GroupSettings.chat.id}`, { method: 'PATCH', body: { avatar } });
      upsertChat(chat); GroupSettings.open(chat); renderChatHeader(); toast('Фото обновлено');
    } catch (err) { toast(err.message || 'Не удалось загрузить фото'); }
    return;
  }
  if (e.target.id !== 'gsTimer' || !GroupSettings.chat) return;
  try { upsertChat((await api(`/api/chats/${GroupSettings.chat.id}`, { method: 'PATCH', body: { disappear: Number(e.target.value) } })).chat); renderChatHeader(); toast('Сохранено'); } catch (err) { toast(err.message); }
});

// ---------- joining by link ----------
function joinCodeOf(href) {
  try { const u = new URL(href, location.origin); return u.hostname === location.hostname ? (/^\/join\/([\w-]{4,32})$/.exec(u.pathname) || [])[1] : null; } catch { return null; }
}
const Join = {
  async ask(code) {
    try {
      const { chat } = await api(`/api/join/${code}`);
      if (chat.joined) { await loadChats(); return openChat(chat.id); }
      const r = await ask({ title: `Вступить в «${chat.title}»?`, text: `${chat.type === 'channel' ? 'Канал' : 'Группа'} · ${chat.members} участн.`, ok: 'Вступить' });
      if (!r) return;
      const res = await api(`/api/join/${code}`, { method: 'POST' });
      upsertChat(res.chat);
      openChat(res.chat.id);
    } catch (err) { toast(err.message); }
  },
};

// ---------- search ----------
const Search = {
  chatId: null, timer: null,
  open(chatId = null) {
    this.chatId = chatId;
    openPanel('Поиск по сообщениям', `
      <div class="panel-row"><input class="grow" id="searchInput" type="search" placeholder="Что найти" autocomplete="off">
        <select id="searchScope"><option value="chat"${chatId ? ' selected' : ''}${chatId ? '' : ' disabled'}>В этом чате</option><option value="all"${chatId ? '' : ' selected'}>Во всех чатах</option></select></div>
      <div id="searchResults" class="check-list"></div>`);
    $('#searchInput').focus();
  },
  async run() {
    const qv = $('#searchInput')?.value.trim() || '';
    const box = $('#searchResults');
    if (qv.length < 2) { box.innerHTML = '<div class="muted small">Введите хотя бы 2 буквы</div>'; return; }
    const scope = $('#searchScope').value === 'chat' && this.chatId ? `&chatId=${this.chatId}` : '';
    try {
      const { messages } = await api(`/api/search?q=${encodeURIComponent(qv)}${scope}`);
      const re = new RegExp(qv.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      box.innerHTML = messages.map((m) => `<button class="search-hit" data-hit-chat="${m.chatId}" data-hit="${m.id}">
        <span class="small">${esc(S.chats.get(m.chatId) ? chatName(S.chats.get(m.chatId)) : 'Чат')} · ${esc(userName(m.userId))} · ${fullTime(m.createdAt)}</span>
        <span>${esc(m.text).replace(re, (x) => `<mark>${x}</mark>`)}</span></button>`).join('') || '<div class="muted small">Ничего не найдено</div>';
    } catch (err) { toast(err.message); }
  },
};
$('#panelBody').addEventListener('input', (e) => {
  if (e.target.id !== 'searchInput') return;
  clearTimeout(Search.timer);
  Search.timer = setTimeout(() => Search.run(), 300);
});
$('#panelBody').addEventListener('change', (e) => { if (e.target.id === 'searchScope') Search.run(); });
$('#panelBody').addEventListener('click', async (e) => {
  const hit = e.target.closest('[data-hit]');
  if (!hit) return;
  closePanel();
  await openChat(Number(hit.dataset.hitChat));
  setTimeout(() => jumpTo(hit.dataset.hit), 300);
});

// ---------- scheduled messages ----------
const Scheduled = {
  async ask() {
    const chatId = S.active, text = input.value.trim();
    if (!chatId || !text) return;
    if (S.attach) return toast('Отложить можно только текст: уберите вложение');
    const soon = new Date(Date.now() + 3600_000);
    soon.setMinutes(0, 0, 0);
    const local = (d) => new Date(d - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
    const r = await ask({ title: 'Отправить позже', text: 'Сообщение уйдёт само в выбранное время, даже если вы не в сети.', ok: 'Запланировать',
      fields: [{ name: 'at', label: 'Когда', type: 'datetime-local', value: local(soon), min: local(new Date()) }] });
    if (!r?.at) return;
    try {
      await api(`/api/chats/${chatId}/scheduled`, { method: 'POST', body: { text, sendAt: new Date(r.at).getTime(), replyTo: S.replyTo?.id } });
      input.value = '';
      store.del(`draft:${chatId}`);
      autosize();
      clearReply();
      updateComposerButtons();
      toast(`Отправится ${fullTime(new Date(r.at).getTime())}`);
    } catch (err) { toast(err.message); }
  },
  async list(chatId) {
    const { scheduled } = await api(`/api/chats/${chatId}/scheduled`);
    openPanel('Отложенные сообщения', scheduled.length
      ? scheduled.map((s) => `<div class="sched-row"><div class="sched-when">${esc(fullTime(s.sendAt))}</div><div class="sched-text">${esc(s.text || '(вложение)')}</div>
          <div class="panel-row"><button class="btn small" data-sched-now="${s.id}">Отправить сейчас</button><button class="btn small danger" data-sched-del="${s.id}">Удалить</button></div></div>`).join('')
      : '<div class="muted">Нет отложенных сообщений. Чтобы запланировать, нажмите правой кнопкой (или зажмите) кнопку «Отправить».</div>');
    this.chatId = chatId;
  },
};
$('#panelBody').addEventListener('click', async (e) => {
  const now = e.target.closest('[data-sched-now]'), del = e.target.closest('[data-sched-del]');
  if (!now && !del) return;
  try {
    if (now) await api(`/api/scheduled/${now.dataset.schedNow}/now`, { method: 'POST' });
    else await api(`/api/scheduled/${del.dataset.schedDel}`, { method: 'DELETE' });
    Scheduled.list(Scheduled.chatId);
  } catch (err) { toast(err.message); }
});

// ---------- stickers (Ethic+) ----------
const Stickers = {
  async open() {
    const { stickers } = await api('/api/stickers');
    openPanel('Стикеры', stickers.length
      ? `<div class="sticker-grid">${stickers.map((u) => `<button class="sticker-pick" data-sticker="${esc(u)}"><img src="${esc(u)}" alt="" loading="lazy"></button>`).join('')}</div>
         <div class="muted small" style="margin-top:10px">Правой кнопкой по стикеру — убрать его.</div>`
      : '<div class="muted">Стикеров пока нет. Откройте меню у любой картинки в чате и нажмите «Добавить в стикеры».</div>');
  },
};
$('#panelBody').addEventListener('click', (e) => {
  const b = e.target.closest('[data-sticker]');
  if (!b || !S.active) return;
  closePanel();
  const url = b.dataset.sticker;
  const p = pushPending(S.active, { image: { url, w: 160, h: 160 }, sticker: true });
  renderMessages(true);
  wsSend({ type: 'message', chatId: S.active, clientId: p.clientId, image: { url, w: 160, h: 160 }, sticker: true });
});
$('#panelBody').addEventListener('contextmenu', async (e) => {
  const b = e.target.closest('[data-sticker]');
  if (!b) return;
  e.preventDefault();
  if (!confirm('Убрать этот стикер?')) return;
  await api(`/api/stickers?url=${encodeURIComponent(b.dataset.sticker)}`, { method: 'DELETE' }).catch(() => {});
  Stickers.open();
});

// ---------- folders ----------
const Folders = {
  open() {
    const list = S.folders || [];
    openPanel('Папки', `
      <div class="panel-section">${list.length ? list.map((f) => `<div class="panel-row"><span class="grow">${esc(f.name)} <span class="muted small">· ${f.chatIds.length} чат.</span></span>
        <button class="btn small" data-fold-edit="${f.id}">Изменить</button><button class="btn small" data-fold-del="${f.id}">Удалить</button></div>`).join('') : '<div class="muted small">Своих папок пока нет. «Личные» и «Группы» есть всегда.</div>'}</div>
      <div class="panel-row"><button class="btn small primary" data-fold-new>Новая папка</button></div>`);
  },
  edit(folder) {
    const chats = [...S.chats.values()].sort(byRecent);
    const has = new Set(folder?.chatIds || []);
    openPanel(folder ? 'Изменить папку' : 'Новая папка', `
      <div class="panel-section"><h4>Название</h4><input id="foldName" maxlength="24" value="${esc(folder?.name || '')}" placeholder="Например: Работа"></div>
      <div class="panel-section"><h4>Чаты в папке</h4><div class="check-list">${chats.map((c) => `<label class="check-row"><input type="checkbox" value="${c.id}"${has.has(c.id) ? ' checked' : ''}> ${esc(chatName(c))}</label>`).join('')}</div></div>
      <div class="panel-row"><button class="btn small" data-fold-back>Назад</button><button class="btn small primary" data-fold-save="${folder?.id || ''}">Сохранить</button></div>`);
  },
  async save(id) {
    const body = { name: $('#foldName').value, chatIds: $$('#panelBody .check-list input:checked').map((i) => Number(i.value)) };
    const r = id ? await api(`/api/folders/${id}`, { method: 'PATCH', body }) : await api('/api/folders', { method: 'POST', body });
    S.folders = r.folders;
    renderSide();
    this.open();
  },
};
$('#panelBody').addEventListener('click', async (e) => {
  try {
    if (e.target.closest('[data-fold-new]')) return Folders.edit(null);
    if (e.target.closest('[data-fold-back]')) return Folders.open();
    const ed = e.target.closest('[data-fold-edit]');
    if (ed) return Folders.edit(S.folders.find((f) => f.id === Number(ed.dataset.foldEdit)));
    const del = e.target.closest('[data-fold-del]');
    if (del) { S.folders = (await api(`/api/folders/${del.dataset.foldDel}`, { method: 'DELETE' })).folders; if (String(S.folder) === del.dataset.foldDel) S.folder = 'all'; renderSide(); return Folders.open(); }
    const sv = e.target.closest('[data-fold-save]');
    if (sv) return await Folders.save(Number(sv.dataset.foldSave) || null);
  } catch (err) { toast(err.message); }
});

// ---------- mentions: suggestions while typing @ ----------
function mentionSuggest() {
  const chat = S.chats.get(S.active);
  if (!isGroupish(chat)) return;
  const before = input.value.slice(0, input.selectionStart);
  const mt = /(^|\s)@([A-Za-z0-9_.]{0,32})$/.exec(before);
  if (!mt) return;
  const term = mt[2].toLowerCase();
  const list = chat.members.map(fresh).filter((u) => u.id !== S.me.id && (u.username.toLowerCase().startsWith(term) || u.displayName.toLowerCase().startsWith(term))).slice(0, 6);
  if (!list.length) return hideMenu();
  const r = input.getBoundingClientRect();
  showMenu(r.left + 8, r.top - 8 - list.length * 34, list.map((u) => [u.username, `${u.displayName} · @${u.username}`]), (name) => {
    const start = before.length - mt[2].length;
    input.value = input.value.slice(0, start) + name + ' ' + input.value.slice(input.selectionStart);
    input.focus();
    input.dispatchEvent(new Event('input'));
  });
}
input.addEventListener('keyup', (e) => { if (!['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) mentionSuggest(); });

// ---------- signing in on a computer with a QR code ----------
const QrLogin = {
  timer: null,
  async open() {
    try {
      const { token, link } = await api('/api/qr', { method: 'POST' });
      const qr = qrcode(0, 'M');
      qr.addData(link);
      qr.make();
      openPanel('Вход по QR-коду', `<div class="qr-box">${qr.createSvgTag({ cellSize: 6, margin: 0, scalable: true })}</div>
        <p class="muted small">На телефоне, где вы уже вошли, откройте Ethic Messenger → Настройки → Устройства → «Привязать устройство» и наведите камеру на код. Код действует 2 минуты.</p>`);
      clearInterval(this.timer);
      this.timer = setInterval(async () => {
        if ($('#panelModal').classList.contains('hidden')) return clearInterval(this.timer);
        const r = await api(`/api/qr/${token}`).catch(() => null);
        if (r?.status === 'expired') { clearInterval(this.timer); $('#panelBody').innerHTML = '<p class="muted">Код устарел.</p><button class="btn primary" id="qrAgain">Показать новый</button>'; }
        if (r?.status === 'done') {
          clearInterval(this.timer);
          closePanel();
          S.token = r.token;
          store.set('token', r.token);
          await enterApp(r.user);
        }
      }, 2000);
    } catch (err) { toast(err.message); }
  },
};
$('#qrLoginBtn').addEventListener('click', () => QrLogin.open());
// The sign-in code is shown only on computers; phones scan it.
$('#qrLoginBtn').classList.toggle('hidden', isTouch);
$('#panelBody').addEventListener('click', (e) => { if (e.target.id === 'qrAgain') QrLogin.open(); });

// ---------- reports ----------
const REPORT_KINDS = [['spam', 'Спам или реклама'], ['insult', 'Оскорбления'], ['scam', 'Мошенничество'], ['nsfw', 'Неприличное'], ['other', 'Другое']];
const reportKind = (k) => (REPORT_KINDS.find(([v]) => v === k) || REPORT_KINDS[4])[1];
async function reportMessage(m) {
  const r = await ask({ title: 'Пожаловаться на сообщение', text: 'Жалобу увидит только администрация. Автор не узнает, кто её отправил.', ok: 'Отправить',
    fields: [{ name: 'kind', label: 'Что не так', value: 'spam', options: REPORT_KINDS }, { name: 'reason', label: 'Подробнее, необязательно', multiline: true }] });
  if (!r) return;
  try {
    await api('/api/reports', { method: 'POST', body: { messageId: m.id, kind: r.kind, reason: r.reason } });
    toast('Жалоба отправлена');
  } catch (err) { toast(err.message); }
}
function setReports(n) {
  S.reports = n || 0;
  const b = $('#reportsHeadBadge');
  if (b) { b.textContent = S.reports > 99 ? '99+' : String(S.reports); b.classList.toggle('hidden', !S.reports); }
}
let reportCards = new Map();
function renderReports(list) {
  reportCards = new Map(list.map((c) => [c.messageId, c]));
  const box = $('#adminReports');
  box.classList.toggle('hidden', !list.length);
  box.innerHTML = list.length ? `<h3>Жалобы на сообщения: ${list.length}</h3>` + list.map((c) => `<div class="report-card" data-msg="${c.messageId}">
      <div class="report-head">${avatarOf(c.author, 'sm')}<div class="meta">
        <div class="name">${nameHtml(c.author, c.author?.displayName)}</div>
        <div class="small muted">@${esc(c.author?.username || '')} · ${c.chatTitle ? `в группе «${esc(c.chatTitle)}»` : 'в личных сообщениях'} · ${fmtDate(c.createdAt)}</div>
      </div><button class="icon-btn" data-rep-more title="Действия с автором">${I.dots}</button></div>
      <div class="report-text">${c.deleted ? '<i class="muted">Сообщение уже удалено</i>' : c.image ? `<img src="${esc(c.image)}" alt="">${c.text && c.text !== '[фото]' ? esc(c.text) : ''}` : esc(c.text || '')}</div>
      <div class="report-list">${c.reports.map((r) => `${esc(r.reporter?.displayName || '?')}: ${reportKind(r.kind)}${r.reason ? ` — ${esc(r.reason)}` : ''}`).join('<br>')}</div>
      <div class="row">${c.deleted ? '' : '<button class="btn small danger" data-rep="delete">Удалить сообщение</button>'}<button class="btn small" data-rep="dismiss">${c.deleted ? 'Закрыть' : 'Отклонить жалобу'}</button></div>
    </div>`).join('') : '';
}
$('#adminReports').addEventListener('click', async (e) => {
  const card = e.target.closest('[data-msg]');
  const c = card && reportCards.get(Number(card.dataset.msg));
  if (!c) return;
  if (e.target.closest('[data-rep-more]')) {
    const u = adminUsers.get(c.author.id) || { ...c.author, warnLimit: 3 };
    const r = e.target.closest('[data-rep-more]').getBoundingClientRect();
    return showMenu(r.right - 200, r.bottom + 4, adminActions(u), (a) => adminAction(a, u));
  }
  const b = e.target.closest('[data-rep]');
  if (!b) return;
  b.disabled = true;
  try {
    await api(`/api/admin/reports/${c.messageId}/close`, { method: 'POST', body: { deleteMessage: b.dataset.rep === 'delete' } });
    toast(b.dataset.rep === 'delete' ? 'Сообщение удалено' : 'Жалоба отклонена');
    await loadAdmin();
  } catch (err) { toast(err.message); b.disabled = false; }
});

const DURATIONS = [['1', '1 час'], ['24', '1 день'], ['72', '3 дня'], ['168', '7 дней'], ['720', '30 дней'], ['', 'Навсегда']];
const fmtDate = (ms) => new Date(ms).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

// ---------- mute ----------
let muteTimer;
function applyMute() {
  clearTimeout(muteTimer);
  const m = S.me?.mute;
  const on = !!m && (!m.until || m.until > Date.now());
  document.body.classList.toggle('is-muted', on);
  if (!on) return;
  $('#muteBar').textContent = `${m.until ? `Вам запрещено писать до ${fmtDate(m.until)}` : 'Вам запрещено писать'}. ${m.reason ? `Причина: ${m.reason}` : 'Причина не указана'}`;
  // Ends by itself; the server checks it too.
  if (m.until) muteTimer = setTimeout(() => { S.me = { ...S.me, mute: null }; applyMute(); }, Math.min(m.until - Date.now() + 500, 2 ** 31 - 1));
}

// ---------- Ethic+ themes ----------
const THEMES = [['', 'Обычная', '#f5f5f7', '#0a0a0c'], ['ocean', 'Океан', '#2563eb', '#0b2545'], ['sunset', 'Закат', '#ea580c', '#3b1408'], ['forest', 'Лес', '#16a34a', '#082a17'],
  ['violet', 'Фиалка', '#7c3aed', '#21093f'], ['rose', 'Роза', '#db2777', '#3a0a24'], ['gold', 'Золото', '#ca8a04', '#2e2204']];
function applyTheme() {
  const t = S.me?.plus ? S.me.theme : null;
  if (t) document.body.dataset.theme = t; else delete document.body.dataset.theme;
}

$('#adminUsers').addEventListener('click', (e) => {
  const b = e.target.closest('[data-more]');
  const u = b && adminUsers.get(Number(b.closest('[data-id]').dataset.id));
  if (!u) return;
  const r = b.getBoundingClientRect();
  showMenu(r.right - 200, r.bottom + 4, adminActions(u), (a) => adminAction(a, u));
});

// ---------- in-app dialog, instead of the browser's prompt() ----------
let askDone = null;
function ask({ title, text = '', ok = 'Готово', danger = false, fields = [] }) {
  askDone?.(null);
  $('#askTitle').textContent = title;
  $('#askText').textContent = text;
  $('#askText').classList.toggle('hidden', !text);
  $('#askBody').innerHTML = fields.map((f) => `<label class="field-label">${esc(f.label)}${
    f.options ? `<select name="${f.name}">${f.options.map(([v, l]) => `<option value="${v}"${v === f.value ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`
      : f.multiline ? `<textarea name="${f.name}" rows="3" maxlength="${f.max || 200}" placeholder="${esc(f.placeholder || '')}">${esc(f.value || '')}</textarea>`
        : `<input name="${f.name}"${f.password ? ' type="password" autocomplete="off"' : f.type ? ` type="${f.type}"` : ''}${f.min ? ` min="${f.min}"` : ''} maxlength="${f.max || 200}" value="${esc(f.value || '')}" placeholder="${esc(f.placeholder || '')}">`}</label>`).join('');
  const okBtn = $('#askOk');
  okBtn.textContent = ok;
  okBtn.className = `btn ${danger ? 'danger' : 'primary'}`;
  const word = fields.find((f) => f.confirmWord);
  const check = () => { okBtn.disabled = !!word && $(`#askBody [name="${word.name}"]`).value.trim().toLowerCase() !== word.confirmWord; };
  $('#askBody').oninput = check;
  check();
  $('#askModal').classList.remove('hidden');
  $('#askBody').querySelector('input, textarea, select')?.focus();
  return new Promise((resolve) => {
    askDone = (v) => { askDone = null; $('#askModal').classList.add('hidden'); resolve(v); };
  });
}
$('#askForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!$('#askOk').disabled) askDone?.(Object.fromEntries(new FormData(e.target)));
});
$('#askModal').addEventListener('click', (e) => { if (e.target === e.currentTarget || e.target.closest('[data-close]')) askDone?.(null); });

// ---------- banned or deleted ----------
// The window covers everything and has no way out except signing out.
// ---------- maintenance mode ----------
// The page covers everything for everyone. Only the password the owner set lets a device through:
// the key it gets is kept as "<closure id>:<key>", so a key from an earlier closure is not used again.
const Maint = {
  on: false, reason: '', back: '', id: '', denied: false, // denied: the server refused this account
  set(m) { this.on = !!m?.on; this.reason = m?.reason || ''; this.back = m?.back || ''; this.id = m?.id || ''; this.render(); },
  keep(key) { if (key) store.set('maintKey', `${this.id}:${key}`); },
  render() {
    // The owner's own account passes without the password; while a signed-in profile is still loading, wait for it.
    const show = this.on && store.get('maintKey', '').split(':')[0] !== this.id && S.me?.role !== 'owner' && !(S.token && !S.me && !this.denied);
    if (show && call) leaveCall();
    // While the page is up, ask now and then whether the messenger has opened again, and come back by itself.
    if (show && !this.poll) this.poll = setInterval(async () => {
      try { const c = await (await fetch('/api/config')).json(); if (!c.maintenance?.on) location.reload(); else if (c.maintenance.id !== this.id) this.set(c.maintenance); } catch {}
    }, 30000);
    if (!show && this.poll) { clearInterval(this.poll); this.poll = null; }
    $('#maintReason').textContent = this.reason || 'не указана';
    $('#maintBack').textContent = this.back ? `Откроемся: ${this.back}` : '';
    $('#maintBack').classList.toggle('hidden', !this.back);
    $('#maintScreen').classList.toggle('hidden', !show);
    const owner = S.me?.role === 'owner';
    $('#maintBox').classList.toggle('hidden', !owner);
    Announce.renderAdmin();
    $('#maintState').textContent = this.on ? `Включён, вход только по паролю. Причина: ${this.reason}${this.back ? `. Откроемся: ${this.back}` : ''}` : 'Выключен: мессенджер работает для всех';
    $('#maintToggle').textContent = this.on ? 'Выключить' : 'Включить…';
    $('#maintToggle').classList.toggle('danger', !this.on);
  },
};
$('#maintStaff').addEventListener('click', async () => {
  const r = await ask({ title: 'Вход для администрации', text: 'Введите пароль, который задан при закрытии мессенджера.', ok: 'Войти', fields: [{ name: 'password', label: 'Пароль', password: true }] });
  if (!r) return;
  try {
    const res = await fetch('/api/maintenance/unlock', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Device-Id': DEVICE_ID }, body: JSON.stringify({ password: r.password }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return toast(data.error || 'Не удалось войти');
    Maint.set(data.maintenance); Maint.keep(data.key);
    location.reload();
  } catch { toast('Нет соединения'); }
});
$('#maintToggle').addEventListener('click', async () => {
  try {
    let body = { on: false };
    if (!Maint.on) {
      const r = await ask({ title: 'Технический режим', text: 'Все вместо мессенджера увидят страницу «Ethic Messenger в данный момент не работает» с этой причиной. Войти смогут только вы и те, кто знает пароль.', ok: 'Закрыть мессенджер', fields: [{ name: 'reason', label: 'Причина' }, { name: 'back', label: 'Когда откроемся (необязательно)' }, { name: 'password', label: 'Пароль для входа (его спросит кнопка «Вход для администрации»)', password: true }] });
      if (!r) return;
      if (!String(r.reason || '').trim()) return toast('Укажите причину');
      if (String(r.password || '').length < 4) return toast('Пароль: не короче 4 символов');
      body = { on: true, reason: r.reason, back: r.back || '', password: r.password };
    }
    const done = await api('/api/admin/maintenance', { method: 'POST', body });
    Maint.id = done.maintenance.id; Maint.keep(done.key);
    Maint.set(done.maintenance);
    toast(Maint.on ? 'Технический режим включён' : 'Технический режим выключен');
  } catch (err) { toast(err.message); }
});

// ---------- «Спонсор»: screenshots of the Boosty payment ----------
const Sponsor = {
  files: [],
  offer() {
    if (!store.get('sponsor', '') || !S.me) return;
    this.files = [];
    this.render();
    $('#spError').textContent = '';
    $('#sponsorModal').classList.remove('hidden');
  },
  close() { store.del('sponsor'); this.files.forEach((f) => URL.revokeObjectURL(f.url)); this.files = []; $('#sponsorModal').classList.add('hidden'); },
  render() {
    $('#spThumbs').innerHTML = this.files.map((f, i) => `<div class="sp-thumb"><img src="${f.url}" alt=""><button data-sp-del="${i}" title="Убрать">✕</button></div>`).join('');
    $('#spSend').disabled = this.files.length < 2;
    $('#spAdd').textContent = this.files.length ? 'Добавить ещё' : 'Добавить скриншоты';
  },
  async add(list) {
    $('#spError').textContent = '';
    for (const file of list) {
      if (this.files.length >= 6) break;
      try { this.files.push(await prepareImage(file)); } catch (err) { $('#spError').textContent = err.message; }
    }
    this.render();
  },
  async send() {
    const btn = $('#spSend');
    btn.disabled = true;
    btn.textContent = 'Отправляем…';
    try {
      const images = [];
      for (const f of this.files) images.push((await upload(f.blob, { kind: 'image', name: 'sponsor' })).url);
      await api('/api/sponsor', { method: 'POST', body: { images } });
      this.close();
      toast('Заявка отправлена. Мы проверим скриншоты и включим подписку.');
    } catch (err) { $('#spError').textContent = err.message; }
    btn.textContent = 'Отправить';
    this.render();
  },
};
$('#spAdd').addEventListener('click', () => $('#spInput').click());
$('#spInput').addEventListener('change', (e) => { const l = [...e.target.files]; e.target.value = ''; Sponsor.add(l); });
$('#spThumbs').addEventListener('click', (e) => { const b = e.target.closest('[data-sp-del]'); if (b) { Sponsor.files.splice(Number(b.dataset.spDel), 1); Sponsor.render(); } });
$('#spSend').addEventListener('click', () => Sponsor.send());
$('#spCancel').addEventListener('click', () => Sponsor.close());

// ---------- a message to everyone (with an optional fundraiser) ----------
const rub = (n) => `${Math.round(n).toLocaleString('ru-RU')} ₽`;
const Announce = {
  a: null,
  set(a) {
    this.a = a || null;
    this.renderAdmin();
    const seen = store.get('annSeen', '');
    if (!this.a) return $('#annModal').classList.add('hidden');
    // Only inside the app: wait until the person has signed in and the profile is loaded.
    if (!S.me) { clearTimeout(this.wait); this.wait = setTimeout(() => this.set(this.a), 1000); return; }
    // Shown once per text; the owner who wrote it does not need the window.
    if (seen !== this.a.id && S.me?.role !== 'owner') this.show();
    else if (!$('#annModal').classList.contains('hidden')) this.show();
  },
  show() {
    const a = this.a;
    if (!a) return;
    $('#annTitle').textContent = a.title;
    $('#annText').textContent = a.text;
    $('#annGoal').classList.toggle('hidden', !a.goal);
    if (a.goal) {
      $('#annBar').style.width = `${Math.min(100, (100 * a.raised) / a.goal)}%`;
      $('#annSum').textContent = `Собрано ${rub(a.raised)} из ${rub(a.goal)}`;
    }
    $('#annLink').classList.toggle('hidden', !a.link);
    if (a.link) { $('#annLink').href = a.link; $('#annLink').textContent = a.button || 'Открыть'; }
    $('#annModal').classList.remove('hidden');
  },
  renderAdmin() {
    const owner = S.me?.role === 'owner';
    $('#annBox').classList.toggle('hidden', !owner);
    if (!owner) return;
    const a = this.a;
    $('#annState').textContent = a ? `Показано всем: «${a.text.slice(0, 60)}${a.text.length > 60 ? '…' : ''}»${a.goal ? ` · ${rub(a.raised)} из ${rub(a.goal)}` : ''}` : 'Нет. Можно написать всем, например объявить сбор на сервер.';
    $('#annEdit').textContent = a ? 'Изменить…' : 'Написать всем…';
    $('#annOff').classList.toggle('hidden', !a);
  },
};
$('#annOk').addEventListener('click', () => { if (Announce.a) store.set('annSeen', Announce.a.id); $('#annModal').classList.add('hidden'); });
$('#annLink').addEventListener('click', () => { if (Announce.a) store.set('annSeen', Announce.a.id); $('#annModal').classList.add('hidden'); });
$('#annEdit').addEventListener('click', async () => {
  const a = Announce.a || {};
  const r = await ask({ title: 'Сообщение всем', text: 'Его увидят все: кто в сети — сразу, остальные — когда зайдут. Для сбора укажите цель и ссылку, куда переводить; собранное потом меняйте здесь же.', ok: 'Отправить всем',
    fields: [{ name: 'title', label: 'Заголовок', value: a.title || '', placeholder: 'Сообщение от Ethic', max: 100 },
      { name: 'text', label: 'Текст', value: a.text || '', max: 2000 },
      { name: 'goal', label: 'Цель сбора, ₽ (пусто — без сбора)', value: a.goal ? String(a.goal) : '' },
      { name: 'raised', label: 'Уже собрано, ₽', value: a.raised ? String(a.raised) : '' },
      { name: 'link', label: 'Ссылка (https://…) — куда переводить', value: a.link || '', max: 500 },
      { name: 'button', label: 'Надпись на кнопке', value: a.button || '', placeholder: 'Поддержать', max: 40 }] });
  if (!r) return;
  if (!String(r.text || '').trim()) return toast('Напишите текст');
  try { Announce.set((await api('/api/admin/announcement', { method: 'POST', body: r })).announcement); toast('Отправлено всем'); } catch (err) { toast(err.message); }
});
$('#annOff').addEventListener('click', async () => {
  if (!confirm('Убрать сообщение у всех?')) return;
  try { Announce.set((await api('/api/admin/announcement', { method: 'POST', body: { text: '' } })).announcement); toast('Убрано'); } catch (err) { toast(err.message); }
});

function showEnded({ accountState, reason, until }) {
  S.ended = true;
  if (call) leaveCall();
  S.ws?.close();
  $('#endedTitle').textContent = accountState === 'deleted' ? 'Аккаунт удалён' : 'Аккаунт заблокирован';
  $('#endedReason').textContent = reason ? `Причина: ${reason}` : 'Причина не указана';
  $('#endedUntil').textContent = until ? `Блокировка до ${fmtDate(until)}` : '';
  $('#auth').classList.add('hidden');
  $('#endedScreen').classList.remove('hidden');
}
$('#endedLogout').addEventListener('click', () => { store.del('token'); location.reload(); });

// ---------- warnings ----------
// One at a time, each until «Понятно»; the ones missed while offline come at the next start.
const warnings = [];
function queueWarnings(list) {
  for (const w of list || []) if (!warnings.some((x) => x.id === w.id)) warnings.push(w);
  showWarning();
}
function showWarning() {
  const w = warnings[0];
  $('#warnScreen').classList.toggle('hidden', !w);
  if (!w) return;
  $('#warnReason').textContent = w.reason ? `Причина: ${w.reason}` : 'Причина не указана';
  $('#warnLeft').textContent = warnLeftText(w.left);
}
function warnLeftText(left) {
  if (!left) return '';
  return `Ещё ${left} ${left === 1 ? 'предупреждение' : 'предупреждения'} — и аккаунт будет заблокирован`;
}
$('#warnOk').addEventListener('click', () => {
  const w = warnings.shift();
  if (w) api(`/api/warnings/${w.id}/seen`, { method: 'POST' }).catch(() => {});
  showWarning();
});
$('#inviteCopy').addEventListener('click', async () => {
  const code = $('#adminInvite').dataset.code;
  if (!code) return toast('Код не требуется');
  try { await navigator.clipboard.writeText(`${PUBLIC_ORIGIN}\nКод приглашения: ${code}`); toast('Ссылка и код скопированы'); } catch { toast(code); }
});
$('#inviteNew').addEventListener('click', async () => {
  if (!confirm('Создать новый код? Старый перестанет работать для новых регистраций.')) return;
  try { await api('/api/admin/invite', { method: 'POST', body: {} }); await loadAdmin(); } catch (err) { toast(err.message); }
});
$('#inviteOff').addEventListener('click', async () => {
  if (!confirm('Открыть регистрацию для всех без кода?')) return;
  try { await api('/api/admin/invite', { method: 'POST', body: { code: '' } }); await loadAdmin(); } catch (err) { toast(err.message); }
});

// ---------- incoming call ----------
let incoming = null;
function onRing(ev) {
  if (call) return; // already busy
  incoming = { ...ev, timer: setTimeout(hideIncoming, 45_000) };
  rememberUsers([ev.from]);
  const chat = S.chats.get(ev.chatId);
  $('#incomingAvatar').innerHTML = isGroupish(chat) ? groupAvatar(chat, 'pulse') : avatarOf(ev.from, 'pulse');
  $('#incomingName').innerHTML = isGroupish(chat) ? esc(chat.title)
    : ev.invite && ev.title ? esc(ev.title) : `${nameHtml(ev.from, ev.from.displayName)}${checkOf(ev.from)}`;
  $('#incomingKind').textContent = ev.invite ? `${ev.from.displayName} зовёт вас в звонок`
    : (isGroupish(chat) ? `${ev.from.displayName} · ` : '') + (ev.video ? 'Входящий видеозвонок…' : 'Входящий звонок…');
  $('#incoming').classList.remove('hidden');
  Sound.ring(chatSound(ev.chatId).ring || undefined);
  notify('Ethic Messenger', `${ev.from.displayName}: ${ev.video ? 'видеозвонок' : 'звонок'}`, ev.chatId);
}
function hideIncoming() {
  if (incoming) clearTimeout(incoming.timer);
  incoming = null;
  Sound.stop();
  $('#incoming').classList.add('hidden');
}
$('#declineBtn').addEventListener('click', () => {
  if (incoming) wsSend({ type: 'call:decline', chatId: incoming.chatId });
  hideIncoming();
});
function acceptCall(video) {
  const ev = incoming;
  hideIncoming();
  if (!ev) return;
  // Invited guests may not be members of the chat: then there is no chat to open.
  if (S.chats.has(ev.chatId)) openChat(ev.chatId);
  startCall(ev.chatId, video, ev.title || ev.from?.displayName);
}
$('#acceptAudioBtn').addEventListener('click', () => acceptCall(false));
$('#acceptVideoBtn').addEventListener('click', () => acceptCall(true));
$('#addToCallBtn').addEventListener('click', () => openGroupModal('invite'));

// ---------- calls ----------
let call = null; // { chatId, room, startedAt, timer, tiles: Map }
const canScreenShare = !!navigator.mediaDevices?.getDisplayMedia;
if (!canScreenShare) $('#screenBtn').classList.add('hidden');

$('#audioCallBtn').addEventListener('click', () => S.active && startCall(S.active, false));
$('#videoCallBtn').addEventListener('click', () => S.active && startCall(S.active, true));
$('#joinCallBtn').addEventListener('click', () => S.active && startCall(S.active, false));
$('#callMinBtn').addEventListener('click', () => { $('#call').classList.add('hidden'); $('#callPill').classList.remove('hidden'); });
$('#callPill').addEventListener('click', () => { $('#call').classList.remove('hidden'); $('#callPill').classList.add('hidden'); });
$('#leaveBtn').addEventListener('click', () => leaveCall());
$('#enableAudioBtn').addEventListener('click', async () => { await call?.room.startAudio(); $('#enableAudioBtn').classList.add('hidden'); });

$('#micBtn').addEventListener('click', async () => {
  if (!call) return;
  const lp = call.room.localParticipant;
  try { await lp.setMicrophoneEnabled(!lp.isMicrophoneEnabled); } catch (e) { toast(mediaError(e, 'микрофону')); }
  renderControls(); renderTiles();
});
$('#camBtn').addEventListener('click', async () => {
  if (!call) return;
  const lp = call.room.localParticipant;
  try { await lp.setCameraEnabled(!lp.isCameraEnabled); } catch (e) { toast(mediaError(e, 'камере')); }
  renderControls(); renderTiles();
});
$('#screenBtn').addEventListener('click', async () => {
  if (!call) return;
  const lp = call.room.localParticipant;
  try { await lp.setScreenShareEnabled(!lp.isScreenShareEnabled, { audio: true, selfBrowserSurface: 'exclude' }); }
  catch (e) { if (e?.name !== 'NotAllowedError') toast('Не удалось начать демонстрацию экрана'); }
  renderControls(); renderTiles();
});

function mediaError(e, what) {
  console.error(e);
  if (e?.name === 'NotAllowedError') return `Нет доступа к ${what}: нажмите на замок слева от адреса и разрешите доступ, затем попробуйте снова`;
  if (e?.name === 'NotFoundError' || e?.name === 'OverconstrainedError') return `Устройство не найдено (${what}). Проверьте подключение или выберите другое в настройках`;
  if (e?.name === 'NotReadableError' || e?.name === 'AbortError') return `Устройство занято другой программой (${what}). Закройте её или другой браузер с этим звонком`;
  return `Ошибка доступа к ${what}: ${e?.name || ''} ${e?.message || ''}`.trim();
}

async function startCall(chatId, video, fallbackTitle, opts = {}) {
  if (call) {
    if (call.chatId === chatId) { $('#callPill').click(); return; }
    return toast('Сначала завершите текущий звонок');
  }
  const chat = S.chats.get(chatId);
  let creds;
  try { creds = await api(`/api/chats/${chatId}/call`, { method: 'POST', body: { video, room: !!opts.room } }); }
  catch (err) { return toast(err.message); }

  const dev = (key) => store.get(key, '') || undefined;
  // adaptiveStream pauses video that was attached to a not-yet-visible element; calls are small, so keep it off.
  const room = new LK.Room({
    adaptiveStream: false,
    dynacast: true,
    audioCaptureDefaults: { ...NS.constraints(), deviceId: dev('mic') },
    videoCaptureDefaults: { deviceId: dev('cam') },
    audioOutput: canPickSpeaker && dev('speaker') ? { deviceId: dev('speaker') } : undefined,
  });
  call = { chatId, room, startedAt: null, timer: null, tiles: new Map() };
  $('#callIcon').innerHTML = isGroupish(chat) ? I.speaker : I.at;
  $('#callTitle').innerHTML = chat ? (isGroupish(chat) ? esc(chat.title) : `<span>${esc(chatName(chat))}</span>${chatCheck(chat)}`) : esc(fallbackTitle || 'Звонок');
  $('#callTimer').textContent = 'Подключение…';
  $('#grid').innerHTML = '';
  $('#call').classList.remove('hidden');
  $('#callPill').classList.add('hidden');
  renderCallBanner();

  const E = LK.RoomEvent;
  const rerender = () => { renderTiles(); renderControls(); };
  room
    .on(E.ParticipantConnected, () => { Sound.stop(); Sound.join(); rerender(); })
    .on(E.ParticipantDisconnected, () => { Sound.leave(); rerender(); })
    .on(E.TrackSubscribed, (track) => {
      if (track.kind === 'audio') $('#audioSink').append(track.attach());
      rerender();
    })
    .on(E.TrackUnsubscribed, (track) => {
      if (track.kind === 'audio') track.detach().forEach((el) => el.remove());
      rerender();
    })
    .on(E.TrackMuted, rerender)
    .on(E.TrackUnmuted, rerender)
    .on(E.LocalTrackPublished, rerender)
    .on(E.LocalTrackUnpublished, rerender)
    .on(E.ActiveSpeakersChanged, renderTiles)
    .on(E.AudioPlaybackStatusChanged, () => $('#enableAudioBtn').classList.toggle('hidden', room.canPlaybackAudio))
    .on(E.Reconnecting, () => { $('#callTimer').textContent = 'Переподключение…'; })
    .on(E.Reconnected, () => tickTimer())
    .on(E.Disconnected, () => { if (call?.room === room) leaveCall(true); });

  try {
    await room.connect(creds.url, creds.token);
  } catch (err) {
    console.error(err);
    toast('Не удалось подключиться к звонку');
    return leaveCall(true);
  }
  wsSend({ type: 'call:join', chatId });
  call.startedAt = Date.now();
  call.timer = setInterval(tickTimer, 1000);
  tickTimer();
  room.startAudio().catch(() => {});
  Sound.join();
  // Ringback while we're the only one in the room.
  if (room.remoteParticipants.size === 0) {
    setTimeout(() => { if (call?.room === room && room.remoteParticipants.size === 0) Sound.ringback(); }, 600);
    setTimeout(() => { if (call?.room === room && room.remoteParticipants.size === 0) Sound.stop(); }, 60_000);
  }

  await publishMic(room);
  if (video) { try { await room.localParticipant.setCameraEnabled(true); } catch (e) { toast(mediaError(e, 'камере')); } }
  rerender();
}

// Standard/off: LiveKit captures the mic itself. Strong: we capture, run RNNoise and publish the cleaned track.
async function publishMic(room) {
  const lp = room.localParticipant;
  if (NS.mode() !== 'strong') {
    try { await lp.setMicrophoneEnabled(true, { ...NS.constraints(), deviceId: store.get('mic', '') || undefined }); }
    catch (e) { toast(mediaError(e, 'микрофону')); }
    return;
  }
  let mic;
  try { mic = await NS.micStream(); } catch (e) { return toast(mediaError(e, 'микрофону')); }
  try {
    const track = new LK.LocalAudioTrack(mic.stream.getAudioTracks()[0], undefined, true);
    await lp.publishTrack(track, { source: LK.Track.Source.Microphone, dtx: true, red: true });
    if (call?.room === room) call.mic = mic; else mic.stop();
  } catch (e) {
    console.error(e);
    mic.stop();
    toast('Сильное шумоподавление не включилось, используется стандартное');
    await lp.setMicrophoneEnabled(true, NS.constraints()).catch(() => {});
  }
}
async function republishMic() {
  if (!call) return;
  const lp = call.room.localParticipant;
  const pub = lp.getTrackPublication(LK.Track.Source.Microphone);
  const wasMuted = !!pub?.isMuted;
  if (pub?.track) await lp.unpublishTrack(pub.track, true).catch(() => {});
  call.mic?.stop();
  call.mic = null;
  await publishMic(call.room);
  if (wasMuted) await lp.setMicrophoneEnabled(false).catch(() => {});
  renderControls(); renderTiles();
}

function tickTimer() {
  if (!call?.startedAt) return;
  const s = Math.floor((Date.now() - call.startedAt) / 1000);
  const n = call.room.remoteParticipants.size;
  $('#callTimer').textContent = `${Math.floor(s / 60)}:${pad(s % 60)}` + (n ? ` · ${n + 1} участн.` : ' · ожидание собеседника…');
}

function leaveCall(fromDisconnect = false) {
  if (!call) return;
  const c = call;
  call = null;
  Sound.stop();
  Sound.leave();
  clearInterval(c.timer);
  wsSend({ type: 'call:leave', chatId: c.chatId });
  if (!fromDisconnect) c.room.disconnect();
  c.mic?.stop();
  for (const el of c.tiles.values()) el._track?.detach();
  $('#audioSink').innerHTML = '';
  $('#grid').innerHTML = '';
  $('#grid').style.gridTemplateRows = '';
  $('#call').classList.add('hidden');
  $('#callPill').classList.add('hidden');
  $('#enableAudioBtn').classList.add('hidden');
  renderCallBanner();
  if (S.reloadAfterCall) setTimeout(() => location.reload(), 600);
}

function renderControls() {
  if (!call) return;
  const lp = call.room.localParticipant;
  const mic = lp.isMicrophoneEnabled, cam = lp.isCameraEnabled, scr = lp.isScreenShareEnabled;
  $('#micBtn').innerHTML = mic ? I.mic : I.micOff;
  $('#micBtn').className = `ctrl ${mic ? '' : 'off'}`;
  $('#camBtn').innerHTML = cam ? I.video : I.videoOff;
  $('#camBtn').className = `ctrl ${cam ? '' : 'off'}`;
  $('#screenBtn').className = `ctrl ${scr ? 'on' : ''}${canScreenShare ? '' : ' hidden'}`;
  $('#screenBtn').title = scr ? 'Остановить демонстрацию' : 'Демонстрация экрана';
}

function renderTiles() {
  if (!call) return;
  const { room, tiles } = call;
  const Src = LK.Track.Source;
  const people = [room.localParticipant, ...room.remoteParticipants.values()];
  const wanted = new Map();
  for (const p of people) {
    const scr = p.getTrackPublication(Src.ScreenShare);
    if (scr?.track && !scr.isMuted) wanted.set(`${p.identity}:screen`, { p, track: scr.track, screen: true });
    const cam = p.getTrackPublication(Src.Camera);
    wanted.set(`${p.identity}:cam`, { p, track: cam?.track && !cam.isMuted ? cam.track : null, screen: false });
  }
  for (const [key, el] of tiles) {
    if (!wanted.has(key)) { el._track?.detach(); el.remove(); tiles.delete(key); }
  }
  const grid = $('#grid');
  const speaking = new Set(room.activeSpeakers.map((p) => p.identity));
  for (const [key, w] of wanted) {
    let el = tiles.get(key);
    const isLocal = w.p === room.localParticipant;
    const uid = Number(w.p.identity) || 0;
    const name = isLocal ? `${S.me.displayName} (вы)` : (w.p.name || userName(uid));
    if (!el) {
      el = document.createElement('div');
      el.className = 'tile';
      el.innerHTML = `<video autoplay playsinline muted></video>${avatarOf({ id: uid, displayName: w.p.name || name })}<div class="label"></div>`;
      el.addEventListener('dblclick', () => (document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen?.()));
      tiles.set(key, el);
      // Screen shares go first so they take the large slot.
      if (w.screen) grid.prepend(el); else grid.append(el);
    }
    el.classList.toggle('screen', w.screen);
    el.classList.toggle('mirror', isLocal && !w.screen);
    el.classList.toggle('speaking', !w.screen && speaking.has(w.p.identity));
    const video = el.querySelector('video');
    el.classList.toggle('has-video', !!w.track);
    if (w.track !== el._track) {
      el._track?.detach(video);
      if (w.track) w.track.attach(video);
      el._track = w.track;
    }
    const micOff = !w.screen && !w.p.isMicrophoneEnabled;
    el.querySelector('.label').innerHTML = `${micOff ? I.micOff : ''}${esc(w.screen ? `Экран: ${name}` : name)}`;
  }
  grid.dataset.count = String(tiles.size);
  // The first screen share becomes the big tile; any other tiles go to the side column.
  const main = [...tiles.entries()].find(([key]) => key.endsWith(':screen'))?.[1];
  for (const el of tiles.values()) el.classList.toggle('main', el === main);
  grid.classList.toggle('presenting', !!main);
  if (main) {
    if (grid.firstChild !== main) grid.prepend(main);
    grid.style.gridTemplateRows = `repeat(${Math.max(tiles.size - 1, 1)}, minmax(0, 170px)) 1fr`;
  } else {
    grid.style.gridTemplateRows = '';
  }
  tickTimer();
}

// ---------- support tickets ----------
// Everyone can write to support; staff (people with the admin panel) answer and close tickets.
const TK_CAT = { bug: 'Ошибка', question: 'Вопрос', idea: 'Предложение', complaint: 'Жалоба', other: 'Другое', sponsor: 'Спонсор' };
const tkWhen = (ms) => new Date(ms).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
function tkStatus(t) {
  if (t.status === 'closed') return '<span class="tk-status closed">Закрыто</span>';
  return t.awaitingStaff ? '<span class="tk-status wait">Ждёт ответа</span>' : '<span class="tk-status open">Есть ответ</span>';
}
const Tickets = {
  staff: false, current: null, list: [], count: 0,
  open(staff) {
    this.staff = staff;
    $('#ticketsModal').classList.remove('hidden');
    this.showList();
  },
  get visible() { return !$('#ticketsModal').classList.contains('hidden'); },
  head(title, back) {
    $('#ticketsTitle').textContent = title;
    $('#ticketsBack').classList.toggle('hidden', !back);
  },
  async showList() {
    this.current = null;
    this.head(this.staff ? 'Обращения пользователей' : 'Поддержка', false);
    $('#ticketsBody').innerHTML = `<div class="tk-bar">
        <span style="flex:1"></span>
        ${this.staff ? '' : '<button class="btn primary" id="tkNew">Новое обращение</button>'}
      </div>
      <div id="tkList" class="tk-thread"><div class="side-empty">Загрузка…</div></div>`;
    try {
      const data = await api(`/api/tickets${this.staff ? '?all=1' : ''}`);
      this.list = data.tickets;
      if (data.open !== undefined) this.setCount(data.open);
      this.renderList();
    } catch (err) { toast(err.message); }
  },
  renderList() {
    const el = $('#tkList');
    if (!el) return;
    const empty = this.staff ? 'Обращений нет' : 'У вас пока нет обращений. Опишите проблему — мы ответим здесь же.';
    el.innerHTML = this.list.map((t) => `<div class="tk-row" data-tk="${t.id}">
        ${this.staff ? avatarOf(t.user, '', false) : ''}
        <div class="tk-main">
          <div class="tk-title">#${t.id} · ${esc(t.title)}</div>
          <div class="tk-sub">${esc(TK_CAT[t.category] || 'Другое')}${this.staff ? ` · ${esc(t.user?.displayName || '')}` : ''} · ${tkWhen(t.updatedAt)}</div>
        </div>
        ${tkStatus(t)}
      </div>`).join('') || `<div class="side-empty">${empty}</div>`;
  },
  showNew() {
    this.current = null;
    this.head('Новое обращение', true);
    const cats = Object.entries(TK_CAT).filter(([v]) => v !== 'sponsor').map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
    $('#ticketsBody').innerHTML = `<form class="tk-form" id="tkForm">
        <label class="field-label">Тема<input name="title" maxlength="100" required placeholder="Коротко: что случилось"></label>
        <label class="field-label">Категория<select name="category">${cats}</select></label>
        <label class="field-label">Описание<textarea name="text" maxlength="4000" required placeholder="Подробно опишите проблему: что делали, что ожидали, что произошло. Укажите устройство и браузер."></textarea></label>
        <p class="error" id="tkError"></p>
        <div class="row" style="justify-content:flex-end"><button class="btn primary" type="submit">Отправить</button></div>
      </form>`;
    $('#tkForm').title.focus();
  },
  async create(form) {
    const f = Object.fromEntries(new FormData(form));
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true;
    try {
      const { ticket } = await api('/api/tickets', { method: 'POST', body: f });
      toast('Обращение отправлено');
      this.showTicket(ticket.id);
    } catch (err) { $('#tkError').textContent = err.message; btn.disabled = false; }
  },
  async showTicket(id) {
    this.head(`Обращение #${id}`, true);
    $('#ticketsBody').innerHTML = '<div class="side-empty">Загрузка…</div>';
    try {
      const { ticket, messages } = await api(`/api/tickets/${id}`);
      this.current = { ticket, messages };
      this.renderTicket();
    } catch (err) { toast(err.message); this.showList(); }
  },
  renderTicket() {
    const { ticket: t, messages } = this.current;
    $('#ticketsBody').innerHTML = `
      <div class="tk-bar">
        <div class="tk-main" style="flex:1;min-width:0">
          <div class="tk-title" style="font-size:18px">${esc(t.title)}</div>
          <div class="tk-sub muted small">${esc(TK_CAT[t.category] || 'Другое')} · ${esc(t.user?.displayName || '')} · ${tkWhen(t.createdAt)}</div>
        </div>
        ${tkStatus(t)}
        ${t.category === 'sponsor' && S.me.role === 'owner' ? '<button class="btn small primary" id="tkGrant">Выдать подписку</button>' : ''}
        <button class="btn small" id="tkToggle">Закрыть</button>
      </div>
      <div class="tk-thread" id="tkThread">${messages.map((m) => this.msgHtml(m, t)).join('')}</div>
      <form class="tk-reply" id="tkReply">
        <textarea name="text" maxlength="4000" placeholder="Ответ…"></textarea>
        <button class="btn primary" type="submit">Отправить</button>
      </form>`;
    const th = $('#tkThread');
    th.scrollTop = th.scrollHeight;
  },
  msgHtml(m, t) {
    const staffMsg = m.userId !== t.user?.id;
    const who = staffMsg ? `${esc(m.user?.displayName || 'Поддержка')} · поддержка` : esc(m.user?.displayName || '');
    const pics = (m.images || []).length ? `<div class="tk-pics">${m.images.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt="Скриншот" loading="lazy"></a>`).join('')}</div>` : '';
    return `<div class="tk-msg ${staffMsg ? 'staff' : ''}"><div class="tk-who">${who}</div>${esc(m.text)}${pics}<div class="tk-time">${tkWhen(m.createdAt)}</div></div>`;
  },
  async reply(form) {
    const text = form.text.value.trim();
    if (!text || !this.current) return;
    form.text.value = '';
    try {
      await api(`/api/tickets/${this.current.ticket.id}/messages`, { method: 'POST', body: { text } });
    } catch (err) { toast(err.message); form.text.value = text; }
  },
  async toggle() {
    const t = this.current?.ticket;
    if (!t) return;
    try { await api(`/api/tickets/${t.id}/status`, { method: 'POST', body: { status: 'closed' } }); this.showList(); }
    catch (err) { toast(err.message); }
  },
  // The owner checked the screenshots: Ethic+ for 30 days and the «Спонсор» label, the ticket closes.
  async grant(btn) {
    const t = this.current?.ticket;
    if (!t || !confirm(`Выдать ${t.user?.displayName || 'пользователю'} Ethic+ на 30 дней и надпись «Спонсор»?`)) return;
    btn.disabled = true;
    try {
      const r = await api(`/api/tickets/${t.id}/grant`, { method: 'POST' });
      toast(r.until ? `Выдано до ${fmtDate(r.until)}` : 'Надпись выдана, Ethic+ уже без срока');
      this.showList();
    } catch (err) { toast(err.message); btn.disabled = false; }
  },
  // Realtime: a ticket changed or got a message.
  onEvent(ev) {
    if (!this.visible) {
      if (ev.message && ev.message.userId !== S.me.id && ev.ticket.user?.id === S.me.id) toast(`Поддержка ответила: «${ev.ticket.title}»`);
      return;
    }
    if (this.current?.ticket.id === ev.ticket.id) {
      if (ev.ticket.status === 'closed') { this.showList(); return; }
      this.current.ticket = ev.ticket;
      if (ev.message && !this.current.messages.some((m) => m.id === ev.message.id)) this.current.messages.push(ev.message);
      const draft = $('#tkReply')?.text.value || '';
      this.renderTicket();
      if ($('#tkReply')) $('#tkReply').text.value = draft;
    } else if (!this.current && $('#tkList')) {
      const i = this.list.findIndex((t) => t.id === ev.ticket.id);
      const fits = ev.ticket.status !== 'closed';
      if (i >= 0) { if (fits) this.list[i] = ev.ticket; else this.list.splice(i, 1); }
      else if (fits && (this.staff || ev.ticket.user?.id === S.me.id)) this.list.unshift(ev.ticket);
      this.list.sort((a, b) => b.updatedAt - a.updatedAt);
      this.renderList();
    }
  },
  setCount(n) {
    this.count = n;
    const hb = $('#ticketsHeadBadge');
    if (hb) { hb.textContent = n > 99 ? '99+' : String(n); hb.classList.toggle('hidden', !n); }
    const b = $('#ticketsBadge');
    b.textContent = n > 99 ? '99+' : String(n);
    b.classList.toggle('hidden', !n);
  },
};
setIcon('#ticketsBtn', 'support'); setIcon('#ticketsBack', 'back'); setIcon('#ticketsClose', 'x');
$('#ticketsBtn').addEventListener('click', () => Tickets.open(true));
$('#requestBar').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-req]');
  if (!b || !S.active) return;
  const id = S.active;
  b.disabled = true;
  try {
    if (b.dataset.req === 'accept') { const { chat } = await api(`/api/chats/${id}/accept`, { method: 'POST' }); upsertChat(chat); renderRequestBar(); toast('Заявка принята'); }
    else await api(`/api/chats/${id}/decline`, { method: 'POST' });
  } catch (err) { toast(err.message); b.disabled = false; }
});
$('#supportTab').addEventListener('click', () => { closeSettings(); Tickets.open(false); });
$('#ticketsBack').addEventListener('click', () => Tickets.showList());
$('#ticketsBody').addEventListener('click', (e) => {
  const row = e.target.closest('[data-tk]');
  if (row) return Tickets.showTicket(Number(row.dataset.tk));
  if (e.target.closest('#tkNew')) return Tickets.showNew();
  if (e.target.closest('#tkToggle')) return Tickets.toggle();
  if (e.target.closest('#tkGrant')) return Tickets.grant(e.target.closest('#tkGrant'));
});
$('#ticketsBody').addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.target.id === 'tkForm') Tickets.create(e.target);
  if (e.target.id === 'tkReply') Tickets.reply(e.target);
});
$('#ticketsBody').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && e.target.closest('#tkReply')) { e.preventDefault(); Tickets.reply($('#tkReply')); }
});

// ---------- Ethic+ subscription ----------
// Subscribers pick a nickname gradient and a video banner here; the owner grants the subscription here too.
const PLUS_STYLES = [['', 'Без градиента'], ['red', 'Красно-оранжевый'], ['blue', 'Сине-голубой'], ['purple', 'Фиолетово-синий']];
const VIDEO_BANNER_MAX = 25 * 1024 * 1024;
async function savePlus(body, okText) {
  const { user } = await api('/api/me', { method: 'PATCH', body });
  rememberUsers([user]);
  renderMe(); renderProfileForm(); renderNav();
  applyTheme();
  if (okText) toast(okText);
  renderPlus();
}
const PLUS_PERKS = [
  ['Градиентный ник', 'Имя переливается цветом в чатах, в списке участников и в профиле.'],
  ['Видео-баннер', 'Вместо картинки в шапке профиля играет ваше видео.'],
  ['Темы чатов', 'Оформление чатов, доступное только подписчикам.'],
  ['Свои стикеры', 'Любую картинку из чата можно сохранить и отправлять как стикер.'],
  ['Анимированная аватарка', 'GIF в профиле двигается у всех, кто на вас смотрит.'],
  ['Большие файлы', 'Фото, видео и файлы до 2 ГБ — вдвое больше обычного.'],
  ['Поддержка проекта', 'Ethic развивается без рекламы и без продажи ваших данных.'],
];
function renderPlus() {
  const me = S.me;
  const owner = me.role === 'owner';
  const hasVideo = isVideoBanner(me.banner);
  const mine = me.plus ? `
    <div class="plus-card">
      <div class="plus-title">✨ Ваша подписка активна</div>
      ${me.plusUntil ? `<div class="plus-until">Действует до ${fmtDate(me.plusUntil)}.</div>` : ''}
      <div class="field-label">Цвет ника</div>
      <div class="plus-preview">${nameHtml(me, me.displayName)}</div>
      <div class="plus-styles">${PLUS_STYLES.map(([v, label]) => `<button class="plus-style ${(me.nameStyle || '') === v ? 'active' : ''}" data-style="${v}"><span class="${v ? `grad-${v}` : ''}">${label}</span></button>`).join('')}</div>
      <div class="field-label" style="margin-top:18px">Тема чатов</div>
      <div class="theme-list">${THEMES.map(([v, label, bubble, bg]) => `<button class="theme-pick ${(me.theme || '') === v ? 'active' : ''}" data-theme-pick="${v}">
        <div class="swatch" style="background: radial-gradient(120% 90% at 50% 0%, ${bg} 0%, #000 80%)"><i style="background:${bubble}"></i></div><span>${label}</span></button>`).join('')}</div>
      <div class="field-label" style="margin-top:18px">Видео-баннер</div>
      <div class="plus-banner">${bannerVideo(me) || '<div class="muted small">Сейчас видео не загружено</div>'}</div>
      <div class="row">
        <button class="btn" id="plusVideoBtn">Загрузить видео</button>
        ${hasVideo ? '<button class="btn link danger-text" id="plusVideoRemove">Убрать видео</button>' : ''}
        <span class="muted small" id="plusVideoProgress">MP4 или WebM, до 25 МБ</span>
      </div>
      <input type="file" id="plusVideoInput" accept="video/mp4,video/webm" hidden>
    </div>` : `<div class="plus-card">
      <div class="plus-title">Ethic+</div>
      <div class="muted small">Подписка для тех, кто хочет выделяться. Вот что она даёт:</div>
      <ul class="plus-perks">${PLUS_PERKS.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ul>
      ${owner ? '<div class="muted small">Вы владелец: выдайте подписку себе в списке ниже.</div>'
      : ''}
      <div class="plus-hint">Если найдёте человека с толстовкой Ethic, отсканируйте QR-код на ней и получите подарок.</div>
    </div>`;
  const grant = owner ? `
    <div class="plus-card">
      <div class="plus-title">Выдача подписки</div>
      <input id="plusSearch" type="search" placeholder="Поиск пользователя" autocomplete="off">
      <div id="plusUsers" class="plus-users"><div class="side-empty">Загрузка…</div></div>
    </div>` : '';
  $('#plusBody').innerHTML = mine + grant;
  if (owner) loadPlusUsers('');
}
let plusTimer;
async function loadPlusUsers(term) {
  try {
    const { users } = await api(`/api/admin/users?q=${encodeURIComponent(term)}`);
    const el = $('#plusUsers');
    if (!el) return;
    el.innerHTML = users.filter((u) => !u.username.startsWith('deleted_')).map((u) => `<div class="plus-user" data-id="${u.id}">
        ${avatarOf(u, 'sm', true)}
        <div class="plus-user-name"><div>${nameHtml(u, u.displayName)}${u.plus ? PLUS_BADGE : ''}</div><div class="small muted">ID ${u.id} · @${esc(u.username)}</div></div>
        <button class="btn small ${u.plus ? '' : 'primary'}" data-plus="${u.plus ? 0 : 1}">${u.plus ? 'Забрать' : 'Выдать'}</button>
      </div>`).join('') || '<div class="side-empty">Никого не найдено</div>';
  } catch (err) { toast(err.message); }
}
$('#plusBody').addEventListener('input', (e) => {
  if (e.target.id !== 'plusSearch') return;
  clearTimeout(plusTimer);
  plusTimer = setTimeout(() => loadPlusUsers(e.target.value.trim()), 250);
});
$('#plusBody').addEventListener('click', async (e) => {
  const style = e.target.closest('[data-style]');
  try {
    if (style) return await savePlus({ nameStyle: style.dataset.style || null }, 'Цвет ника изменён');
    const theme = e.target.closest('[data-theme-pick]');
    if (theme) return await savePlus({ theme: theme.dataset.themePick || null }, 'Тема изменена');
    if (e.target.closest('#plusVideoBtn')) return $('#plusVideoInput').click();
    if (e.target.closest('#plusVideoRemove')) return await savePlus({ banner: null }, 'Видео убрано');
    const b = e.target.closest('[data-plus]');
    if (!b) return;
    const id = b.closest('[data-id]').dataset.id;
    const on = b.dataset.plus === '1';
    if (!on && !confirm('Забрать подписку? Градиент ника и видео-баннер снимутся.')) return;
    b.disabled = true;
    await api(`/api/admin/users/${id}/plus`, { method: 'POST', body: { plus: on } });
    toast(on ? 'Подписка выдана' : 'Подписка забрана');
    if (Number(id) === S.me.id) { const { user } = await api('/api/me'); rememberUsers([user]); renderMe(); renderPlus(); }
    else loadPlusUsers($('#plusSearch')?.value.trim() || '');
  } catch (err) { toast(err.message); }
});
$('#plusBody').addEventListener('change', async (e) => {
  if (e.target.id !== 'plusVideoInput') return;
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  if (file.size > VIDEO_BANNER_MAX) return toast('Видео больше 25 МБ');
  const note = $('#plusVideoProgress');
  try {
    const r = await upload(file, { kind: 'file', name: file.name, onProgress: (p) => { if (note) note.textContent = `Загрузка ${Math.round(p * 100)}%`; } });
    if (!['mp4', 'webm'].includes(r.ext)) throw new Error('Нужен файл MP4 или WebM');
    await savePlus({ banner: r.url }, 'Видео-баннер установлен');
  } catch (err) { toast(err.message); if (note) note.textContent = 'MP4 или WebM, до 25 МБ'; }
});

// ---------- gifts and Ethic Coin ----------
const COIN = '<span class="coin" title="Ethic Coin">E</span>';
const coinText = (n) => (n >= 999_999_999 ? '∞' : n.toLocaleString('ru-RU'));
const Shop = {
  coins: 0, gifts: [], to: '', owned: [], canBuild: false,
  async open() {
    try {
      const data = await api('/api/shop');
      this.coins = data.coins;
      this.gifts = data.gifts;
      this.canBuild = data.canBuild;
      this.render();
      if (data.offer && $('#giftModal').classList.contains('hidden')) this.askBuild();
    } catch (err) { toast(err.message); }
  },
  // Live update of an open shop; what the person is typing stays in place.
  refresh() {
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      if (!$('#shopBalance')) return;
      await this.open();
    }, 300);
  },
  setCoins(n) {
    this.coins = n;
    const el = $('#shopBalance');
    if (el) el.textContent = coinText(n);
  },
  render() {
    const cards = this.gifts.map((g) => {
      const out = g.left === 0;
      return `<div class="gift-card" data-gift="${esc(g.id)}">
        <img src="${esc(g.image)}" alt="" width="128" height="128">
        <div class="gift-info">
          <div class="plus-title">${esc(g.name)}</div>
          <div class="muted small">${esc(g.description)}</div>
          <div class="gift-left">${g.total === null ? 'Без ограничений' : out ? 'Распродано' : `Осталось ${g.left} из ${g.total}`}</div>
          <div class="gift-price">${COIN}${g.price.toLocaleString('ru-RU')}</div>
          ${g.owned ? '<div class="muted small">Этот подарок у вас уже был, второй себе не купить.</div>' : ''}
          ${out ? '' : `<div class="gift-buttons">
            ${g.owned ? '' : '<button class="btn primary" data-buy>Купить</button>'}
            <button class="btn ${g.owned ? 'primary' : ''}" data-gift-to>Подарить</button>
          </div>`}
        </div>
      </div>`;
    }).join('');
    const grant = S.me.role === 'owner' ? `<div class="plus-card">
        <div class="plus-title">Панель владельца</div>
        <div class="owner-buttons">
          <button type="button" class="btn primary" data-release>Выпустить подарок</button>
          <button type="button" class="btn" data-coins>Выдать Ethic Coin</button>
        </div>
      </div>` : '';
    $('#shopBody').innerHTML = `<div class="plus-card shop-balance"><span class="muted">Ваш баланс</span><b>${COIN}<span id="shopBalance">${coinText(this.coins)}</span></b></div>${this.canBuild ? `<div class="plus-card scooter-build">
        <img src="/gifts/scooter.png" alt="" width="220" height="220">
        <div class="plus-title">Все детали собраны</div>
        <div class="muted small">Семь подарков объединятся в один: самокат Ethic. Детали исчезнут из профиля.</div>
        <button class="btn primary" data-build>Собрать самокат</button>
      </div>` : ''}${cards}${grant}`;
  },
  async buy(card) {
    const g = this.gifts.find((x) => x.id === card.dataset.gift);
    if (!confirm(`Купить ${g.name} себе за ${g.price} Ethic Coin?`)) return;
    await this.purchase({ giftId: g.id });
  },
  async purchase(body) {
    const { coins, serial, gift } = await api('/api/shop/buy', { method: 'POST', body });
    this.coins = coins;
    this.gifts = this.gifts.map((x) => (x.id === gift.id ? gift : x));
    this.render();
    toast(serial > 0 ? `${gift.name} №${serial}: готово` : `${gift.name}: готово`);
  },
  openRelease() {
    $('#giftBody').innerHTML = `<form id="giftForm" class="gift-form">
        <div class="plus-title">Выпустить подарок</div>
        <label class="gift-photo" title="Выбрать фото">
          <img id="giftFormPreview" alt="" hidden>
          <span id="giftFormHint">Выбрать фото</span>
          <input name="file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden>
        </label>
        <label class="field-label">Название<input name="name" required maxlength="48" autocomplete="off"></label>
        <label class="field-label">Цена в Ethic Coin<input name="price" required type="number" min="0" max="1000000" step="1" value="500"></label>
        <label class="gift-check"><input name="limited" type="checkbox" checked> Лимитка</label>
        <label class="field-label" id="giftFormTotal">Сколько всего<input name="total" type="number" min="1" max="100000" step="1" value="20"></label>
        <div class="scooter-choice">
          <button type="button" class="btn" data-gift-close>Отмена</button>
          <button class="btn primary" type="submit">Выпустить</button>
        </div>
      </form>`;
    $('#giftModal').classList.remove('hidden');
  },
  async openCoins() {
    const { users } = await api('/api/admin/users?q=');
    rememberUsers(users);
    this.coinUsers = users.filter((u) => u.role !== 'owner');
    $('#giftBody').innerHTML = `<div class="gift-picker">
        <div class="plus-title">Выдать Ethic Coin</div>
        <div class="muted small">Укажите сумму и выберите, кому выдать. С минусом монеты спишутся.</div>
        <input id="coinAmount" type="number" step="1" min="-1000000" max="1000000" placeholder="Сколько монет" autocomplete="off">
        <input id="coinSearch" type="search" placeholder="Поиск" autocomplete="off">
        <div id="coinList" class="gift-picker-list"></div>
        <button type="button" class="btn wide" data-gift-close>Закрыть</button>
      </div>`;
    this.renderCoins('');
    $('#giftModal').classList.remove('hidden');
    $('#coinAmount').focus();
  },
  renderCoins(term) {
    const t = term.trim().replace(/^@/, '').toLowerCase();
    const list = this.coinUsers.filter((u) => !t || u.username.toLowerCase().includes(t) || u.displayName.toLowerCase().includes(t));
    $('#coinList').innerHTML = list.map((u) => `<div class="plus-user">
        ${avatarOf(u, 'sm', true)}
        <div class="plus-user-name"><div>${nameHtml(u, u.displayName)}${checkOf(u)}</div><div class="small muted">@${esc(u.username)} · ${COIN}${(u.coins || 0).toLocaleString('ru-RU')}</div></div>
        <button type="button" class="btn small primary" data-grant="${esc(u.username)}">Выдать</button>
      </div>`).join('') || '<div class="side-empty">Никого не найдено</div>';
  },
  async grant(username) {
    const amount = Number($('#coinAmount').value);
    if (!Number.isInteger(amount) || !amount) { toast('Укажите целое число монет'); $('#coinAmount').focus(); return; }
    const r = await api('/api/admin/coins', { method: 'POST', body: { username, amount } });
    const u = this.coinUsers.find((x) => x.username === r.username);
    if (u) u.coins = r.coins;
    this.renderCoins($('#coinSearch').value);
    toast(`Баланс @${r.username}: ${r.coins.toLocaleString('ru-RU')} Ethic Coin`);
  },
  // «Подарить»: friends who accepted the request; the owner sees everyone. Who already had this gift cannot get it.
  async openGiftTo(giftId) {
    const g = this.gifts.find((x) => x.id === giftId);
    const { users } = await api(`/api/shop/recipients?giftId=${encodeURIComponent(giftId)}`);
    rememberUsers(users);
    const first = this.to.toLowerCase();
    this.to = '';
    this.picker = { gift: g, users: users.sort((a, b) => (b.username.toLowerCase() === first) - (a.username.toLowerCase() === first)) };
    $('#giftBody').innerHTML = `<div class="gift-picker">
        <div class="plus-title">Подарить ${esc(g.name)}</div>
        <div class="muted small">${g.price} Ethic Coin. Выберите, кому подарить.</div>
        <input id="pickerSearch" type="search" placeholder="Поиск" autocomplete="off">
        <input id="pickerNote" placeholder="Подпись, необязательно" maxlength="120" autocomplete="off">
        <div id="pickerList" class="gift-picker-list"></div>
        <button type="button" class="btn wide" data-gift-close>Отмена</button>
      </div>`;
    this.renderPicker('');
    $('#giftModal').classList.remove('hidden');
  },
  renderPicker(term) {
    const t = term.trim().replace(/^@/, '').toLowerCase();
    const list = this.picker.users.filter((u) => !t || u.username.toLowerCase().includes(t) || u.displayName.toLowerCase().includes(t));
    $('#pickerList').innerHTML = list.map((u) => `<div class="plus-user">
        ${avatarOf(u, 'sm', true)}
        <div class="plus-user-name"><div>${nameHtml(u, u.displayName)}${checkOf(u)}</div><div class="small muted">@${esc(u.username)}</div></div>
        ${u.has ? '<span class="small muted">уже есть</span>' : `<button type="button" class="btn small primary" data-pick="${esc(u.username)}">Подарить</button>`}
      </div>`).join('') || `<div class="side-empty">${this.picker.users.length ? 'Никого не найдено' : 'Пока некому дарить. Друг появится здесь, когда примет заявку.'}</div>`;
  },
  // After signing in: the set may have been completed while this person was away.
  async checkOffer() {
    if (this.offerChecked) return;
    this.offerChecked = true;
    try { if ((await api('/api/shop')).offer) this.askBuild(); } catch {}
  },
  askBuild() {
    $('#giftBody').innerHTML = `<div class="gift-detail full">
        <img src="/gifts/scooter.png" alt="" width="160" height="160">
        <div class="plus-title">Вы собрали все запчасти</div>
        <div class="muted small">Собрать самокат? Семь деталей объединятся в один подарок и исчезнут из профиля.</div>
        <div class="scooter-choice">
          <button type="button" class="btn" data-scooter-no>Нет</button>
          <button type="button" class="btn primary" data-scooter-yes>Да</button>
        </div>
      </div>`;
    $('#giftModal').classList.remove('hidden');
  },
  async decline() {
    try { await api('/api/shop/decline', { method: 'POST' }); } catch (err) { return toast(err.message); }
    this.laterNote();
    if ($('#shopBalance')) this.open();
  },
  laterNote() {
    $('#giftBody').innerHTML = `<div class="gift-detail">
        <div class="plus-title">Хорошо, детали остаются у вас</div>
        <div class="muted small">Собрать самокат можно потом: Настройки → «Магазин подарков», кнопка «Собрать самокат».</div>
        <button type="button" class="btn primary wide" data-gift-close>Понятно</button>
      </div>`;
  },
  async build() {
    try {
      const { serial } = await api('/api/shop/build', { method: 'POST' });
      $('#giftModal').classList.add('hidden');
      this.playBuild(serial);
      if ($('#shopBalance')) this.open();
    } catch (err) { toast(err.message); $('#giftModal').classList.add('hidden'); }
  },
  // The parts fly to the middle of the screen, a flash, and the scooter appears.
  playBuild(serial) {
    const parts = ['pandemonium', 'atlas', 'dryade', 'merrow', 'sylphe', 'rubber', 'oracle'];
    const el = document.createElement('div');
    el.className = 'scooter-anim';
    el.innerHTML = `${parts.map((p, i) => {
      const a = (i / parts.length) * Math.PI * 2 - Math.PI / 2;
      return `<img class="scooter-part" src="/gifts/${p}.png" alt="" style="--x:${Math.round(Math.cos(a) * 38)}vmin;--y:${Math.round(Math.sin(a) * 38)}vmin;--d:${i * 70}ms">`;
    }).join('')}
      <div class="scooter-flash"></div>
      <div class="scooter-result">
        <img src="/gifts/scooter.png" alt="">
        <div class="scooter-name">Самокат Ethic</div>
        <div class="gift-left">${serial > 0 ? `№${serial} из 20` : 'Вне тиража'}</div>
        <button type="button" class="btn primary" data-scooter-done>Отлично</button>
      </div>`;
    el.addEventListener('click', (e) => { if (e.target.closest('[data-scooter-done]')) el.remove(); });
    document.body.append(el);
  },
  // In the profile, like Telegram: a grid with a ribbon on limited gifts; a tap opens the gift's card.
  async loadProfile(uid) {
    this.owned = [];
    try {
      const { gifts } = await api(`/api/users/${uid}/gifts`);
      if (Number($('#infoBody').dataset.user) !== uid) return;
      this.owned = gifts;
      this.renderProfile();
    } catch {}
  },
  renderProfile() {
    const el = $('#profileGifts');
    if (!el || !this.owned.length) return;
    el.innerHTML = `<hr><h4>Подарки <span class="muted">${this.owned.length}</span></h4><div class="profile-gifts">${this.owned.map((g) => `<button type="button" class="profile-gift ${g.giftId === 'scooter' ? 'full' : ''}" data-gift-cell="${g.id}" title="${esc(g.name)}">
        ${g.total && g.serial > 0 ? `<span class="gift-ribbon">${g.serial} из ${g.total}</span>` : ''}
        <img src="${esc(g.image)}" alt="${esc(g.name)}" width="72" height="72">
      </button>`).join('')}</div>`;
    el.classList.remove('hidden');
  },
  showGift(id) {
    const g = this.owned.find((x) => x.id === id);
    if (!g) return;
    const when = new Date(g.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    $('#giftBody').innerHTML = `<div class="gift-detail ${g.giftId === 'scooter' ? 'full' : ''}">
        <img src="${esc(g.image)}" alt="" width="160" height="160">
        <div class="plus-title">${esc(g.name)}</div>
        ${g.serial < 0 ? '<div class="gift-left">Вне тиража</div>' : g.total ? `<div class="gift-left">№${g.serial} из ${g.total}</div>` : ''}
        <div class="gift-rows">
          <div><span class="muted">От кого</span><button type="button" class="btn link" data-profile="${g.fromId}">${esc(g.fromName)}</button></div>
          <div><span class="muted">Дата</span><span>${when}</span></div>
        </div>
        ${g.note ? `<div class="gift-note-text">${esc(g.note)}</div>` : ''}
        <button type="button" class="btn primary wide" data-gift-close>Закрыть</button>
      </div>`;
    $('#giftModal').classList.remove('hidden');
  },
};
$('#giftModal').addEventListener('click', (e) => {
  if (e.target.closest('[data-scooter-yes]')) return Shop.build();
  if (e.target.closest('[data-scooter-no]')) return Shop.decline();
  const grant = e.target.closest('[data-grant]');
  if (grant) {
    grant.disabled = true;
    Shop.grant(grant.dataset.grant).catch((err) => toast(err.message)).finally(() => { if (grant.isConnected) grant.disabled = false; });
    return;
  }
  const pick = e.target.closest('[data-pick]');
  if (pick) {
    pick.disabled = true;
    const note = $('#pickerNote').value;
    Shop.purchase({ giftId: Shop.picker.gift.id, toUsername: pick.dataset.pick, note })
      .then(() => $('#giftModal').classList.add('hidden'))
      .catch((err) => { toast(err.message); pick.disabled = false; });
    return;
  }
  // The question needs an answer: a click past the window does not close it.
  if ($('#giftBody [data-scooter-no]')) return;
  const from = e.target.closest('[data-profile]');
  if (!from && e.target.id !== 'giftModal' && !e.target.closest('[data-gift-close]')) return;
  $('#giftModal').classList.add('hidden');
  if (from) showUser(Number(from.dataset.profile));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#giftModal').classList.contains('hidden')) {
    e.stopImmediatePropagation();
    if (!$('#giftBody [data-scooter-no]')) $('#giftModal').classList.add('hidden');
  }
}, true);
$('#giftBody').addEventListener('input', (e) => {
  if (e.target.id === 'pickerSearch') Shop.renderPicker(e.target.value);
  if (e.target.id === 'coinSearch') Shop.renderCoins(e.target.value);
});
$('#shopBody').addEventListener('click', async (e) => {
  if (e.target.closest('[data-build]')) return Shop.askBuild();
  if (e.target.closest('[data-release]')) return Shop.openRelease();
  if (e.target.closest('[data-coins]')) { try { await Shop.openCoins(); } catch (err) { toast(err.message); } return; }
  const giftTo = e.target.closest('[data-gift-to]');
  if (giftTo) { try { await Shop.openGiftTo(giftTo.closest('[data-gift]').dataset.gift); } catch (err) { toast(err.message); } return; }
  const b = e.target.closest('[data-buy]');
  if (!b) return;
  b.disabled = true;
  try { await Shop.buy(b.closest('[data-gift]')); } catch (err) { toast(err.message); }
  if (b.isConnected) b.disabled = false;
});
$('#giftBody').addEventListener('change', (e) => {
  const form = e.target.closest('#giftForm');
  if (!form) return;
  if (e.target.name === 'limited') $('#giftFormTotal').classList.toggle('hidden', !e.target.checked);
  if (e.target.name === 'file' && e.target.files[0]) {
    $('#giftFormPreview').src = URL.createObjectURL(e.target.files[0]);
    $('#giftFormPreview').hidden = false;
    $('#giftFormHint').hidden = true;
  }
});
$('#giftBody').addEventListener('submit', async (e) => {
  if (e.target.id === 'giftForm') {
    e.preventDefault();
    const f = e.target;
    if (!f.file.files[0]) return toast('Выберите фото подарка');
    const btn = f.querySelector('[type=submit]');
    btn.disabled = true;
    try {
      const { url } = await upload(f.file.files[0], { kind: 'image', name: f.file.files[0].name });
      const { gift } = await api('/api/admin/gifts', { method: 'POST', body: { name: f.name.value, image: url, price: Number(f.price.value), limited: f.limited.checked, total: Number(f.total.value) } });
      toast(`Подарок «${gift.name}» выпущен`);
      $('#giftModal').classList.add('hidden');
      await Shop.open();
    } catch (err) { toast(err.message); btn.disabled = false; }
  }
});

window.addEventListener('beforeunload', () => { if (call) call.room.disconnect(); });

updateComposerButtons();
boot();
})();

