/* Brainstorm proxy for the Active Learning Library.
   Holds the Anthropic API key, so the static site never sees it, and keeps the
   integration narrow: it only accepts a known format id plus a few short fields,
   and builds the prompt itself from the site's own catalog. */
import Anthropic from "@anthropic-ai/sdk";
import { byId } from "../../assets/js/formats.js";
import { SYSTEM, IDEAS_SCHEMA, cleanInputs, cleanIdea, ideasPrompt, developPrompt } from "../../assets/js/prompt.js";

const json = (body, status, cors) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...cors } });

function corsFor(req, env) {
  const origin = req.headers.get("Origin") || "";
  const allowed = String(env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!allowed.includes(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function textOf(msg) {
  return (msg.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const cors = corsFor(req, env);
    if (!cors) return json({ error: "This brainstorm service only answers the Active Learning Library site." }, 403, {});
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST" || url.pathname !== "/brainstorm") return json({ error: "Not found." }, 404, cors);

    // Per-visitor rate limit (Cloudflare rate-limiting binding; see wrangler.toml).
    if (env.RATE_LIMITER) {
      const ip = req.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return json({ error: "That’s a lot of brainstorming in a short time. Wait a minute and try again." }, 429, cors);
    }

    const len = Number(req.headers.get("Content-Length") || 0);
    if (len > 8000) return json({ error: "That request is too long." }, 413, cors);
    let body;
    try { body = await req.json(); } catch { return json({ error: "Bad request." }, 400, cors); }

    const f = byId[String(body.format || "")];
    if (!f) return json({ error: "Unknown format." }, 400, cors);
    const inputs = cleanInputs(body.inputs);
    if (!inputs.topic) return json({ error: "Add a topic, reading or case first." }, 400, cors);
    const step = body.step === "develop" ? "develop" : "ideas";
    const idea = step === "develop" ? cleanIdea(body.idea) : null;
    if (step === "develop" && !idea.title) return json({ error: "Pick an idea to develop first." }, 400, cors);

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const model = env.MODEL || "claude-opus-5-5";
    const outputConfig = { effort: env.EFFORT || "low" };
    if (step === "ideas") outputConfig.format = { type: "json_schema", schema: IDEAS_SCHEMA };

    let msg;
    try {
      msg = await client.beta.messages.create({
        model,
        max_tokens: step === "ideas" ? 4000 : 8000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: SYSTEM,
        output_config: outputConfig,
        messages: [{ role: "user", content: step === "ideas" ? ideasPrompt(f, inputs) : developPrompt(f, inputs, idea) }]
      });
    } catch (e) {
      // Most specific first: connection and rate-limit errors are both subclasses of APIError.
      if (e instanceof Anthropic.APIConnectionError) return json({ error: "Couldn’t reach Claude just now. Try again in a moment." }, 503, cors);
      if (e instanceof Anthropic.RateLimitError || e instanceof Anthropic.OverloadedError) return json({ error: "The brainstorm service is busy. Try again in a minute." }, 503, cors);
      if (e instanceof Anthropic.APIError) { console.error("Anthropic API error", e.status, e.message); return json({ error: "The brainstorm service hit an error. Try again, or use Keep going in Claude." }, 502, cors); }
      console.error(e);
      return json({ error: "Something went wrong." }, 500, cors);
    }

    if (msg.stop_reason === "refusal") return json({ error: "Claude declined this one. Try rewording the topic." }, 422, cors);
    const text = textOf(msg);
    if (step === "develop") {
      if (!text) return json({ error: "Nothing came back. Try again." }, 502, cors);
      return json({ text: text.slice(0, 12000) }, 200, cors);
    }
    let parsed;
    try { parsed = JSON.parse(text); } catch { return json({ error: "The ideas came back garbled. Try again." }, 502, cors); }
    const ideas = Array.isArray(parsed.ideas) ? parsed.ideas.slice(0, 3).map(cleanIdea) : [];
    return json({ fit: String(parsed.fit || "").slice(0, 400), ideas }, 200, cors);
  }
};
