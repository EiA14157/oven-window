# Oven Window

Open-source snapshot for https://oven-window.knightatha.chatgpt.site (Sites v1), verified on 2026-10-08. Original deployment source commit: `28d6d6994ada716ff010171ce08a7513a16ced37`. The GitHub repository begins with a new snapshot commit; earlier deployment history is not included.

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

See `ASSET-NOTES.md`. Existing Git metadata, credentials, environment files, node_modules, caches, browser profiles, downloads, archives, deployment tokens, personal logs and QA screenshots/results are excluded. No essential production file was excluded. The application code, project documentation and original project artwork are available under the MIT license. See the license scope below.

## License

Copyright (c) 2026 EiA.

The application source code, project documentation and original project artwork are licensed under [MIT](LICENSE). Original project artwork includes the project SVG icon.

Third-party components retain their existing licenses and notices. The project MIT license does not replace dependency licenses or license works merely linked from this repository. See [ASSET-NOTES.md](ASSET-NOTES.md) for asset provenance and dependency details.
