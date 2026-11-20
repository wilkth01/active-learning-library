// Project Keystone siting meeting — single-device version for the Active Learning Library.
// Ported from the classroom server app (github.com/wilkth01/phil352-siting). Everything that
// the server coordinated (shared clock, lock-in, reveal) now happens on this one device.
(() => {
  const C = window.COMPANY, SITES = window.SITES;
  const siteById = Object.fromEntries(SITES.map((s) => [s.id, s]));
  const KEY = "ks.solo";

  // L: {phase: "intro"|"meeting", endsAt: ms|null, minutes, members, mine: payload|null, revealed: bool, auto: bool}
  let L = store.get(KEY, null) || { phase: "intro", endsAt: null, minutes: 15, members: "", mine: null, revealed: false };
  let view = null;
  let tab = L.revealed ? "reveal" : "deck";
  let slide = 0;
  let portalSite = SITES[0].id;
  let overrides = store.get("ks.overrides", {});
  let autoTried = false;
  const save = () => store.set(KEY, L);

  const getDraft = () => store.get("ks.draft.solo", { site: "", runnerUp: "", drivers: [], reasoning: "", community: "" });
  const setDraft = (d) => store.set("ks.draft.solo", d);
  const app = $("#app");

  $("#resetAll").onclick = () => {
    if (!confirm("Start over? This clears the decision, the draft and the cost-model sliders on this device.")) return;
    ["ks.solo", "ks.draft.solo", "ks.overrides"].forEach((k) => store.del(k));
    location.reload();
  };

  setInterval(tick, 250);

  // ------------------------------------------------------------------ clock
  function tick() {
    const clock = $("#clock");
    if (L.phase === "meeting" && L.endsAt) {
      const left = L.endsAt - Date.now();
      clock.classList.remove("hidden");
      clock.textContent = L.mine ? "Locked" : fmtClock(left);
      clock.classList.toggle("warn", !L.mine && left <= 5 * 60e3 && left > 2 * 60e3);
      clock.classList.toggle("crit", !L.mine && left <= 2 * 60e3 && left > 0);
      if (left <= 0 && view === "work") onDeadline();
      if (view === "work") updateTimeBanner(left);
    } else clock.classList.add("hidden");
  }

  function updateTimeBanner(left) {
    const el = $("#timeBanner");
    if (!el) return;
    let html = "", cls = "";
    if (L.mine) { el.className = "hidden"; return; }
    if (left <= 0) { html = "<b>Time.</b> The CEO wants your answer. Go to <b>Decision</b> and lock in a site."; cls = "err"; }
    else if (left <= 2 * 60e3) { html = "<b>Two minutes.</b> The CEO needs your recommendation now. Go to <b>Decision</b> and lock in."; cls = "err"; }
    else if (left <= 5 * 60e3) { html = "<b>Five minutes left.</b> Start converging on a recommendation."; cls = "warn"; }
    el.className = html ? `banner ${cls}` : "hidden";
    if (el.innerHTML !== html) el.innerHTML = html;
  }

  function onDeadline() {
    if (L.mine || autoTried) return;
    autoTried = true;
    const d = getDraft();
    if (!d.site) return; // nothing chosen yet: leave the form open so the group can still decide
    L.mine = { ...d, members: L.members, auto: true, at: Date.now() };
    save();
    drawTabs(); if (tab === "decision") drawPanel();
  }

  // ------------------------------------------------------------------ router
  function render() {
    const gp = $("#groupPill");
    if (L.members && L.phase === "meeting") { gp.textContent = L.members.length > 36 ? L.members.slice(0, 34) + "…" : L.members; gp.classList.remove("hidden"); } else gp.classList.add("hidden");
    const sp = $("#statusPill");
    sp.classList.toggle("hidden", !L.mine);
    if (L.mine) sp.textContent = "Decision locked";
    if (L.phase !== "meeting") return mount("intro", renderIntro);
    mount("work", renderWork);
  }
  function mount(name, fn) { if (view === name) return; view = name; fn(); }

  // ------------------------------------------------------------------ intro (replaces join + lobby)
  function renderIntro() {
    let minutes = L.minutes || 15;
    app.innerHTML = `
      <div class="intro-grid" style="margin-top:3vh">
        <div class="card">
          <div class="kicker small muted" style="text-transform:uppercase;letter-spacing:.1em">Confidential · Internal use only</div>
          <h1 style="margin-top:6px">Site Selection Meeting</h1>
          <p>You are the siting team for <b>${esc(C.name)}</b>. The company needs a ${esc(C.facility.toLowerCase())} somewhere in Delmont County, and the CEO wants one site: operating soonest, at the lowest total cost, with the lowest risk to the company.</p>
          <p class="muted">You’ll get a briefing deck, a research portal with a dossier on each site, and a ten-year cost model. When the clock runs out, your recommendation is locked in.</p>
          <label>Meeting length</label>
          <div class="mins">${[10, 15, 20].map((m) => `<button type="button" class="btn ghost sm ${m === minutes ? "sel" : ""}" data-m="${m}">${m} min</button>`).join("")}<button type="button" class="btn ghost sm ${minutes === 0 ? "sel" : ""}" data-m="0">No clock</button></div>
          <label for="members">Who’s on the team? <span class="muted small">(optional; stays on this device)</span></label>
          <input id="members" type="text" placeholder="e.g. Jordan, Priya, Sam, Alex" value="${esc(L.members)}">
          <div style="margin-top:18px;display:flex;gap:12px;align-items:center;flex-wrap:wrap"><button class="btn accent" id="startBtn">Start the meeting</button><span class="small muted">Nothing here is sent anywhere.</span></div>
        </div>
        <div class="card">
          <h2>Assign roles first</h2>
          <p class="muted">Everyone on the siting team has a job. Decide who is who before the clock starts.</p>
          <div class="kv">${ROLES.map(([r, d]) => `<dt><b>${esc(r)}</b></dt><dd>${esc(d)}</dd>`).join("")}</div>
          <p class="small muted" style="margin-top:16px">Running this with several groups at once, with one shared clock and an instructor-controlled reveal? Use the <a href="https://github.com/wilkth01/phil352-siting">classroom server version</a>.</p>
        </div>
      </div>`;
    $$(".mins button").forEach((b) => b.onclick = () => { minutes = Number(b.dataset.m); $$(".mins button").forEach((x) => x.classList.toggle("sel", x === b)); });
    $("#startBtn").onclick = () => {
      L.members = $("#members").value.trim().slice(0, 200);
      L.minutes = minutes;
      L.phase = "meeting";
      L.endsAt = minutes ? Date.now() + minutes * 60e3 : null;
      save(); view = null; render();
    };
  }

  // ------------------------------------------------------------------ workspace
  const TABS = [["deck", "Briefing deck"], ["portal", "Research portal"], ["model", "Cost model"], ["decision", "Decision"]];
  function renderWork() {
    app.innerHTML = `<div id="timeBanner" class="hidden"></div><nav class="tabs" id="tabs"></nav><section id="panel"></section>`;
    drawTabs(); drawPanel();
  }
  function drawTabs() {
    const tabs = [...TABS];
    if (L.revealed) tabs.push(["reveal", "Census appendix"]);
    $("#tabs").innerHTML = tabs.map(([k, l], i) => `<button data-t="${k}" class="${tab === k ? "on" : ""}"><span class="step">${i + 1}</span>${l}</button>`).join("");
    $$("#tabs button").forEach((b) => b.onclick = () => { tab = b.dataset.t; drawTabs(); drawPanel(); });
  }
  function drawPanel() {
    const p = $("#panel");
    p.oninput = p.onchange = null;
    ({ deck: drawDeck, portal: drawPortal, model: drawModel, decision: drawDecision, reveal: drawReveal })[tab](p);
  }

  // ------------------------------------------------------------------ 1. deck
  function slides() {
    const byTotal = [...SITES].map((s) => ({ s, c: tenYearCost(s.cost) }));
    return [
      `<div class="kicker">Confidential · Internal use only</div>
       <h2>Project Keystone<br>Site Selection Meeting</h2>
       <p class="big">${esc(C.facility)} · ${esc(C.capacity)} · Delmont County</p>
       <ul style="margin-top:auto"><li>1. The project</li><li>2. Your charge and the criteria</li><li>3. The four candidate sites</li><li>4. Recommendation due at the end of this meeting</li></ul>`,
      `<div class="kicker">1 · The project</div><h2>What we're building</h2>
       <div class="grid2"><div>
         <div class="stat"><span>Facility</span><b>${esc(C.facility)}</b></div>
         <div class="stat"><span>Throughput</span><b>${esc(C.capacity)} of contaminated soil and construction debris</b></div>
         <div class="stat"><span>Footprint</span><b>${C.acres} acres, 24/7 truck operations</b></div>
       </div><div>
         <div class="stat"><span>Jobs</span><b>${C.jobs} full-time positions</b></div>
         <div class="stat"><span>Revenue</span><b>${esc(C.revenue)}</b></div>
         <div class="stat"><span>Cost of delay</span><b>${money(C.delayCostPerMonth, 2)} for every month we are not operating</b></div>
       </div></div>`,
      `<div class="kicker">2 · Your charge</div><h2>From the CEO</h2>
       <p class="big" style="font-style:italic;max-width:48ch">“Bring me one site. I want the recommendation that gets us operating soonest at the lowest total cost and the lowest risk to the company. The board meets Friday.”</p>
       <ul style="margin-top:auto"><li>The recommendation is due when the clock at the top right hits zero.</li><li>Lock it in on the <b>Decision</b> tab. Once locked, it can't be changed.</li></ul>`,
      `<div class="kicker">2 · Decision criteria</div><h2>How we'll evaluate sites</h2>
       <div class="grid2"><div>
         <div class="stat"><span>Cost</span><b>Land, site prep, infrastructure, 10-year trucking</b></div>
         <div class="stat"><span>Speed</span><b>Months to permit; every month costs ${money(C.delayCostPerMonth, 2)}</b></div>
       </div><div>
         <div class="stat"><span>Logistics</span><b>Highway and rail access for 24/7 truck operations</b></div>
         <div class="stat"><span>Risk</span><b>Likelihood of community opposition, hearings and litigation</b></div>
       </div></div>`,
      ...SITES.map((s) => `
        <div class="kicker">3 · Candidate site ${s.letter}</div><h2>${esc(s.name)}</h2>
        <div class="grid2"><div class="mapbox">${siteMapSVG(s)}</div><div>
          <p class="big" style="margin-bottom:14px">${esc(s.tagline)}</p>
          ${s.headline.map(([k, v]) => `<div class="stat"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}
        </div></div>`),
      `<div class="kicker">3 · Side by side</div><h2>The four sites</h2>
       <table><thead><tr><th>Site</th><th>Land / acre</th><th>Permit</th><th>Opposition risk</th><th>10-yr cost (est.)</th></tr></thead><tbody>
       ${byTotal.map(({ s, c }) => `<tr><td>${s.letter} · ${esc(s.name)}</td><td>${esc(s.headline[0][1].split(" ")[0])}</td><td>${s.cost.permitMonths} mo</td><td>${esc(s.headline[3][1])}</td><td>${money(c.total)}</td></tr>`).join("")}
       </tbody></table>
       <p class="small" style="color:#9fb0c0;margin-top:12px">The 10-year estimate uses the consultant's figures. Open the <b>Cost model</b> tab to test your own assumptions.</p>`,
      `<div class="kicker">4 · Next steps</div><h2>Make the call</h2>
       <ul><li><b>Research portal:</b> the full dossier on each site</li><li><b>Cost model:</b> adjust the litigation-risk assumptions and see the 10-year cost</li><li><b>Decision:</b> choose a site, write the recommendation memo, lock it in</li></ul>`,
    ];
  }
  function drawDeck(p) {
    const sl = slides();
    slide = Math.min(slide, sl.length - 1);
    p.innerHTML = `
      <div class="deck">
        <div class="slide">${sl[slide]}<div class="footer"><span>${esc(C.name)} · Confidential</span><span>${slide + 1} / ${sl.length}</span></div></div>
        <div class="deck-nav">
          <button class="btn ghost sm" style="color:#fff;border-color:rgba(255,255,255,.25)" id="prev" ${slide === 0 ? "disabled" : ""}>← Prev</button>
          <div class="dots">${sl.map((_, i) => `<i data-i="${i}" class="${i === slide ? "on" : ""}"></i>`).join("")}</div>
          <button class="btn accent sm" id="next">${slide === sl.length - 1 ? "Open research portal →" : "Next →"}</button>
        </div>
      </div>`;
    $("#prev").onclick = () => { slide--; drawDeck(p); };
    $("#next").onclick = () => { if (slide === sl.length - 1) { tab = "portal"; drawTabs(); drawPanel(); } else { slide++; drawDeck(p); } };
    $$(".dots i", p).forEach((d) => d.onclick = () => { slide = Number(d.dataset.i); drawDeck(p); });
  }
  document.addEventListener("keydown", (e) => {
    if (tab !== "deck" || view !== "work" || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) return;
    const n = slides().length;
    if (e.key === "ArrowRight" && slide < n - 1) { slide++; drawPanel(); }
    if (e.key === "ArrowLeft" && slide > 0) { slide--; drawPanel(); }
  });

  // ------------------------------------------------------------------ 2. portal
  function drawPortal(p) {
    const s = siteById[portalSite];
    p.innerHTML = `
      <div class="portal">
        <div class="site-list">
          <p class="small muted" style="margin:0 0 8px">Tessera Research Portal · Site dossiers</p>
          ${SITES.map((x) => `<button data-s="${x.id}" class="${x.id === s.id ? "on" : ""}"><span class="badge" style="background:${x.color}">${x.letter}</span><span><b>${esc(x.name)}</b><br><span class="small muted">${esc(x.headline[3][1])} risk</span></span></button>`).join("")}
        </div>
        <div>
          <div class="card">
            <div class="dossier-head">
              <div class="mapthumb">${siteMapSVG(s)}</div>
              <div style="flex:1;min-width:240px">
                <h2 style="margin-bottom:4px">${s.letter} · ${esc(s.name)}</h2>
                <p class="muted small">${esc(s.place)}</p>
                <p>${esc(s.tagline)}</p>
                <dl class="kv">${s.headline.map(([k, v]) => `<dt>${esc(k)}</dt><dd><b>${esc(v)}</b></dd>`).join("")}</dl>
              </div>
            </div>
            ${s.dossier.map((sec, i) => `
              <div class="acc ${i === 0 ? "open" : ""}">
                <button>${esc(sec.title)}</button>
                <div class="body">${sec.note ? `<div class="memo">${esc(sec.note)}</div>` :
                  `<dl class="kv">${sec.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`}</div>
              </div>`).join("")}
          </div>
        </div>
      </div>`;
    $$(".site-list button", p).forEach((b) => b.onclick = () => { portalSite = b.dataset.s; drawPortal(p); });
    $$(".acc > button", p).forEach((b) => b.onclick = () => b.parentElement.classList.toggle("open"));
  }

  // ------------------------------------------------------------------ 3. cost model
  function modelRows() {
    return SITES.map((s) => ({ s, c: tenYearCost(s.cost, overrides[s.id] != null ? { challengeProb: overrides[s.id] } : {}) }));
  }
  function drawModel(p) {
    const rows = modelRows();
    const line = (label, key, f, cls = "") => `<tr class="${cls}"><td>${label}</td>${rows.map((r) => `<td data-k="${key}" data-s="${r.s.id}">${f(r)}</td>`).join("")}</tr>`;
    const prob = (r) => Math.round((overrides[r.s.id] ?? r.s.cost.challengeProb) * 100);
    p.innerHTML = `
      <div class="card">
        <h2>10-year cost model</h2>
        <p class="muted">Capital cost + ${C.horizonYears} years of trucking + expected revenue lost to permitting and litigation delays (${money(C.delayCostPerMonth, 2)}/month). The litigation probabilities are the consultant's estimates. If your team reads the community differently, drag the sliders.</p>
        <div style="overflow-x:auto"><table class="model">
          <thead><tr><th></th>${rows.map((r) => `<th><span class="badge" style="background:${r.s.color};display:inline-grid;width:22px;height:22px;font-size:.75rem">${r.s.letter}</span> ${esc(r.s.name)}</th>`).join("")}</tr></thead>
          <tbody>
            ${line("Land (12 acres)", "", (r) => money(r.c.land, 2))}
            ${line("Site prep", "", (r) => money(r.s.cost.prep, 2))}
            ${line("Road / rail improvements", "", (r) => money(r.s.cost.infra, 2))}
            ${line("<b>Capital subtotal</b>", "", (r) => `<b>${money(r.c.capital, 2)}</b>`)}
            ${line(`Trucking, ${C.horizonYears} yrs`, "", (r) => money(r.c.operating))}
            ${line("Permitting time", "", (r) => `${r.s.cost.permitMonths} mo`)}
            <tr><td>Chance of legal challenge</td>${rows.map((r) => `<td><div style="display:flex;gap:8px;align-items:center"><input type="range" min="0" max="100" step="5" data-s="${r.s.id}" value="${prob(r)}" aria-label="Chance of legal challenge, ${esc(r.s.name)}"><span class="mono" data-k="prob" data-s="${r.s.id}" style="min-width:3.2em">${prob(r)}%</span></div></td>`).join("")}</tr>
            ${line("Delay if challenged", "", (r) => `${r.s.cost.challengeMonths} mo`)}
            ${line("Expected delay", "exp", (r) => `${r.c.expectedDelay.toFixed(1)} mo`)}
            ${line("Expected delay cost", "delay", (r) => money(r.c.delay))}
            ${line("10-year total", "total", (r) => money(r.c.total), "total")}
            <tr><td></td>${rows.map((r) => `<td><div class="bar" data-k="bar" data-s="${r.s.id}" style="margin-left:auto;background:${r.s.color}"></div></td>`).join("")}</tr>
          </tbody>
        </table></div>
        <button class="btn ghost sm" id="resetModel" style="margin-top:12px">Reset to consultant estimates</button>
      </div>`;
    updateModel(p);
    $$("input[type=range]", p).forEach((r) => r.oninput = () => {
      overrides[r.dataset.s] = Number(r.value) / 100; store.set("ks.overrides", overrides); updateModel(p);
    });
    $("#resetModel").onclick = () => { overrides = {}; store.set("ks.overrides", overrides); drawModel(p); };
  }
  function updateModel(p) {
    const rows = modelRows();
    const max = Math.max(...rows.map((r) => r.c.total));
    const set = (k, id, v) => { const el = p.querySelector(`[data-k="${k}"][data-s="${id}"]`); if (el) el.textContent = v; };
    rows.forEach((r) => {
      set("prob", r.s.id, Math.round((overrides[r.s.id] ?? r.s.cost.challengeProb) * 100) + "%");
      set("exp", r.s.id, `${r.c.expectedDelay.toFixed(1)} mo`);
      set("delay", r.s.id, money(r.c.delay));
      set("total", r.s.id, money(r.c.total));
      const bar = p.querySelector(`[data-k="bar"][data-s="${r.s.id}"]`);
      if (bar) bar.style.width = (r.c.total / max * 100).toFixed(0) + "%";
    });
  }

  // ------------------------------------------------------------------ 4. decision
  function drawDecision(p) {
    if (L.mine) return drawLocked(p);
    const d = getDraft();
    p.innerHTML = `
      <div class="card">
        <h2>Recommendation to the CEO</h2>
        <p class="muted">${L.endsAt ? "Lock in before the clock runs out. If time expires with a site chosen, this form is submitted automatically." : "Lock in when your team agrees."}</p>
        <label for="mem">Siting team members</label>
        <input id="mem" type="text" value="${esc(L.members)}">
        <label>Recommended site</label>
        <div class="site-pick">${SITES.map((s) => `<label><input type="radio" name="site" value="${s.id}" ${d.site === s.id ? "checked" : ""}><span class="badge" style="background:${s.color}">${s.letter}</span>${esc(s.name)}</label>`).join("")}</div>
        <label for="ru">Runner-up</label>
        <select id="ru"><option value="">—</option>${SITES.map((s) => `<option value="${s.id}" ${d.runnerUp === s.id ? "selected" : ""}>${s.letter} · ${esc(s.name)}</option>`).join("")}</select>
        <label>What drove the decision? <span class="muted small">(pick up to three)</span></label>
        <div class="checks">${DRIVERS.map((x) => `<label><input type="checkbox" value="${esc(x)}" ${d.drivers.includes(x) ? "checked" : ""}>${esc(x)}</label>`).join("")}</div>
        <label for="why">Recommendation memo: why this site?</label>
        <textarea id="why" placeholder="Make the case to the CEO in 3–5 sentences.">${esc(d.reasoning)}</textarea>
        <label for="comm">Community plan: what will you tell the neighbors, and what (if anything) will you offer them?</label>
        <textarea id="comm">${esc(d.community)}</textarea>
        <div id="decErr"></div>
        <div style="margin-top:16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <button class="btn accent" id="lockBtn">Lock in recommendation</button>
          <span class="small muted">Draft saves automatically on this device.</span>
        </div>
        <div id="confirm" class="hidden banner warn" style="margin-top:14px"></div>
      </div>`;
    const saveDraft = () => {
      setDraft({
        site: ($('input[name=site]:checked', p) || {}).value || "",
        runnerUp: $("#ru", p).value,
        drivers: $$(".checks input:checked", p).map((c) => c.value),
        reasoning: $("#why", p).value,
        community: $("#comm", p).value,
      });
      L.members = $("#mem", p).value.slice(0, 200); save();
    };
    p.oninput = p.onchange = (e) => {
      if (e.target.matches(".checks input") && $$(".checks input:checked", p).length > 3) e.target.checked = false;
      saveDraft();
    };
    $("#lockBtn").onclick = () => {
      saveDraft();
      const nd = getDraft();
      const err = $("#decErr");
      if (!nd.site) { err.className = "banner err"; err.style.marginTop = "14px"; err.textContent = "Choose a recommended site first."; return; }
      if (nd.reasoning.trim().length < 20) { err.className = "banner err"; err.style.marginTop = "14px"; err.textContent = "Write the recommendation memo before locking in."; return; }
      err.className = ""; err.textContent = "";
      const c = $("#confirm");
      c.classList.remove("hidden");
      c.innerHTML = `Lock in <b>${esc(siteById[nd.site].name)}</b>? This can't be undone. <button class="btn sm accent" id="yes" style="margin-left:8px">Yes, lock it in</button> <button class="btn sm ghost" id="no">Cancel</button>`;
      $("#no").onclick = () => c.classList.add("hidden");
      $("#yes").onclick = () => {
        L.mine = { ...nd, members: L.members, auto: false, at: Date.now() };
        save(); render(); drawPanel();
      };
    };
  }
  function drawLocked(p) {
    const d = L.mine;
    const s = siteById[d.site];
    p.innerHTML = `
      <div class="card">
        <div class="banner ok">Your recommendation is locked in${d.auto ? " (submitted automatically when time expired)" : ""}.</div>
        <h2>${s ? `${s.letter} · ${esc(s.name)}` : "No site selected"}</h2>
        <dl class="kv">
          <dt>Team</dt><dd>${esc(d.members) || "—"}</dd>
          <dt>Runner-up</dt><dd>${d.runnerUp ? esc(siteById[d.runnerUp].name) : "—"}</dd>
          <dt>Drivers</dt><dd>${esc((d.drivers || []).join(", ") || "—")}</dd>
          <dt>Memo</dt><dd style="white-space:pre-wrap">${esc(d.reasoning)}</dd>
          <dt>Community plan</dt><dd style="white-space:pre-wrap">${esc(d.community)}</dd>
        </dl>
        ${L.revealed ? "" : `
        <div class="banner info" style="margin-top:18px">In class, this is where you wait for the other groups. Before you go on, write your one deciding reason somewhere you can see it.</div>
        <button class="btn accent" id="revealBtn">Open the census appendix</button>`}
      </div>`;
    const rb = $("#revealBtn");
    if (rb) rb.onclick = () => { L.revealed = true; save(); tab = "reveal"; drawTabs(); drawPanel(); window.scrollTo(0, 0); };
  }

  // ------------------------------------------------------------------ 5. reveal
  function drawReveal(p) {
    const R = window.REVEAL, K = window.COUNTY;
    const myPick = L.mine?.site;
    const pct = (v) => `${v}%`;
    const rows = [
      ["Black", (r) => pct(r.black), true],
      ["Hispanic / Latino", (r) => pct(r.hispanic)],
      ["White (non-Hispanic)", (r) => pct(r.white)],
      ["Median household income", (r) => money(r.income)],
      ["Poverty rate", (r) => pct(r.poverty)],
      ["Homeownership", (r) => pct(r.owner)],
      ["Pediatric asthma ER visits / 10k", (r) => r.asthma],
      ["Waste/industrial facilities within 1 mi", (r) => r.facilities ?? "—"],
      ["Voter turnout, last municipal election", (r) => pct(r.turnout)],
    ];
    p.innerHTML = `
      <div class="card" style="margin-bottom:20px">
        <div class="kicker small muted" style="text-transform:uppercase;letter-spacing:.1em">Appendix C · Census estimates · county health data (fictional county)</div>
        <h2>Who lives near each site</h2>
        <p class="muted">None of this was in your siting packet, and none of your criteria asked for it.</p>
        <div style="overflow-x:auto"><table class="reveal">
          <thead><tr><th></th>${SITES.map((s) => `<th><span class="badge" style="background:${s.color};display:inline-grid;width:22px;height:22px;font-size:.75rem">${s.letter}</span> ${esc(s.name)}${s.id === myPick ? "<br><span class='small' style='color:var(--accent-ink)'>your pick</span>" : ""}</th>`).join("")}<th>County overall</th></tr></thead>
          <tbody>${rows.map(([label, f, hl]) => `<tr><td>${label}</td>${SITES.map((s) => `<td class="${hl ? "hl" : ""}" style="${s.id === myPick ? "background:#fff4ec" : ""}">${f(R[s.id])}</td>`).join("")}<td class="muted">${f(K)}</td></tr>`).join("")}</tbody>
        </table></div>
      </div>
      <div class="grid-2">
        <div class="card">
          <h3>Before you talk</h3>
          <ol style="padding-left:1.2em;margin:0">
            <li>Where in your process did race come up? Where does it show up in the outcome?</li>
            <li>Riverside and Hollins have similar incomes. Why was one “low risk” and the other “high”?</li>
            <li>Which facts in your dossier were already telling you about race without saying so?</li>
            <li>The consultant listed Riverside's existing facilities as a <i>plus</i>. What changes if you count them as a cost?</li>
          </ol>
        </div>
        <div class="card">
          <h3>Next: find the wrong</h3>
          <p>Nobody on your team chose to harm anyone. Bullard’s argument is that the outcome follows a mechanism anyway. Map that mechanism, link by link, and name the link where the moral wrong happens.</p>
          <a class="btn accent" href="map.html">Open the mechanism map →</a>
          <p class="small muted" style="margin-top:12px">Everything in this case — Tessera, Delmont County, the four sites and their data — is invented. The pattern it follows is not.</p>
        </div>
      </div>`;
  }

  render();
})();
