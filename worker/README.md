# Brainstorm Worker

A small Cloudflare Worker that lets the site's brainstorm panels call Claude without putting an API key in the browser.

It stays narrow on purpose. It accepts only a known format id plus a few short, length-capped fields: course, topic, minutes, class size, notes, and an optional steer. It builds the prompt itself from `assets/js/formats.js` and `assets/js/prompt.js`, so the site and the Worker always agree. It answers only the origins listed in `ALLOWED_ORIGINS`, and it rate-limits each visitor to 6 requests a minute. The site separately caps each visitor at 3 requests per format per browser session (`requestsPerFormat` in `config.js`).

## Deploy

You need a Cloudflare account (the free plan is fine) and an Anthropic API key.

```
cd worker
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```

Wrangler prints the Worker's URL, something like `https://all-brainstorm.<you>.workers.dev`. Put that URL in `config.js` at the root of the site:

```js
window.ALL_CONFIG = { brainstormEndpoint: "https://all-brainstorm.<you>.workers.dev", requestsPerFormat: 3 };
```

The site is served from `https://active-learning-library.tomwilk.net`, which is already in `ALLOWED_ORIGINS` along with `https://wilkth01.github.io`. If you serve it from anywhere else, add that origin to `ALLOWED_ORIGINS` in `wrangler.toml` and redeploy.

## Cost

Every request runs on `claude-opus-5-5` at `low` effort (`MODEL` and `EFFORT` in `wrangler.toml`). A brainstorm returns three short ideas, and developing one writes a run of show of up to 700 words. Each request costs a few cents at most. To cut costs further, set `MODEL = "claude-haiku-5-5"`. It's much cheaper and still fine for this job.

**Set a monthly spend limit** for this key in the Anthropic Console. That's the real backstop if the page gets shared widely.

## Without the Worker

Leave `brainstormEndpoint` empty. The panels then show **Brainstorm in Claude**, which opens claude.ai with the same prompt already filled in, and **Copy prompt**. Nothing runs on your account.

## Local test

```
npx wrangler dev          # serves on http://localhost:8787
```

Set `brainstormEndpoint` to `http://localhost:8787` and serve the site from `http://localhost:8080`, which is already in `ALLOWED_ORIGINS`.
