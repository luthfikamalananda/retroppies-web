# PRD: Retroppies Result Viewer

**Versi:** 1.0
**Tanggal:** 19 Juni 2026
**Status:** Draft untuk Review

---

## 1. Latar Belakang

Aplikasi photobooth Retroppies (web-based, dijalankan di kiosk/Electron) menghasilkan beberapa output di setiap sesi: foto frame (hasil composite ke template), 4 foto mentah (raw), GIF, dan video. Saat ini, hasil-hasil ini hanya bisa dilihat di perangkat kiosk dan dikirim ke backend untuk disimpan.

Pengguna butuh cara mudah untuk **melihat dan menyimpan hasil sesi mereka dari HP sendiri**, dengan mengakses sebuah link/QR code yang berisi `sessionCode`. Website ini berfungsi sebagai "result viewer" — sebuah landing page bertema Retroppies yang menampilkan 4 jenis konten dari satu sesi.

## 2. Tujuan

- Pengguna dapat melihat hasil foto session mereka melalui link yang berisi `sessionCode`.
- Pengguna dapat mendownload foto raw ke device mereka.
- Tampilan mengikuti desain yang sudah ada (referensi UI terlampir): tema gelap, gold/amber, font pixel/retro-gaming, gaya landing page seperti Linktree.
- Dapat di-install sebagai PWA (icon di homescreen), tanpa kebutuhan offline-first.

## 3. Non-Tujuan (Out of Scope)

- Tidak ada fitur edit foto/video di website ini.
- Tidak ada autentikasi user/login — akses sepenuhnya berdasarkan kepemilikan `sessionCode` di URL.
- Tidak ada offline caching/service worker untuk asset (foto/video/gif) — PWA hanya untuk installability.
- Tidak ada fitur share ke sosial media pada versi ini (dapat menjadi pertimbangan fase berikutnya).

## 4. Target Pengguna & Konteks Akses

- **Pengguna akhir** dari mesin photobooth Retroppies, mayoritas mengakses dari **HP** melalui link/QR code yang diberikan setelah sesi selesai.
- Akses dari laptop/desktop tetap memungkinkan, namun layout **tetap menggunakan lebar mobile** (di-center di tengah viewport, tidak melebar mengikuti lebar layar — mirip pengalaman membuka Linktree di desktop).

## 5. Sumber Data

### 5.1 Endpoint

Data sesi diambil dari backend menggunakan `sessionCode` yang diletakkan sebagai query parameter:

```
https://hasil.retroppies.com/?session=RTP-20260616-4QADFC
```

### 5.2 Contoh Response

```json
{
  "statusCode": "101",
  "success": true,
  "responseDatetime": "2026-06-16T16:22:49.013096641+07:00",
  "result": {
    "sessionCode": "RTP-20260616-4QADFC",
    "invoiceNumber": "INV-1-20260616155404-7278",
    "photo1Url": "https://retroppies.com/uploads/sessions/RTP-20260616-4QADFC/photo1.jpg",
    "photo2Url": "https://retroppies.com/uploads/sessions/RTP-20260616-4QADFC/photo2.jpg",
    "photo3Url": "https://retroppies.com/uploads/sessions/RTP-20260616-4QADFC/photo3.jpg",
    "photo4Url": "https://retroppies.com/uploads/sessions/RTP-20260616-4QADFC/photo4.jpg",
    "photo5Url": "https://retroppies.com/uploads/sessions/RTP-20260616-4QADFC/photo5.jpg",
    "gifUrl": "https://retroppies.com/uploads/sessions/RTP-20260616-4QADFC/result.gif",
    "videoUrl": "https://retroppies.com/uploads/sessions/RTP-20260616-4QADFC/result.mp4",
    "isPublish": false,
    "createdAt": "2026-06-16T15:55:38.018427Z"
  },
  "message": ""
}
```

### 5.3 Pemetaan Data ke Konten

| Field response             | Digunakan di halaman                               | Keterangan                       |
| -------------------------- | -------------------------------------------------- | -------------------------------- |
| `photo1Url`                | Photo Frame                                        | Foto hasil composite ke template |
| `photo2Url` – `photo5Url`  | Raw Photo                                          | 4 foto mentah dari capture       |
| `gifUrl`                   | GIF                                                | GIF hasil cycle 4 foto           |
| `videoUrl`                 | Video                                              | Video hasil composite            |
| `sessionCode`, `createdAt` | Landing page (opsional, untuk konteks/expiry info) |                                  |

