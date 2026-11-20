import { FAMILIES, FORMATS } from "./formats.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const famById = Object.fromEntries(FAMILIES.map((f) => [f.id, f]));
const KIND = { app: "Browser activity", both: "Paper or browser", paper: "Paper" };

/* stats */
document.getElementById("statFormats").textContent = FORMATS.length;
document.getElementById("statRuns").textContent = FORMATS.reduce((n, f) => n + f.runs.length, 0);

/* hero wall: drifting index cards, one per format */
(function wall() {
  const el = document.getElementById("heroWall");
  if (!el) return;
  const cards = FORMATS.map((f) => `<div class="wall-card" data-fam="${f.family}" style="--fc:var(--f-${f.family})"><b>${esc(f.name)}</b><span>${esc(f.one)}</span></div>`);
  const rows = [0, 1, 2, 3].map((r) => {
    const slice = cards.filter((_, i) => i % 4 === r);
    const doubled = slice.concat(slice).join(""); // doubled so the -50% drift loops seamlessly
    return `<div class="hero-row">${doubled}</div>`;
  });
  el.innerHTML = rows.join("");
})();

/* library */
const state = { fam: "all", q: "" };
try { const h = new URLSearchParams(location.search).get("family"); if (h && famById[h]) state.fam = h; } catch (e) {}

function chips() {
  const all = `<button class="chip" data-f="all" aria-pressed="${state.fam === "all"}">All</button>`;
  const fams = FAMILIES.map((f) => `<button class="chip" data-fam="${f.id}" data-f="${f.id}" aria-pressed="${state.fam === f.id}"><span class="dot"></span>${esc(f.name)}</button>`).join("");
  return all + fams + `<input class="lib-search" id="libQ" type="search" placeholder="Search cases, readings, moves" aria-label="Search the formats" value="${esc(state.q)}">`;
}

function matches(f) {
  if (state.fam !== "all" && f.family !== state.fam) return false;
  if (!state.q) return true;
  const hay = [f.name, f.one, f.why, ...f.slots, ...f.runs.map((r) => `${r.title} ${r.note} ${r.course}`)].join(" ").toLowerCase();
  return state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
}

function card(f) {
  const courses = [...new Set(f.runs.map((r) => r.course))].map((c) => `<span class="tag">${esc(c)}</span>`).join("");
  const play = f.runs.some((r) => r.play) ? `<span class="tag play">Playable</span>` : "";
  return `<a class="fcard" data-fam="${f.family}" href="format.html#${f.id}">
    <h4>${esc(f.name)}</h4><p>${esc(f.one)}</p>
    <div class="meta">${play}${courses}<span class="tag">${f.runs.length} run${f.runs.length === 1 ? "" : "s"}</span></div></a>`;
}

function renderLib() {
  const shown = FORMATS.filter(matches);
  document.getElementById("libCount").textContent = `${shown.length} of ${FORMATS.length} formats`;
  const html = FAMILIES.map((fam) => {
    const list = shown.filter((f) => f.family === fam.id);
    if (!list.length) return "";
    return `<div class="fam" data-fam="${fam.id}"><div class="fam-head"><h3>${esc(fam.name)}</h3><p>${esc(fam.blurb)}</p></div><div class="grid">${list.map(card).join("")}</div></div>`;
  }).join("");
  document.getElementById("lib").innerHTML = html || `<p class="empty">Nothing matches. Clear the search or pick another family.</p>`;
}

const chipsEl = document.getElementById("chips");
chipsEl.innerHTML = chips();
chipsEl.addEventListener("click", (e) => {
  const b = e.target.closest("[data-f]");
  if (!b) return;
  state.fam = b.dataset.f;
  chipsEl.querySelectorAll("[data-f]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.f === state.fam)));
  renderLib();
});
document.getElementById("libQ").addEventListener("input", (e) => { state.q = e.target.value.trim(); renderLib(); });
renderLib();
