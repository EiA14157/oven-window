# Oven Window

Private source snapshot for https://oven-window.knightatha.chatgpt.site (Sites v1), verified on 2026-10-08. Original deployment source commit: `28d6d6994ada716ff010171ce08a7513a16ced37`. The GitHub repository begins with a new snapshot commit and contains no prior private Git history.

## Run

Serve the `dist/` directory with a static HTTP server, for example:

```sh
python -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:8080/. The production files are plain HTML, CSS and JavaScript; no build is required.

## Checks

Run `npm test` with Node.js 20+; no install is needed. `tests/browser_qa.py` is an optional existing Playwright suite that assumes Linux Chromium at `/usr/bin/chromium` and a local server at port 8765. Its presence does not establish browser verification.

## Hosting and source

`.openai/hosting.json` preserves the active Sites configuration. `firebase.json` is a historical alternate-host configuration with `hosting.dist`; it is not the active deployment and must be reviewed before any Firebase deployment. This backup does not deploy a site. The scheduling model is simplified and does not establish food safety or recipe instructions.

Runtime files in `dist/` are copied byte-for-byte from the deployment source commit. See `source-snapshot.json` for original file hashes. Development imports, dependency manifests and this documentation are normalized for a standalone checkout.

## Assets and exclusions

See `ASSET-NOTES.md`. Existing Git metadata, credentials, environment files, node_modules, caches, browser profiles, downloads, archives, deployment tokens, personal logs and QA screenshots/results are excluded. No essential production file was excluded. No open-source code license has been assigned. Keep this repository private; future publication requires a separate authorized decision.
