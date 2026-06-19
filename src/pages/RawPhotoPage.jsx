import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSessionStore } from '../store/sessionStore'
import { useDownload } from '../hooks/useDownload'
import { getFilename } from '../utils/helpers'
import { PageTransition, PageHeader, DownloadButton, Skeleton, StateCard } from '../components/ui'
import { COLORS } from '../constants'

const GRID_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)
const LIST_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="5" width="18" height="2" rx="1" /><rect x="3" y="11" width="18" height="2" rx="1" />
    <rect x="3" y="17" width="18" height="2" rx="1" />
  </svg>
)

export default function RawPhotoPage() {
  const { sessionData } = useSessionStore()
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [modalIndex, setModalIndex] = useState(null)

  const photos = sessionData
    ? [sessionData.photo2Url, sessionData.photo3Url, sessionData.photo4Url, sessionData.photo5Url].filter(Boolean)
    : []

  if (!photos.length) {
    return (
      <PageTransition>
        <div className="page-container" style={{ paddingTop: '1.25rem', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
          <PageHeader title="RAW PHOTO" />
          <StateCard icon="📷" title="FOTO TIDAK TERSEDIA" message="Foto mentah belum tersedia untuk sesi ini." />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="page-container" style={{ paddingTop: '1.25rem', paddingBottom: '2rem', minHeight: '100dvh', zIndex: 10 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Back is inside PageHeader but we need toggle on right */}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <PageHeader title={`${photos.length} FOTO`} />
          {/* Toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            marginLeft: 'auto',
            flexShrink: 0,
          }}>
            {['grid', 'list'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                aria-label={`Tampilan ${mode}`}
                style={{
                  padding: '0.4rem 0.6rem',
                  color: viewMode === mode ? COLORS.gold.DEFAULT : COLORS.text.muted,
                  background: viewMode === mode ? 'var(--overlay-gold)' : 'transparent',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {mode === 'grid' ? GRID_ICON : LIST_ICON}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid View ── */}
        {viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}
          >
            {photos.map((url, i) => (
              <PhotoThumbnail
                key={url}
                url={url}
                index={i}
                onClick={() => setModalIndex(i)}
                aspectRatio="1 / 1"
              />
            ))}
          </motion.div>
        )}

        {/* ── List View ── */}
        {viewMode === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {photos.map((url, i) => (
              <ListItem key={url} url={url} index={i} onClick={() => setModalIndex(i)} />
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Modal Preview ── */}
      <AnimatePresence>
        {modalIndex !== null && (
          <PhotoModal
            photos={photos}
            initialIndex={modalIndex}
            onClose={() => setModalIndex(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

// ── Thumbnail (grid) ──────────────────────────────────────────────────────────
function PhotoThumbnail({ url, index, onClick, aspectRatio }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      aria-label={`Foto ${index + 1}`}
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        background: 'var(--color-card)',
        cursor: 'pointer',
        aspectRatio,
        position: 'relative',
      }}
    >
      {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
      <img
        src={url}
        alt={`Raw foto ${index + 1}`}
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: loaded ? 'block' : 'none' }}
      />
      <div style={{
        position: 'absolute',
        bottom: '0.4rem', right: '0.4rem',
        background: 'var(--overlay-heavy)',
        borderRadius: '50%',
        width: '22px', height: '22px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="font-gaming" style={{ fontSize: '0.4rem', color: COLORS.gold.DEFAULT }}>{index + 1}</span>
      </div>
    </motion.button>
  )
}

// ── List item ─────────────────────────────────────────────────────────────────
function ListItem({ url, index, onClick }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      aria-label={`Foto ${index + 1}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '0.625rem',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <div style={{ width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--color-elevated)' }}>
        {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
        <img src={url} alt={`foto ${index + 1}`} onLoad={() => setLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: loaded ? 'block' : 'none' }} />
      </div>
      <div>
        <p className="font-gaming" style={{ fontSize: '0.55rem', color: COLORS.gold.DEFAULT, letterSpacing: '0.1em' }}>
          FOTO {String(index + 1).padStart(2, '0')}
        </p>
        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
          raw-photo-{index + 1}.jpg
        </p>
      </div>
      <svg style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
    </motion.button>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function PhotoModal({ photos, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex)
  const { loading: dlLoading, success: dlSuccess, download } = useDownload()

  const handleDownload = () => {
    download(photos[current], getFilename(photos[current], `retroppies-raw-${current + 1}.jpg`))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'var(--overlay-heavy)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 'var(--max-width)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="font-gaming" style={{ fontSize: '0.55rem', color: COLORS.gold.DEFAULT }}>
            FOTO {current + 1} / {photos.length}
          </span>
          <button onClick={onClose} aria-label="Tutup" style={{ color: 'var(--color-text-muted)', padding: '0.25rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Image */}
        <img
          src={photos[current]}
          alt={`Foto ${current + 1}`}
          style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-card)', objectFit: 'contain', maxHeight: '65dvh' }}
        />

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            style={{
              flex: 1, height: '2.5rem', borderRadius: 'var(--radius-pill)',
              background: 'var(--color-card)', border: '1px solid var(--color-border)',
              color: current === 0 ? 'var(--color-text-muted)' : COLORS.gold.DEFAULT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Foto sebelumnya"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {photos.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Foto ${i + 1}`}
                style={{
                  width: i === current ? '20px' : '6px', height: '6px', borderRadius: '3px',
                  background: i === current ? COLORS.gold.DEFAULT : 'var(--color-elevated)', transition: 'all 0.2s'
                }} />
            ))}
          </div>

          <button
            onClick={() => setCurrent(c => Math.min(photos.length - 1, c + 1))}
            disabled={current === photos.length - 1}
            style={{
              flex: 1, height: '2.5rem', borderRadius: 'var(--radius-pill)',
              background: 'var(--color-card)', border: '1px solid var(--color-border)',
              color: current === photos.length - 1 ? 'var(--color-text-muted)' : COLORS.gold.DEFAULT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Foto berikutnya"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* Download */}
        <DownloadButton onDownload={handleDownload} loading={dlLoading} success={dlSuccess} />
      </motion.div>
    </motion.div>
  )
}
