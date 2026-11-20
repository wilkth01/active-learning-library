// Mechanism map: annotate Bullard's pipeline, then map it onto Chester.
// Single-device version: the work stays in this browser; the group downloads it at the end.
(() => {
  const STAGES = [
    ["externality", "Industrial externality generation", "Industry produces toxins, waste and locally unwanted land uses (LULUs)."],
    ["nimby", "NIMBY deflection", "Affluent communities use political clout, zoning and lawyers to block hazards."],
    ["least", "Path of least resistance", "Hazards get routed toward the communities least able to push back."],
    ["pibby", "PIBBY endpoint", "Facilities end up in poor, Black communities."],
    ["zoning", "Exclusionary zoning & housing policy", "Government policy confined where people could live and put industry next to them."],
    ["blackmail", "Job blackmail", "Communities are told to choose between jobs and environmental health."],
  ];
  const COLORS = ["#e0703a", "#2e86de", "#20bf6b", "#ffffff"];
  const DK = "mm.draft.solo";
  let D = store.get(DK, { pins: [], strokes: [], links: {}, wrongStage: "", wrong: "" });
  let mode = "note", color = COLORS[0];
  const app = $("#app");
  const save = () => store.set(DK, D);

  function start() {
    app.innerHTML = `
      <div class="card" style="margin-bottom:20px">
        <h2 style="margin-bottom:6px">Part 1 · Mark up the pipeline</h2>
        <p class="muted" style="margin:0">Use <b>Note</b> to drop a numbered pin and say what it marks: where you see this in Bullard, where you'd push back, what's missing. Use <b>Pen</b> to circle, connect or cross things out.</p>
      </div>
      <div class="layout">
        <div>
          <div class="toolbar">
            <button class="btn sm" data-mode="note">\u{1F4CC} Note</button>
            <button class="btn sm" data-mode="pen">✎ Pen</button>
            ${COLORS.map((c) => `<span class="swatch" data-c="${c}" style="background:${c}" role="button" tabindex="0" aria-label="Pen color ${c}"></span>`).join("")}
            <span class="spacer" style="flex:1"></span>
            <button class="btn ghost sm" id="undo">Undo stroke</button>
            <button class="btn ghost sm" id="clearInk">Clear ink</button>
          </div>
          <div class="stage" id="stage"><img id="img" src="img/pipeline.jpg" alt="Bullard's PIBBY pipeline: industrial externality generation, NIMBY deflection, the path of least resistance, and the PIBBY endpoint"><canvas id="cv"></canvas><div id="pins"></div></div>
        </div>
        <div class="card">
          <h3>Notes</h3>
          <div id="notes"></div>
          <p class="small muted" id="noNotes">Click anywhere on the image in <b>Note</b> mode to add a pin.</p>
        </div>
      </div>

      <div class="card" style="margin-top:20px">
        <h2>Part 2 · Map it onto Chester</h2>
        <p class="muted">For each link in the mechanism: does it apply in Chester, Pennsylvania? Give the evidence: Bullard, the reading on Chester, what you know about the city.</p>
        <div style="overflow-x:auto"><table class="links"><thead><tr><th style="width:32%">Link</th><th>In Chester?</th><th>Evidence</th></tr></thead><tbody>
          ${STAGES.map(([id, name, desc]) => `<tr><td><b>${esc(name)}</b><br><span class="small muted">${esc(desc)}</span></td>
            <td><select data-link="${id}" aria-label="Does ${esc(name)} apply in Chester?"><option value="">—</option><option>Yes</option><option>Partly</option><option>No</option><option>Not sure</option></select></td>
            <td><textarea data-ev="${id}" style="min-height:54px" placeholder="What's the evidence?" aria-label="Evidence for ${esc(name)}"></textarea></td></tr>`).join("")}
        </tbody></table></div>

        <h2 style="margin-top:26px">Part 3 · Where is the wrong?</h2>
        <p class="muted">Summarizing the mechanism isn't the same as evaluating it. Which link is the actual <i>moral</i> wrong, meaning the point where someone did something they shouldn't have? Name who, and say why that link and not the others.</p>
        <label for="ws">The link where the wrong happens</label>
        <select id="ws"><option value="">—</option>${STAGES.map(([id, name]) => `<option value="${id}">${esc(name)}</option>`).join("")}<option value="none">No single link: the wrong is the whole system</option><option value="no-wrong">There's no moral wrong here, only bad outcomes</option></select>
        <label for="wy">Why this link, and who is responsible?</label>
        <textarea id="wy" style="min-height:130px"></textarea>
        <div id="msg" style="margin-top:14px"></div>
        <div style="margin-top:12px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <button class="btn accent" id="dlImg">Download the marked-up map</button>
          <button class="btn ghost" id="dlTxt">Download our answers</button>
          <button class="btn ghost" id="wipe">Clear everything</button>
          <span class="small muted">Saved in this browser as you work. Nothing is uploaded.</span>
        </div>
      </div>`;

    STAGES.forEach(([id]) => {
      const l = D.links[id] || {};
      $(`[data-link="${id}"]`).value = l.applies || "";
      $(`[data-ev="${id}"]`).value = l.evidence || "";
    });
    $("#ws").value = D.wrongStage; $("#wy").value = D.wrong;
    app.addEventListener("input", onForm); app.addEventListener("change", onForm);

    $$("[data-mode]").forEach((b) => b.onclick = () => setMode(b.dataset.mode));
    $$(".swatch").forEach((s) => {
      const pick = () => { color = s.dataset.c; $$(".swatch").forEach((x) => x.classList.toggle("on", x === s)); setMode("pen"); };
      s.onclick = pick; s.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } };
    });
    $$(".swatch")[0].classList.add("on");
    $("#undo").onclick = () => { D.strokes.pop(); save(); draw(); };
    $("#clearInk").onclick = () => { if (D.strokes.length) { D.strokes = []; save(); draw(); } };
    $("#dlImg").onclick = downloadImage;
    $("#dlTxt").onclick = downloadText;
    $("#wipe").onclick = () => { if (confirm("Clear all pins, ink and answers on this device?")) { store.del(DK); location.reload(); } };
    setMode("note");
    setupCanvas();
    renderNotes();
  }

  function onForm(e) {
    const t = e.target;
    if (t.dataset.link) (D.links[t.dataset.link] ||= {}).applies = t.value;
    else if (t.dataset.ev) (D.links[t.dataset.ev] ||= {}).evidence = t.value;
    else if (t.id === "ws") D.wrongStage = t.value;
    else if (t.id === "wy") D.wrong = t.value;
    else if (t.dataset.pin != null) D.pins[Number(t.dataset.pin)].text = t.value;
    else return;
    save();
  }

  function setMode(m) {
    mode = m;
    $$("[data-mode]").forEach((b) => b.classList.toggle("on", b.dataset.mode === m));
    $("#stage").className = `stage ${m}`;
  }

  // ------------------------------------------------------------------ canvas
  let cv, ctx, drawing = null;
  function setupCanvas() {
    cv = $("#cv"); ctx = cv.getContext("2d");
    const img = $("#img");
    const fit = () => {
      const r = img.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      draw();
    };
    img.complete ? fit() : (img.onload = fit);
    window.addEventListener("resize", fit);
    const pos = (e) => {
      const r = cv.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
    };
    cv.addEventListener("pointerdown", (e) => {
      const p = pos(e);
      if (mode === "note") {
        D.pins.push({ x: p[0], y: p[1], text: "" }); save(); renderNotes();
        const ta = $(`[data-pin="${D.pins.length - 1}"]`); ta && ta.focus();
        return;
      }
      cv.setPointerCapture(e.pointerId);
      drawing = { c: color, w: 0.0045, pts: [p] };
      D.strokes.push(drawing);
    });
    cv.addEventListener("pointermove", (e) => { if (drawing) { drawing.pts.push(pos(e)); draw(); } });
    const end = () => { if (drawing) { drawing = null; save(); } };
    cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
  }
  function paintStrokes(c, W, H) {
    c.lineCap = "round"; c.lineJoin = "round";
    for (const s of D.strokes) {
      c.strokeStyle = s.c; c.lineWidth = Math.max(2, s.w * W);
      c.beginPath();
      s.pts.forEach(([x, y], i) => (i ? c.lineTo(x * W, y * H) : c.moveTo(x * W, y * H)));
      if (s.pts.length === 1) c.lineTo(s.pts[0][0] * W + 0.1, s.pts[0][1] * H);
      c.stroke();
    }
  }
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    paintStrokes(ctx, cv.width, cv.height);
    $("#pins").innerHTML = D.pins.map((p, i) => `<div class="pin" style="left:${p.x * 100}%;top:${p.y * 100}%">${i + 1}</div>`).join("");
  }
  function renderNotes() {
    $("#notes").innerHTML = D.pins.map((p, i) => `
      <div class="note-item"><span class="num">${i + 1}</span>
        <textarea data-pin="${i}" placeholder="What does this pin mark?" aria-label="Note ${i + 1}">${esc(p.text)}</textarea>
        <button data-del="${i}" title="Delete note" aria-label="Delete note ${i + 1}">×</button></div>`).join("");
    $("#noNotes").classList.toggle("hidden", D.pins.length > 0);
    $$("[data-del]").forEach((b) => b.onclick = () => { D.pins.splice(Number(b.dataset.del), 1); save(); renderNotes(); });
    draw();
  }

  function composite() {
    const img = $("#img");
    const W = img.naturalWidth, H = img.naturalHeight;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0, W, H);
    paintStrokes(x, W, H);
    D.pins.forEach((p, i) => {
      const cx = p.x * W, cy = p.y * H, r = W * 0.012;
      x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fillStyle = "#ffd24a"; x.fill();
      x.lineWidth = 3; x.strokeStyle = "#111"; x.stroke();
      x.fillStyle = "#111"; x.font = `700 ${Math.round(r * 1.1)}px IBM Plex Sans, sans-serif`; x.textAlign = "center"; x.textBaseline = "middle";
      x.fillText(String(i + 1), cx, cy + 1);
    });
    return c;
  }
  function downloadBlob(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function showMsg(kind, text) { const m = $("#msg"); m.className = `banner ${kind}`; m.textContent = text; }

  function downloadImage() {
    composite().toBlob((b) => { if (b) { downloadBlob(b, "mechanism-map.png"); showMsg("ok", "Map downloaded. Download your answers too, if you're handing this in."); } else showMsg("err", "The image couldn't be made in this browser."); }, "image/png");
  }
  function downloadText() {
    const name = (id) => (STAGES.find(([s]) => s === id) || [])[1] || $("#ws").selectedOptions[0]?.text || "—";
    const lines = ["MECHANISM MAP: BULLARD → CHESTER", ""];
    lines.push("Pins:"); D.pins.forEach((p, i) => lines.push(`  ${i + 1}. ${p.text || "(no note)"}`)); if (!D.pins.length) lines.push("  (none)");
    lines.push("", "Links in Chester:");
    STAGES.forEach(([id, n]) => { const l = D.links[id] || {}; lines.push(`  ${n}: ${l.applies || "—"}${l.evidence ? " — " + l.evidence : ""}`); });
    lines.push("", `Where the wrong happens: ${D.wrongStage ? name(D.wrongStage) : "—"}`, "", D.wrong || "");
    downloadBlob(new Blob([lines.join("\r\n")], { type: "text/plain;charset=utf-8" }), "mechanism-map-answers.txt");
    showMsg("ok", "Answers downloaded.");
  }

  start();
})();
