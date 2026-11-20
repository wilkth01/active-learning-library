# Active Learning Library

Twenty-six in-class formats from one semester (Fall 2026, Widener University: PHIL 350, PHIL 352 and NURS 702), filed by the structure underneath them. Each format has its run of show, why it works, the slots you swap in, failure modes, the original runs, and a Claude brainstorm panel for adapting it to another course.

It's a static site with no build step, made to be served by GitHub Pages.

| Path | What it is |
|---|---|
| `index.html` | Home: the idea, four playable activities, the library, the brainstorm, notes |
| `format.html#<id>` | One format, with a printable run sheet and the brainstorm panel |
| `play/keystone/` | Project Keystone siting meeting and the mechanism map (single-device version) |
| `play/three-slots.html` | Three Slots (care-management triage, Obermeyer) |
| `play/making-rate.html` | Making Rate (warehouse quota simulation) |
| `play/sort-the-conduct.html` | Sort the Conduct (Purdue Pharma card sort) |
| `assets/js/formats.js` | **The catalog.** Edit formats here; the site and the Worker both read it |
| `assets/js/prompt.js` | Brainstorm prompts, shared with the Worker |
| `config.js` | Brainstorm endpoint and per-format request limit |
| `worker/` | Optional Cloudflare Worker that calls Claude (see `worker/README.md`) |

## Preview locally

The pages use ES modules, so open them through a local server, not straight from disk:

```
python -m http.server 8080
```

Then open http://localhost:8080.

## Publish on GitHub Pages

Push this folder to a repository (for example `wilkth01/active-learning-library`). Then go to **Settings → Pages → Deploy from a branch → main / root**. The `worker/` source gets published along with the site. That's harmless, since it holds no secrets: the API key lives only in Cloudflare.

## The brainstorm

Without a Worker, each panel opens claude.ai with the prompt already written. With a Worker deployed and its URL in `config.js`, the panel brainstorms on the page itself: three ideas, then a full run of show for the one you pick, with at most three requests per format per visit.

## The classroom version of Keystone

`play/keystone/` runs on one device: the clock, lock-in and reveal all happen in the browser, and the census data ships with the page. For a whole class with a shared clock, an instructor dashboard, a reveal hidden on the server, and CSV export, use [wilkth01/phil352-siting](https://github.com/wilkth01/phil352-siting).

## Custom domain

The site is served at **https://active-learning-library.tomwilk.net**. DNS for tomwilk.net is at Bluehost, which has a CNAME record `active-learning-library` → `wilkth01.github.io`, and the `CNAME` file in this repo tells GitHub Pages to answer for that name. Don't delete the `CNAME` file. The old `wilkth01.github.io/active-learning-library` address redirects here.

