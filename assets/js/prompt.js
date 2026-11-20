/* Brainstorm prompts. Imported by the site (for "Open in Claude" and "Copy prompt")
   and by the Worker (which builds the real request server-side from a format id
   plus a few short, length-capped fields — never from free client text). */

export const LIMITS = { course: 120, topic: 160, minutes: 4, size: 4, notes: 400, steer: 240, idea: 900 };

export function clean(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function cleanInputs(raw = {}) {
  return {
    course: clean(raw.course, LIMITS.course),
    topic: clean(raw.topic, LIMITS.topic),
    minutes: clean(raw.minutes, LIMITS.minutes).replace(/[^0-9]/g, ""),
    size: clean(raw.size, LIMITS.size).replace(/[^0-9]/g, ""),
    notes: clean(raw.notes, LIMITS.notes),
    steer: clean(raw.steer, LIMITS.steer)
  };
}

export const SYSTEM = [
  "You help college instructors adapt one specific active-learning format to their own course.",
  "Stay on that job: if the request is not about adapting a classroom activity, say in one sentence that this tool only brainstorms classroom activities, and stop.",
  "Be concrete and practical. Write for a busy instructor who will run this next week. No praise, no preamble, no headings beyond what is asked for.",
  "Never invent quotations from real authors or page numbers. If you invent a case detail, a statistic or a figure for the exercise, mark it [invented].",
  "Keep the format's core mechanism intact; that mechanism is why it works. If the format fits the topic badly, say so plainly and suggest what would fit better."
].join(" ");

function formatBrief(f) {
  const lines = [
    `FORMAT: ${f.name}`,
    `What it is: ${f.one}`,
    `Why it works: ${f.why}`,
    "How it runs:",
    ...f.steps.map(([t, d]) => `- ${t}: ${d}`),
    `What gets swapped in: ${f.slots.join("; ")}`
  ];
  if (f.roles) lines.push("Roles:", ...f.roles.map(([n, d]) => `- ${n}: ${d}`));
  if (f.watch && f.watch.length) lines.push("Known failure modes:", ...f.watch.map((w) => `- ${w}`));
  lines.push("Example runs:", ...f.runs.slice(0, 3).map((r) => `- ${r.title} (${r.course}): ${r.note}`));
  return lines.join("\n");
}

function classBrief(i) {
  return [
    "NEW CLASS",
    `Course and students: ${i.course || "(not given)"}`,
    `Topic, reading or case: ${i.topic || "(not given)"}`,
    `Minutes available: ${i.minutes || "50"}`,
    `Class size: ${i.size || "(not given)"}`,
    `Other notes: ${i.notes || "none"}`
  ].join("\n");
}

export function ideasPrompt(f, i) {
  return [
    formatBrief(f), "", classBrief(i), "",
    i.steer ? `The instructor saw a first set of ideas and asked for this change: ${i.steer}\n` : "",
    "Brainstorm three distinct versions of this format for the new class. They should differ in the case or content they use, not just in wording.",
    "For each version give: a short title (under 8 words); the content in one or two sentences (the actual case, cards, rule or question, not a placeholder); the turn, meaning the moment where the activity changes what students think, in one sentence; and the most likely way it goes wrong, in one sentence.",
    "Also give one sentence on how well this format fits the topic at all."
  ].join("\n");
}

export const IDEAS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["fit", "ideas"],
  properties: {
    fit: { type: "string" },
    ideas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "content", "turn", "risk"],
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          turn: { type: "string" },
          risk: { type: "string" }
        }
      }
    }
  }
};

export function cleanIdea(raw = {}) {
  const c = (k, n) => clean(raw[k], n);
  return { title: c("title", 120), content: c("content", 500), turn: c("turn", 300), risk: c("risk", 300) };
}

export function developPrompt(f, i, idea) {
  return [
    formatBrief(f), "", classBrief(i), "",
    "THE VERSION TO DEVELOP",
    `Title: ${idea.title}`,
    `Content: ${idea.content}`,
    `The turn: ${idea.turn}`,
    `Risk: ${idea.risk}`,
    i.steer ? `Instructor's note on this version: ${i.steer}` : "",
    "",
    "Write it up so the instructor could run it. Use exactly these numbered parts, in plain prose and short lists:",
    `1. Run of show: clock times that add up to ${i.minutes || "50"} minutes.`,
    "2. The materials, written out in full: the actual cards, roles, prompts, cases, rule steps or questions. No placeholders.",
    "3. What to say at the turn: the instructor's words at the reveal, the flip or the debrief, in two to four sentences.",
    "4. Two ways this version could fail in the room, each with a fix.",
    "Keep the whole thing under 700 words. Do not quote copyrighted readings at length."
  ].filter((x) => x !== "").join("\n");
}

/* A single self-contained prompt for people who'd rather work in Claude directly. */
export function handoffPrompt(f, i, idea) {
  const ask = idea
    ? developPrompt(f, i, idea)
    : ideasPrompt(f, i) + "\nThen ask me which version to develop into a full run of show.";
  return `${SYSTEM}\n\n${ask}`;
}
