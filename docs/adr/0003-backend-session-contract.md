# Backend Session Data contract

Session Data is fetched from the photobooth backend, and the app reads a fixed response shape. This record captures that contract (originally from PRD v1.0 §5), since it is an integration boundary not fully visible from the client code.

**Endpoint:** `GET https://api.retroppies.com/photobooth/sessions/:sessionCode`

**Success response** — `res.ok && json.success === true`; the app reads `json.result`:

```json
{
  "success": true,
  "result": {
    "sessionCode": "RTP-20260616-4QADFC",
    "invoiceNumber": "INV-1-20260616155404-7278",
    "photo1Url": "…/photo1.jpg",
    "photo2Url": "…/photo2.jpg",
    "photo3Url": "…/photo3.jpg",
    "photo4Url": "…/photo4.jpg",
    "photo5Url": "…/photo5.jpg",
    "gifUrl": "…/result.gif",
    "videoUrl": "…/result.mp4",
    "isPublish": false,
    "createdAt": "2026-06-16T15:55:38Z"
  }
}
```

**Field → content mapping:** `photo1Url` → Photo Frame (also Video poster); `photo2Url`–`photo5Url` → Raw Photo; `gifUrl` → GIF; `videoUrl` → Video; `createdAt` drives the 7-day Retention reminder.

**Caveats the client must honour:**
- Any media URL may be missing (e.g. GIF generation failed); each page renders an empty state when its field is absent rather than assuming presence.
- A failed/`success:false` response maps to a `not-found` state ("sesi tidak ditemukan atau sudah melewati masa retensi 7 hari"); a thrown fetch maps to `network`.
- Access is by possession of the Session Code alone — there is no auth on this endpoint.
