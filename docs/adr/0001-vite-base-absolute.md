# Use `base: '/'` in vite.config.js, never `base: './'`

The app is a `BrowserRouter` SPA served from the root of `retroppies.com` behind nginx with a `try_files ... /index.html` SPA fallback. We build with Vite's default `base: '/'` so asset references in `index.html` are absolute (`/assets/...`, `/registerSW.js`).

Do **not** set `base: './'`. Relative asset paths get resolved against the current route's directory, so a deep link like `/CODE/video` requests `/CODE/assets/...`, which does not exist. nginx's SPA fallback then serves `index.html` (`text/html`) for those missing assets, and the browser rejects it — `Failed to load module script: … MIME type "text/html"` / `Unexpected token '<'` — producing a white screen. Single-segment routes like `/CODE` happen to work by accident, which makes the bug look intermittent.

`base: './'` was introduced once (commit `9773c72`) and reverted for exactly this reason. It is only correct when the app is served from an unknown/nested sub-path, which is not our case.