> **Catatan untuk tim Backend:** PRD ini berasumsi seluruh field `photo1Url`–`photo5Url`, `gifUrl`, `videoUrl` selalu tersedia begitu sesi selesai dibuat. Jika ada kemungkinan field bernilai `null`/kosong (misalnya proses generate GIF gagal), frontend perlu tahu kontraknya agar dapat menampilkan empty state yang sesuai (lihat §8.6).

## 6. Informasi dari Referensi UI

Berdasarkan attachment desain landing page:

- Logo "The Retroppies" di bagian atas (script font untuk "The", display font besar untuk "RETROPPIES").
- 4 tombol pill-shaped berwarna gold (`#E9C140`-ish) dengan teks gelap, font pixel/monospace (terlihat seperti "Press Start 2P" atau sejenis — disebut `font-gaming` di codebase existing):
  - PHOTO FRAME
  - RAW PHOTO
  - GIF
  - VIDEO
- Font Gaming sudah disediakan pada root folder (RetroGaming.ttf).
- Background gelap/hitam dengan tekstur noise/grain halus.
- Teks footer: "SAVE YOUR FILES BEFORE THEY EXPIRE IN 7 DAYS ✨😊" — mengindikasikan **file di server memiliki masa retensi 7 hari**, perlu ditampilkan sebagai reminder.
- Tidak ada navigasi/back button di landing page itu sendiri (karena ini halaman root).

## 7. Arsitektur Informasi & Navigasi

```
/?session=<sessionCode>                     → Landing Page (Home)
/photo-frame?session=<sessionCode>          → Photo Frame Page
/raw-photo?session=<sessionCode>            → Raw Photo Page (grid/list + preview modal)
/gif?session=<sessionCode>                  → GIF Page
/video?session=<sessionCode>                → Video Page
```

- `sessionCode` dibawa terus di setiap navigasi (melalui query param atau disimpan di state/context setelah fetch pertama, lalu diteruskan ke route berikutnya).
- Setiap halaman selain Home memiliki **tombol back** yang mengarah ke Home (bukan browser back, agar konsisten meskipun user masuk dari refresh).
- Transisi antar halaman: slide/fade sederhana (lihat §10 untuk rekomendasi animasi).

### 7.1 Diagram Alur

```
                    ┌─────────────────┐
                    │   Landing Page   │
                    │   (Home/Index)   │
                    │                  │
                    │  [PHOTO FRAME]   │──────┐
                    │  [RAW PHOTO]     │──┐   │
                    │  [GIF]           │┐ │   │
                    │  [VIDEO]         ││ │   │
                    └──────────────────┘│ │   │
                              ▲          │ │   │
                    ┌─────────┘          │ │   │
                    │         ┌──────────┘ │   │
                    │         │            │   │
              ┌─────┴───┐┌────┴────┐┌──────┴──┐┌┴────────────┐
              │  Video  ││   GIF   ││Raw Photo││ Photo Frame │
              │  Page   ││  Page   ││  Page   ││    Page     │
              └─────────┘└─────────┘└─────────┘└─────────────┘
              (back→Home)(back→Home)(back→Home) (back→Home)
```

## 8. Spesifikasi Halaman

### 8.1 Landing Page (Home)

**Tujuan:** entry point, menampilkan branding dan 4 pilihan navigasi.

**Elemen:**

- Logo Retroppies (sesuai referensi).
- 4 tombol navigasi pill-shaped: Photo Frame, Raw Photo, GIF, Video.
- Teks reminder masa retensi file (7 hari) — idealnya dihitung dari `createdAt` + 7 hari agar akurat per sesi, bukan teks statis.
- **Loading state**: skeleton/spinner saat fetch data sesi pertama kali.
- **Error state**: jika `sessionCode` tidak valid/tidak ditemukan/expired → tampilkan pesan error yang jelas, bukan halaman kosong (lihat §8.6).

**Perilaku:**

- Saat halaman dimuat, lakukan fetch data sesi sekali menggunakan `sessionCode` dari query param.
- Hasil fetch disimpan di state/context global agar tidak perlu fetch ulang saat pindah ke 4 halaman lain.
- Jika `sessionCode` tidak ada di URL sama sekali → tampilkan halaman "Session tidak ditemukan" (lihat §8.6).

---

### 8.2 Photo Frame Page

**Tujuan:** menampilkan hasil foto composite (template + foto user).

**Elemen:**

- Tombol back (kiri atas, mengarah ke Home).
- Container preview foto besar, center, mengikuti aspect ratio asli foto (tidak di-crop).
- Tombol download/save to device.

**Perilaku:**

- Gambar dari `photo1Url` ditampilkan langsung, tanpa grid/list (sesuai keputusan user).
- Loading state saat gambar belum selesai load (skeleton/blur placeholder).
- Jika `photo1Url` kosong/gagal load → tampilkan empty/error state khusus halaman ini, bukan mengarahkan keluar.

