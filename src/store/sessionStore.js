import { create } from 'zustand'

const API_BASE = 'https://api.retroppies.com'

// ── Mock data for local testing (use ?session=MOCK-123) ───────────────────────
const MOCK_DATA = {
  sessionCode: 'MOCK-123',
  invoiceNumber: 'INV-1-20260616155404-7278',
  photo1Url: 'https://picsum.photos/seed/frame/800/1067',
  photo2Url: 'https://picsum.photos/seed/raw1/800/1067',
  photo3Url: 'https://picsum.photos/seed/raw2/800/1067',
  photo4Url: 'https://picsum.photos/seed/raw3/800/1067',
  photo5Url: 'https://picsum.photos/seed/raw4/800/1067',
  gifUrl:    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJ4NHpxMTFpenV0OHd5bXBsaWR3bW50bm16cW9id2p2N3d2eGpiZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjI6SIIHBdRxXI40/giphy.gif',
  videoUrl:  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  isPublish: false,
  createdAt: new Date().toISOString(),
}

export const useSessionStore = create((set, get) => ({
  // State
  sessionCode: null,
  sessionData: null,
  loading: false,
  error: null,

  // Actions
  setSessionCode: (code) => set({ sessionCode: code }),

  fetchSession: async (code) => {
    if (!code) {
      set({ error: 'no-code', loading: false })
      return
    }

    // Return cached data if same session
    if (get().sessionData?.sessionCode === code) return

    set({ loading: true, error: null, sessionCode: code })

    // Mock mode — use ?session=MOCK-* to test UI without backend
    if (code.startsWith('MOCK')) {
      await new Promise(r => setTimeout(r, 800)) // simulate network delay
      set({ sessionData: { ...MOCK_DATA, sessionCode: code }, loading: false })
      return
    }

    try {
      const res = await fetch(`${API_BASE}/photobooth/sessions/${code}`)
      const json = await res.json()

      if (!res.ok || !json.success) {
        set({ error: 'not-found', loading: false })
        return
      }

      set({ sessionData: json.result, loading: false })
    } catch {
      set({ error: 'network', loading: false })
    }
  },

  reset: () => set({ sessionCode: null, sessionData: null, loading: false, error: null }),
}))
