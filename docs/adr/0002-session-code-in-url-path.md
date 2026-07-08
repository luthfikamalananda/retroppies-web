# Address a Session by URL path (`/:sessionCode`), not query param

The Session Code is carried as a URL path segment (`retroppies.com/RTP-YYYYMMDD-XXXX`), with sub-views nested under it (`/RTP-.../video`). This deviates from PRD v1.0, which specified a query param (`/?session=RTP-...`).

We chose the path form because the QR code the photobooth prints encodes exactly this URL, and clean paths read and share better than a query string. The trade-off: the app now depends on the server returning `index.html` for arbitrary deep paths (SPA fallback), which is what makes correct asset paths critical — see [0001](./0001-vite-base-absolute.md). The printed/backend-generated QR format is effectively locked to `/:sessionCode`, so changing this scheme later is expensive.
