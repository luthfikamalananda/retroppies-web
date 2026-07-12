# Retroppies Result Viewer

A mobile-first landing page where a photobooth guest opens the results of one photo session — viewing and downloading the frame, raw photos, GIF, and video — by opening a link that carries their session code. No login: possessing the code is the only access control.

## Language

**Session**:
One run of the Retroppies photobooth by a guest, producing a fixed set of outputs (one photo frame, four raw photos, one GIF, one video). The unit everything in this app revolves around.
_Avoid_: Booking, order, shoot

**Session Code**:
The public identifier of a Session, formatted `RTP-YYYYMMDD-XXXX`. It is both the address and the access token — it appears in the URL path (`/RTP-...`) and is what the QR code encodes. `MOCK-*` codes return built-in fake data for UI testing.
_Avoid_: kode, id, token

**Session Data**:
The payload returned by the backend for a Session (the `result` object): the media URLs plus `invoiceNumber`, `isPublish`, and `createdAt`.
_Avoid_: result, response, payload

**Photo Frame**:
The single composite image where the guest's shots are laid onto a Retroppies template. Backed by `photo1Url`.
_Avoid_: composite, template photo, main photo

**Raw Photo**:
The four unedited individual shots from the session, backed by `photo2Url`–`photo5Url`. The only content type the PRD explicitly requires to be downloadable.
_Avoid_: original, unframed photo

**GIF**:
The animated loop generated from the session's shots, backed by `gifUrl`.

**Video**:
The session's video clip, backed by `videoUrl`.

**Retention**:
The 7-day window after `createdAt` during which Session Data (and its media) stays available. After it passes, the Session reads as expired.
_Avoid_: expiry window, TTL, masa aktif

**Result Viewer**:
This web app itself. It only views and downloads; it never edits media and holds no user accounts.
