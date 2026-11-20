import { FAMILIES, FORMATS, byId } from "./formats.js";
import { mountBrainstorm } from "./brainstorm.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const famById = Object.fromEntries(FAMILIES.map((f) => [f.id, f]));
const KIND = { app: "Browser activity", both: "Paper or browser", paper: "Paper only" };
const $ = (id) => document.getElementById(id);

function render() {
  const id = decodeURIComponent((location.hash || "").slice(1));
  const f = byId[id] || FORMATS[0];
  if (!byId[id]) history.replaceState(null, "", `#${f.id}`);
  const fam = famById[f.family];
  const i = FORMATS.indexOf(f);
  const prev = FORMATS[(i - 1 + FORMATS.length) % FORMATS.length];
  const next = FORMATS[(i + 1) % FORMATS.length];

  document.title = `${f.name} · Active Learning Library`;
  const hero = $("fhero");
  hero.dataset.fam = f.family;
  $("famName").textContent = fam.name;
  $("fName").textContent = f.name;
  $("fOne").textContent = f.one;
  const courses = [...new Set(f.runs.map((r) => r.course))];
  $("fTags").innerHTML =
    (f.runs.some((r) => r.play) ? `<span class="tag play">Playable in a browser</span>` : "") +
    `<span class="tag">${KIND[f.kind]}</span>` + courses.map((c) => `<span class="tag">${esc(c)}</span>`).join("") +
    `<div style="flex-basis:100%"></div><button type="button" class="btn btn-ghost btn-sm print-btn" onclick="window.print()">Print the run sheet</button>`;

  let h = `<section class="fsec"><p class="kicker">Why it works</p><p class="why">${esc(f.why)}</p></section>`;
  h += `<section class="fsec"><p class="kicker">How it runs</p><ol class="runsheet">${f.steps.map(([t, d]) => `<li><span class="t">${esc(t)}</span><span class="d">${esc(d)}</span></li>`).join("")}</ol></section>`;
  if (f.roles) h += `<section class="fsec" data-fam="${f.family}"><p class="kicker">The eight moves</p><div class="roles">${f.roles.map(([n, d]) => `<div class="role"><b>${esc(n)}</b><span>${esc(d)}</span></div>`).join("")}</div></section>`;
  if (f.checks) h += `<section class="fsec" data-fam="${f.family}"><p class="kicker">Checks built so far</p><div class="roles">${f.checks.map(([n, d]) => `<div class="role"><b>${esc(n)}</b><span>${esc(d)}</span></div>`).join("")}</div></section>`;
  h += `<section class="fsec"><p class="kicker">What you swap in</p><div class="slots">${f.slots.map((s) => `<span>${esc(s)}</span>`).join("")}</div></section>`;
  if (f.watch?.length) h += `<section class="fsec"><p class="kicker">Watch for</p><ul class="watch">${f.watch.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></section>`;
  h += `<section class="fsec"><p class="kicker">Original runs</p>${f.runs.map((r) => `
    <div class="run"><div class="run-h"><b>${esc(r.title)}</b><span class="tag">${esc(r.course)}</span><span class="w">${esc(r.when)}</span></div>
      <p>${esc(r.note)}</p>${r.play ? `<a class="btn btn-dark btn-sm" href="${esc(r.play)}">Play it in your browser &rarr;</a>` : ""}</div>`).join("")}</section>`;
  h += `<nav class="fnav" aria-label="More formats"><a href="#${prev.id}"><span>&larr; Previous</span><b>${esc(prev.name)}</b></a><a href="#${next.id}"><span>Next &rarr;</span><b>${esc(next.name)}</b></a></nav>`;
  $("fArticle").innerHTML = h;

  mountBrainstorm($("brainstorm"), f);
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
