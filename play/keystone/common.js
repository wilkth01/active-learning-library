// Shared helpers for student and instructor pages.
window.$ = (sel, root = document) => root.querySelector(sel);
window.$$ = (sel, root = document) => [...root.querySelectorAll(sel)];

window.esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

window.money = (n, digits = 1) => {
  if (Math.abs(n) >= 1e6) return "$" + (n / 1e6).toFixed(digits) + "M";
  if (Math.abs(n) >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
};

window.store = {
  get(k, d = null) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};

window._unusedApi = async (url, opts = {}) => {
  const res = await fetch(url, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
  return data;
};

window.fmtClock = (ms) => {
  ms = Math.max(0, ms);
  const s = Math.ceil(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

// Schematic neighborhood map drawn from a site's map spec. Deterministic per site.
window.siteMapSVG = function (site) {
  const m = site.map;
  let seed = [...site.id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const W = 400, H = 250;
  const parts = [];
  const bg = m.homes === "sparse" ? "#e6ecd7" : m.homes === "suburban" ? "#e9eee4" : "#ecebe6";
  parts.push(`<rect width="${W}" height="${H}" fill="${bg}"/>`);

  if (m.homes === "sparse") {
    // field strips
    for (let i = 0; i < 7; i++) {
      const x = i * 60 - 10;
      parts.push(`<rect x="${x}" y="0" width="56" height="${H}" fill="${i % 2 ? "#dfe7cc" : "#e9eed9"}"/>`);
    }
  }
  if (m.river) parts.push(`<path d="M-10 212 C 80 190, 150 240, 240 214 S 360 196, 410 218 L410 260 L-10 260 Z" fill="#b9d3e6"/>`);

  // street grid
  const step = m.homes === "dense" ? 34 : m.homes === "medium" ? 44 : m.homes === "suburban" ? 0 : 0;
  if (step) {
    for (let x = 20; x < W; x += step) parts.push(`<line x1="${x}" y1="0" x2="${x}" y2="${m.river ? 196 : H}" stroke="#fff" stroke-width="3"/>`);
    for (let y = 16; y < (m.river ? 196 : H); y += step) parts.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#fff" stroke-width="3"/>`);
  }
  if (m.homes === "suburban") {
    parts.push(`<path d="M0 60 C 90 40, 140 110, 230 80 S 360 40, 400 70" stroke="#fff" stroke-width="5" fill="none"/>`);
    parts.push(`<path d="M40 250 C 60 170, 140 170, 170 130 S 260 150, 300 250" stroke="#fff" stroke-width="5" fill="none"/>`);
    parts.push(`<ellipse cx="330" cy="170" rx="55" ry="38" fill="#cfe0c1"/>`);
  }
  if (m.homes === "sparse") parts.push(`<path d="M0 120 C 120 110, 260 140, 400 118" stroke="#fff" stroke-width="5" fill="none"/>`);

  // houses
  const n = { dense: 150, medium: 80, suburban: 40, sparse: 7 }[m.homes] || 40;
  const sz = { dense: 7, medium: 8, suburban: 11, sparse: 9 }[m.homes] || 8;
  for (let i = 0; i < n; i++) {
    const x = rnd() * (W - 20) + 6, y = rnd() * ((m.river ? 190 : H) - 20) + 6;
    if (x > 150 && x < 290 && y > 70 && y < 170) continue; // keep parcel clear
    parts.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${sz}" height="${sz}" rx="1.5" fill="#b9aea0"/>`);
  }
  // existing industry
  for (let i = 0; i < (m.industry || 0); i++) {
    const x = 30 + i * 270, y = 150;
    parts.push(`<rect x="${x}" y="${y}" width="70" height="36" fill="#8d949b"/><rect x="${x + 50}" y="${y - 22}" width="8" height="22" fill="#6f767d"/>`);
    parts.push(`<text x="${x + 35}" y="${y + 23}" font-size="9" text-anchor="middle" fill="#fff" font-family="IBM Plex Sans, sans-serif">existing facility</text>`);
  }
  if (m.rail) parts.push(`<path d="M0 64 L400 58" stroke="#5b5048" stroke-width="3" stroke-dasharray="7 4"/><text x="8" y="55" font-size="10" fill="#5b5048" font-family="IBM Plex Sans, sans-serif">rail</text>`);
  if (m.highway) parts.push(`<path d="M300 0 C 280 80, 300 160, 260 250" stroke="#f0c94a" stroke-width="9" fill="none"/><path d="M300 0 C 280 80, 300 160, 260 250" stroke="#8a7a2c" stroke-width="1" fill="none" stroke-dasharray="6 6"/>`);

  // parcel
  parts.push(`<rect x="160" y="80" width="120" height="80" rx="4" fill="rgba(224,112,58,.18)" stroke="#e0703a" stroke-width="2.5" stroke-dasharray="6 4"/>`);
  parts.push(`<text x="220" y="125" font-size="13" font-weight="700" text-anchor="middle" fill="#b4531f" font-family="IBM Plex Sans, sans-serif">PARCEL</text>`);

  // landmarks
  (m.landmarks || []).forEach((name, i) => {
    const x = i === 0 ? 40 : 170, y = i === 0 ? 34 : 222;
    parts.push(`<circle cx="${x}" cy="${y}" r="5" fill="#1d3144"/><text x="${x + 9}" y="${y + 4}" font-size="10.5" fill="#1d3144" font-family="IBM Plex Sans, sans-serif" paint-order="stroke" stroke="${bg}" stroke-width="3">${esc(name)}</text>`);
  });
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Schematic map of ${esc(site.name)}">${parts.join("")}</svg>`;
};
