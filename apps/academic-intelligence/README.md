# Alireza Yazdi · ALI Academic Intelligence (flat build for GitHub Pages)

Upload every file in this folder to the repository root (keep `.nojekyll`), then enable Pages. Relative paths only, so it works at https://<user>.github.io/<repo>/.

- Fully static: no server. Academic search calls OpenAlex directly from the browser.
- AI features (professor, exams, notes analysis, research gap) need your own HTTPS backend exposing /api/ai/*; set it in "Data Integrity & Backup → Backend endpoint". Keep the Gemini key on that server.
- Isolation: IndexedDB `ay_ali_academic_os_db`, localStorage `ay.ali:*`, self-hosted fonts, strict CSP (same-origin assets + https API only). No service worker, so nothing else on the same github.io origin is affected.
