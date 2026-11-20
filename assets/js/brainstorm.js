/* The brainstorm panel on each format page.
   With a Worker endpoint configured: three ideas, then develop one (a few calls per format).
   Without one: hand the same prompt to Claude via a link, or copy it. */
import { cleanInputs, cleanIdea, handoffPrompt } from "./prompt.js";

const CFG = window.ALL_CONFIG || {};
const ENDPOINT = (CFG.brainstormEndpoint || "").replace(/\/+$/, "");
const MAX = Math.max(1, Number(CFG.requestsPerFormat) || 3);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const store = {
  get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
/* inputs carry across formats, so a visitor only describes their class once */
const shared = {
  get() { try { return JSON.parse(localStorage.getItem("all.class")) || {}; } catch (e) { return {}; } },
  set(v) { try { localStorage.setItem("all.class", JSON.stringify(v)); } catch (e) {} }
};

/* Minimal renderer for the develop step: numbered parts become headings, dashes become lists. */
function renderDraft(text) {
  const lines = String(text).split(/\r?\n/);
  let out = "", inList = false;
  const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>");
  const close = () => { if (inList) { out += "</ul>"; inList = false; } };
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) { close(); continue; }
    const head = l.match(/^(?:#+\s*)?(?:\*\*)?([1-4])[.)]\s*(.+?)(?:\*\*)?:?\s*$/);
    if (head && head[2].length < 70 && !/[.?!]$/.test(head[2])) { close(); out += `<h4>${inline(head[2].replace(/\*\*/g, ""))}</h4>`; continue; }
    if (/^#{1,4}\s/.test(l)) { close(); out += `<h4>${inline(l.replace(/^#+\s*/, ""))}</h4>`; continue; }
    const li = l.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (li) { if (!inList) { out += "<ul>"; inList = true; } out += `<li>${inline(li[1])}</li>`; continue; }
    close(); out += `<p>${inline(l)}</p>`;
  }
  close();
  return out;
}

function claudeUrl(prompt) { return "https://claude.ai/new?q=" + encodeURIComponent(prompt); }

async function copy(text, statusEl, ok) {
  try { await navigator.clipboard.writeText(text); statusEl.textContent = ok; statusEl.className = "bs-status"; }
  catch (e) { statusEl.textContent = "Copying was blocked by the browser. Select the text and copy it by hand."; statusEl.className = "bs-status err"; }
}

export function mountBrainstorm(el, f) {
  const key = `all.bs.${f.id}`;
  let S = store.get(key) || { used: 0, ideas: null, fit: "", picked: null, draft: "" };
  let busy = false, ctl = null;
  const save = () => store.set(key, S);
  const remaining = () => Math.max(0, MAX - S.used);

  function readInputs() {
    const v = (id) => (el.querySelector("#" + id)?.value || "");
    const i = cleanInputs({ course: v("bsCourse"), topic: v("bsTopic"), minutes: v("bsMin"), size: v("bsSize"), notes: v("bsNotes"), steer: v("bsSteer") });
    shared.set({ course: i.course, topic: i.topic, minutes: i.minutes, size: i.size, notes: i.notes });
    return i;
  }

  function meter() {
    if (!ENDPOINT) return "";
    let dots = "";
    for (let n = 0; n < MAX; n++) dots += `<i class="${n < S.used ? "used" : ""}"></i>`;
    return `<div class="bs-meter" aria-label="${remaining()} of ${MAX} brainstorm requests left for this format">${dots}<span>&nbsp;${remaining()} of ${MAX} left for this format</span></div>`;
  }

  function ideasHTML() {
    if (!S.ideas) return "";
    const cards = S.ideas.map((x, n) => `
      <div class="idea-card">
        <h3>${esc(x.title)}</h3>
        <p>${esc(x.content)}</p>
        <p class="turn"><span class="lbl">The turn</span>${esc(x.turn)}</p>
        <p><span class="lbl">Watch for</span>${esc(x.risk)}</p>
        ${ENDPOINT ? `<button class="btn btn-dark btn-sm" data-dev="${n}" ${remaining() ? "" : "disabled"}>Develop this one</button>` : ""}
      </div>`).join("");
    return `<div class="bs-out">${S.fit ? `<p class="bs-fit">${esc(S.fit)}</p>` : ""}${cards}
      <div class="field" style="margin-top:.6rem"><label for="bsSteer">Not quite? Steer it <small>(optional, used on your next request)</small></label>
      <input id="bsSteer" maxlength="240" placeholder="e.g. use a local case; shorter; no laptops"></div>
      <div class="bs-actions"><button class="btn btn-ghost btn-sm" id="bsAgain" ${remaining() ? "" : "disabled"}>Three more ideas</button></div></div>`;
  }

  function draftHTML() {
    if (!S.draft) return "";
    return `<div class="bs-out"><p class="kicker" style="margin-bottom:.6rem">${esc(S.picked?.title || "Your version")}</p>
      <div class="draft">${renderDraft(S.draft)}</div>
      <div class="bs-actions" style="margin-top:.8rem"><button class="btn btn-primary btn-sm" id="bsCopyDraft">Copy the draft</button>
      <a class="btn btn-ghost btn-sm" id="bsContinue" target="_blank" rel="noopener">Keep going in Claude</a></div>
      <button class="btn btn-ghost btn-sm" id="bsBack" style="margin-top:.5rem;width:100%">Back to the ideas</button></div>`;
  }

  function render(status = "", isErr = false) {
    const saved = shared.get();
    el.innerHTML = `
      <p class="kicker"><span class="dot-claude"></span>&nbsp;Brainstorm with Claude</p>
      <h2>Make it yours.</h2>
      <p class="sub">Describe your class and Claude sketches three versions of <b>${esc(f.name)}</b> for it.</p>
      <form id="bsForm" novalidate>
        <div class="field"><label for="bsCourse">Course and students</label><input id="bsCourse" maxlength="120" placeholder="e.g. Intro to Ethics, first-years" value="${esc(saved.course)}"></div>
        <div class="field"><label for="bsTopic">Topic, reading or case</label><input id="bsTopic" maxlength="160" placeholder="e.g. Hobbes, Leviathan ch. 13–14" value="${esc(saved.topic)}"></div>
        <div class="row2">
          <div class="field"><label for="bsMin">Minutes</label><select id="bsMin">${["20", "30", "50", "75", "90"].map((m) => `<option ${String(saved.minutes || "50") === m ? "selected" : ""}>${m}</option>`).join("")}</select></div>
          <div class="field"><label for="bsSize">Class size</label><input id="bsSize" inputmode="numeric" maxlength="4" placeholder="24" value="${esc(saved.size)}"></div>
        </div>
        <div class="field"><label for="bsNotes">Anything else <small>(optional)</small></label><textarea id="bsNotes" maxlength="400" placeholder="Constraints, the misreading to target, what the next session needs">${esc(saved.notes)}</textarea></div>
        <div class="bs-actions">
          ${ENDPOINT
            ? (remaining()
              ? `<button class="btn btn-primary" type="submit" id="bsGo" ${busy ? "disabled" : ""}>${busy ? "Thinking…" : "Brainstorm three versions"}</button>`
              : `<a class="btn btn-primary" id="bsHand" target="_blank" rel="noopener" href="#">Continue in Claude</a>`)
            : `<a class="btn btn-primary" id="bsOpen" target="_blank" rel="noopener" href="#">Brainstorm in Claude</a>
               <button class="btn btn-ghost" type="button" id="bsCopy">Copy prompt</button>`}
        </div>
      </form>
      <div class="bs-status ${isErr ? "err" : ""}" id="bsStatus" role="status">${status}</div>
      ${meter()}
      ${S.draft ? draftHTML() : ideasHTML()}
      <p class="bs-note">${ENDPOINT
        ? "Your answers are sent to Claude (Anthropic) to write the ideas, and aren’t stored by this site. Don’t include student names or anything private. Check every invented fact before you use it."
        : "This opens a new chat on claude.ai with the format and your class details already written into the prompt. You’ll need a Claude account. Don’t include student names or anything private."}</p>`;
    wire();
  }

  function setStatus(html, isErr) { const s = el.querySelector("#bsStatus"); if (s) { s.innerHTML = html; s.className = "bs-status" + (isErr ? " err" : ""); } }

  async function call(step, body) {
    if (busy) return null;
    if (!remaining()) { setStatus("That’s the limit for this format in one visit. Use “Keep going in Claude” to continue.", true); return null; }
    busy = true; ctl = new AbortController();
    const go = el.querySelector("#bsGo"); if (go) { go.disabled = true; go.textContent = "Thinking…"; }
    el.querySelectorAll("[data-dev], #bsAgain").forEach((b) => (b.disabled = true));
    setStatus(`<span class="thinking"><i></i><i></i><i></i></span>${step === "ideas" ? "Sketching three versions. This takes about twenty seconds." : "Writing the run of show. This takes up to a minute."}`);
    try {
      const res = await fetch(ENDPOINT + "/brainstorm", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: ctl.signal,
        body: JSON.stringify({ format: f.id, step, ...body })
      });
      let data = null; try { data = await res.json(); } catch (e) {}
      if (!res.ok) throw new Error((data && data.error) || `The brainstorm service answered ${res.status}.`);
      S.used++; save();
      return data;
    } catch (e) {
      busy = false;
      render(esc(e.name === "AbortError" ? "Stopped." : (e.message || "The brainstorm didn’t go through. Try again, or use Keep going in Claude.")), true);
      return null;
    } finally { busy = false; }
  }

  function wire() {
    const form = el.querySelector("#bsForm");
    const status = el.querySelector("#bsStatus");

    if (!ENDPOINT) {
      const open = el.querySelector("#bsOpen");
      const refresh = () => { open.href = claudeUrl(handoffPrompt(f, readInputs())); };
      refresh();
      form.addEventListener("input", refresh);
      open.addEventListener("click", (e) => {
        const i = readInputs();
        if (!i.topic) { e.preventDefault(); status.textContent = "Add a topic, reading or case first."; status.className = "bs-status err"; el.querySelector("#bsTopic").focus(); return; }
        refresh();
      });
      el.querySelector("#bsCopy").addEventListener("click", () => copy(handoffPrompt(f, readInputs()), status, "Prompt copied. Paste it into a chat with Claude."));
      return;
    }

    const hand = el.querySelector("#bsHand");
    if (hand) {
      const refreshHand = () => { hand.href = claudeUrl(handoffPrompt(f, readInputs())); };
      refreshHand(); form.addEventListener("input", refreshHand);
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputs = readInputs();
      if (!inputs.topic) { setStatus("Add a topic, reading or case first.", true); el.querySelector("#bsTopic").focus(); return; }
      const data = await call("ideas", { inputs });
      if (!data) return;
      S.ideas = (data.ideas || []).slice(0, 3).map(cleanIdea); S.fit = String(data.fit || ""); S.draft = ""; S.picked = null; save();
      render(S.ideas.length ? "Pick one to develop, or steer and ask again." : "No ideas came back. Try rephrasing your topic.", !S.ideas.length);
    });

    el.querySelector("#bsAgain")?.addEventListener("click", async () => {
      const inputs = readInputs();
      if (!inputs.topic) { setStatus("Add a topic, reading or case first.", true); return; }
      const data = await call("ideas", { inputs });
      if (!data) return;
      S.ideas = (data.ideas || []).slice(0, 3).map(cleanIdea); S.fit = String(data.fit || ""); save();
      render("Pick one to develop.");
    });

    el.querySelectorAll("[data-dev]").forEach((b) => b.addEventListener("click", async () => {
      const idea = S.ideas[Number(b.dataset.dev)];
      const inputs = readInputs();
      const data = await call("develop", { inputs, idea });
      if (!data) return;
      S.picked = idea; S.draft = String(data.text || ""); save();
      render(S.draft ? "Done. Copy it, or keep going in Claude." : "Nothing came back. Try again.", !S.draft);
      el.querySelector(".bs-out")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }));

    const cont = el.querySelector("#bsContinue");
    if (cont) cont.href = claudeUrl(handoffPrompt(f, readInputs(), S.picked) + "\n\nHere is the draft so far:\n\n" + S.draft.slice(0, 3500));
    el.querySelector("#bsCopyDraft")?.addEventListener("click", () => copy(`${f.name}: ${S.picked?.title || ""}\n\n${S.draft}`, status, "Draft copied."));
    el.querySelector("#bsBack")?.addEventListener("click", () => { S.draft = ""; save(); render(); });
  }

  render();
}