---

### 8.3 Raw Photo Page

**Tujuan:** menampilkan 4 foto mentah dalam tampilan grid/list (mirip Google Drive), dengan kemampuan preview per-foto dan download.

**Elemen:**

- Tombol back.
- Toggle/switcher tampilan **Grid** ↔ **List** (ikon di kanan atas, seperti Google Drive).
- **Grid view**: thumbnail 2 kolom (mengikuti lebar mobile), aspect-square atau sesuai rasio asli foto.
- **List view**: thumbnail kecil + nama file di kanan, satu baris per foto.
- Tap salah satu foto → membuka **modal preview** full-screen.

**Modal Preview:**

- Menampilkan foto dalam ukuran penuh.
- Swipe/navigasi kiri-kanan antar foto (opsional, nice-to-have — tandai sebagai **P1** bukan P0 jika scope ingin diperkecil).
- Tombol close (kembali ke grid/list, bukan ke Home).
- Tombol **download/save to device** di dalam modal.

**Perilaku Download:**

- Klik tombol download → trigger browser native download (`<a download>` atau fetch+blob untuk memastikan compatibility di iOS Safari, yang terkenal bermasalah dengan atribut `download` lintas origin).
- Beri feedback visual saat proses download (loading state pada tombol, lalu success toast/checkmark).

---

### 8.4 GIF Page

**Tujuan:** menampilkan GIF hasil cycle 4 foto.

**Elemen:**

- Tombol back.
- Container preview GIF, autoplay (sifat alami format GIF), center.
- Tombol download/save to device.

**Perilaku:**

- GIF dari `gifUrl` ditampilkan langsung sebagai `<img>` (GIF autoplay native, tidak butuh video player).
- Loading state saat GIF belum selesai dimuat (ukuran file GIF bisa cukup besar).

---

### 8.5 Video Page

**Tujuan:** menampilkan video hasil composite.

**Elemen:**

- Tombol back.
- Video player dengan native controls (play/pause, scrub, volume, fullscreen).
- Tombol download/save to device.

**Perilaku:**

- Video dari `videoUrl` ditampilkan via elemen `<video controls>`.
- **Tidak autoplay** (best practice mobile browser — autoplay video dengan audio sering diblokir browser, dan UX lebih baik membiarkan user menekan play).
- Poster/thumbnail saat video belum diplay (gunakan `photo1Url` sebagai poster jika video tidak punya thumbnail sendiri, atau frame pertama).

---

### 8.6 Error & Edge Case States

| Kondisi                                                                                             | Perilaku                                                                                                                                    |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `sessionCode` tidak ada di URL                                                                      | Tampilkan halaman "Link tidak valid" dengan pesan singkat, tanpa 4 tombol navigasi (karena tidak ada data untuk dinavigasi)                 |
| `sessionCode` ada tapi backend return error/not found                                               | Tampilkan halaman "Sesi tidak ditemukan" — kemungkinan salah ketik link atau sesi sudah dihapus (lewat masa retensi 7 hari)                 |
| Salah satu field URL (`photo1Url`, dst) kosong/null                                                 | Halaman terkait menampilkan empty state spesifik ("Foto Frame belum tersedia"), bukan crash atau gambar broken                              |
| Asset gagal di-load (404 dari CDN, network error)                                                   | Fallback UI dengan tombol "Coba lagi" (retry fetch gambar/video)                                                                            |
| Device tidak mendukung download langsung (sebagian browser in-app seperti WebView Instagram/TikTok) | Pertimbangkan fallback: buka di tab baru dengan instruksi "tekan lama gambar untuk simpan" — **perlu didiskusikan lebih lanjut, lihat §12** |

## 9. Functional Requirements

