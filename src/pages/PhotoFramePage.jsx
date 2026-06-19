import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSessionStore } from '../store/sessionStore'
import { useDownload } from '../hooks/useDownload'
import { getFilename } from '../utils/helpers'
import { PageTransition, PageHeader, DownloadButton, Skeleton, StateCard } from '../components/ui'

export default function PhotoFramePage() {
  const [params] = useSearchParams()
  const { sessionData } = useSessionStore()
  const { loading: dlLoading, success: dlSuccess, download } = useDownload()
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const photoUrl = sessionData?.photo1Url

  const handleDownload = () => {
    download(photoUrl, getFilename(photoUrl, 'retroppies-photoframe.jpg'))
  }

  return (
    <PageTransition>
      <div className="page-container" style={{
        paddingTop: '1.25rem',
        paddingBottom: '2rem',
        display: 'flex',
        zIndex: 10,
        flexDirection: 'column',
        minHeight: '100dvh',
      }}>
        <PageHeader title="PHOTO FRAME" />

        {/* ── Image area ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!photoUrl || imgError ? (
            <StateCard
              icon="🖼️"
              title="FOTO TIDAK TERSEDIA"
              message="Foto frame belum tersedia untuk sesi ini. Silakan coba lagi beberapa saat."
              action={imgError ? { label: 'COBA LAGI', onClick: () => setImgError(false) } : null}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
                background: 'var(--color-card)',
                position: 'relative',
              }}
            >
              {/* Skeleton while loading */}
              {!imgLoaded && (
                <div className="skeleton" style={{ width: '100%', aspectRatio: '4/3' }} />
              )}
              <img
                src={photoUrl}
                alt="Foto Frame Retroppies"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: imgLoaded ? 'block' : 'none',
                }}
              />

              {/* Gold corner accents */}
              {imgLoaded && (
                <>
                  {[
                    { top: 0, left: 0, borderTop: '3px solid', borderLeft: '3px solid' },
                    { top: 0, right: 0, borderTop: '3px solid', borderRight: '3px solid' },
                    { bottom: 0, left: 0, borderBottom: '3px solid', borderLeft: '3px solid' },
                    { bottom: 0, right: 0, borderBottom: '3px solid', borderRight: '3px solid' },
                  ].map((style, i) => (
                    <div key={i} style={{
                      position: 'absolute',
                      width: '20px', height: '20px',
                      borderColor: 'var(--color-gold)',
                      opacity: 0.6,
                      ...style,
                    }} />
                  ))}
                </>
              )}
            </motion.div>
          )}

          {/* ── Download button ── */}
          {photoUrl && !imgError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DownloadButton
                onDownload={handleDownload}
                loading={dlLoading}
                success={dlSuccess}
              />
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
