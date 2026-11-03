# Alireza Yazdi — Interactive Research Portfolio

A portfolio presented as a phone floating inside a galaxy. Each project is an app on the phone's home screen and opens inside the device (or full page via the ↗ button).

**Live site:** `https://alirezasyazdi941-hash.github.io/alireza-yazdi-portfolio/` (after enabling GitHub Pages — see below)

| App | What it is | Stack |
|---|---|---|
| **Alireza Path** | Personal academic-path planner (PhD admissions pages, libraries, labs, conferences, skills checklist, calendar, notes). Offline PWA, data stays on device. | Vanilla JS, PWA |
| **DocScan Iran** | In-browser document scanner: perspective correction, shadow removal, file-size control. | React, OpenCV.js |
| **StoryFrame** | Story → storyboard → slideshow video (canvas + MediaRecorder), optional music and text-to-speech. Offline. | Vanilla JS, Canvas |
| **Research OS** | Bilingual research workspace: literature discovery, gap analysis, comparison matrix, experiment lab, knowledge graph, writing studio, publication-readiness checklist. Built-in local analysis engine; an optional Gemini backend exists in the source but is *not* active on this static site. | Angular 21 |
| **Void Cinema** | Cinema post-production and film-studio workspace, installable PWA. | Angular, Service Worker |
| **WebGL Studio** | Builder for scroll-driven interactive WebGL sites (Lenis, GSAP, three.js) for GitHub Pages. | Angular |
| **Uni Command** | Academic-journey command center for university applications. Its AI advisor needs a backend and is inactive on this static demo. | Angular, Tailwind |

## Design notes
- **No runtime dependencies on the landing page.** The galaxy is a hand-written WebGL point renderer (`assets/galaxy.js`, ~100 lines); the phone shell is plain JS/CSS. Fonts for Research OS are bundled, so nothing is fetched from third-party CDNs.
- Respects `prefers-reduced-motion`; falls back to a CSS gradient if WebGL is unavailable; bilingual (EN / فارسی) with RTL support.
- Apps are isolated in iframes on the same origin (they share `localStorage` per origin; keys are namespaced by each app).
- All profile text and the app list live in one file: `assets/data.js`.

## Run locally
```bash
npx serve .          # or: python3 -m http.server 8000
```

## Deploy on GitHub Pages
1. Create the repository `alireza-yazdi-portfolio` and push this folder to `main`.
2. Settings → Pages → Source: **Deploy from a branch** → `main` / root.
3. Open the URL GitHub shows. The `.nojekyll` file is already included.

## Tests
```bash
npm i -D playwright && npx playwright install chromium
node test/site.test.js
```
Checks: home screen, WebGL galaxy, each app loads inside the phone, close/Escape, Persian RTL mode, no console errors or failed requests, no horizontal overflow on mobile.

## Rebuilding Research OS
The `apps/research-os` folder is the production build (`ng build --base-href ./`). Fonts were self-hosted via `material-icons`, `@fontsource-variable/vazirmatn`, `@fontsource-variable/plus-jakarta-sans` and `@fontsource/jetbrains-mono`.

## Acknowledgements
Parts of this code base were developed with AI assistance (Claude, Gemini). Design decisions, integration and review are by the author. *(Edit or remove to match your university's policy.)*

## Cite
See `CITATION.cff`.

## License
MIT © 2026 Alireza Yazdi. Third-party: OpenCV.js (Apache-2.0), Angular (MIT), Vazirmatn (OFL), Material Icons (Apache-2.0).

## AI Lab and `ay-ai` (IndexedDB + SHA-256 cache)

`assets/lib/ay-ai.js` is a small dependency-free client for Pollinations (no key) and Hugging Face (your own token, supplied at runtime). Each request is canonicalised to JSON and hashed with SHA-256; the hash is the primary key of an IndexedDB store holding the text or image Blob. Identical requests are served locally, concurrent duplicates are merged, and the token is never part of the key or stored. Tests: `node test/ay-ai.test.js`.

## The film (`film/index.html`)

An interactive scroll film in five chapters. About 16,000 particles morph from noise into a neural network, a galaxy, a code window, a phone with the apps, and finally the initials "AY". Scrolling drives the morph (Lenis + GSAP ScrollTrigger), moving the pointer pushes particles away, clicking sends a shockwave, and the camera drifts with the story. English and Persian (RTL), responsive, `prefers-reduced-motion` aware.

Libraries are self-hosted in `film/vendor/` (three.js and Lenis are MIT; GSAP uses its free "Standard No Charge" license, see `film/vendor/LICENSES.txt`), so nothing is loaded from a CDN. The earlier 2D canvas version is kept as `film/classic.html` and is also the fallback when WebGL is unavailable. Tests: `node test/film.test.js`.