| ID    | Requirement                                                                      | Priority |
| ----- | -------------------------------------------------------------------------------- | -------- |
| FR-1  | Sistem dapat membaca `sessionCode` dari query parameter URL                      | P0       |
| FR-2  | Sistem melakukan fetch data sesi dari backend menggunakan `sessionCode`          | P0       |
| FR-3  | Landing page menampilkan 4 tombol navigasi sesuai desain referensi               | P0       |
| FR-4  | Setiap halaman (Photo Frame/Raw Photo/GIF/Video) dapat diakses dari Landing Page | P0       |
| FR-5  | Setiap halaman non-Home memiliki tombol back ke Home                             | P0       |
| FR-6  | Photo Frame Page menampilkan `photo1Url` sebagai gambar tunggal                  | P0       |
| FR-7  | Raw Photo Page menampilkan `photo2Url`–`photo5Url` dalam grid/list               | P0       |
| FR-8  | Raw Photo Page memiliki toggle Grid/List                                         | P1       |
| FR-9  | Raw Photo Page dapat membuka preview modal per foto                              | P0       |
| FR-10 | Setiap foto/gif/video memiliki tombol download/save to device                    | P0       |
| FR-11 | GIF Page menampilkan `gifUrl` dengan autoplay native                             | P0       |
| FR-12 | Video Page menampilkan `videoUrl` dengan native controls                         | P0       |
| FR-13 | Aplikasi dapat di-install sebagai PWA (manifest + icon)                          | P0       |
| FR-14 | Layout tetap dalam lebar mobile meskipun diakses dari viewport besar             | P0       |
| FR-15 | Sistem menampilkan reminder masa retensi file (7 hari dari `createdAt`)          | P1       |
| FR-16 | Sistem menampilkan error state yang sesuai untuk setiap kondisi di §8.6          | P0       |

## 10. Rekomendasi Teknis

### 10.1 Tech Stack

- **Framework:** React + Vite
- **PWA:** `vite-plugin-pwa` (cukup untuk installability dasar; `registerType: 'prompt'` atau `'autoUpdate'`, tanpa precaching asset foto/video karena tidak butuh offline support)
- **Routing:** React Router (route-based seperti di §7), dengan `sessionCode` diteruskan via query param tetap ada di setiap URL (memudahkan refresh/share link langsung ke sub-halaman tanpa kembali ke Home dulu)
- **State management:** Context API atau Zustand sederhana untuk menyimpan hasil fetch sesi (hindari fetch berulang tiap pindah halaman)
- **Styling:** Tailwind CSS (konsisten dengan codebase Retroppies existing), dengan custom font pixel (`font-gaming`) sesuai desain referensi
- **Animasi transisi halaman:** Framer Motion (konsisten dengan stack existing aplikasi photobooth)

### 10.2 Pertimbangan Download Cross-Browser

- Foto/GIF: gunakan pendekatan fetch → blob → `URL.createObjectURL` → trigger `<a download>`, bukan langsung `href` ke URL eksternal (karena atribut `download` tidak selalu dihormati untuk cross-origin resource).
- Video: ukuran file lebih besar, pertimbangkan progress indicator saat fetch blob berlangsung sebelum trigger download.
- iOS Safari memiliki keterbatasan dikenal soal download programatik — perlu testing manual di perangkat iOS sebagai bagian dari QA.

### 10.3 Lebar Layout Konsisten di Desktop

- Gunakan container dengan `max-width` (misal `max-w-md`, ~448px) yang di-center secara horizontal (`mx-auto`), dengan background di luar container tetap mengisi seluruh viewport (bisa pakai tekstur/warna senada sesuai tema gelap referensi) agar tidak terlihat kosong di desktop.

## 11. Metrik Keberhasilan (Opsional, untuk Didiskusikan)

- Jumlah sesi yang berhasil diakses vs jumlah QR code/link yang di-generate (conversion rate kunjungan).
- Jumlah download per jenis konten (Photo Frame vs Raw vs GIF vs Video) — berguna untuk mengetahui konten mana yang paling diminati user.
- Rasio instalasi PWA terhadap total visitor.

## 12. Pertanyaan Terbuka untuk Didiskusikan

1. **In-app browser handling** — Banyak user akan membuka link ini dari WhatsApp/Instagram in-app browser. Apakah perlu deteksi khusus dan tampilkan banner "buka di browser" untuk pengalaman download yang lebih baik?
2. **`isPublish` field** — Response backend memiliki field `isPublish`. Apakah field ini berdampak pada apa yang ditampilkan di website ini (misal: jika `false`, apakah ada batasan akses atau ini hanya relevan untuk fitur lain seperti galeri publik Instagram)?
3. **Retensi 7 hari** — Apakah backend benar-benar menghapus file setelah 7 hari, atau ini hanya soft warning ke user? Ini menentukan apakah halaman perlu menangani kasus "file sudah dihapus" sebagai kondisi normal yang sering terjadi, bukan edge case jarang.
4. **Analytics** — Apakah perlu integrasi tracking (Google Analytics/Mixpanel) untuk memahami perilaku user di website ini?
5. **Branding tambahan** — Apakah perlu tombol/link ke social media Retroppies atau promosi lain di Landing Page, mengingat ini adalah touchpoint langsung dengan pelanggan?

---

_Dokumen ini adalah draft awal. Mohon review dan beri feedback terutama pada bagian §12 sebelum masuk ke fase desain teknis/development._
