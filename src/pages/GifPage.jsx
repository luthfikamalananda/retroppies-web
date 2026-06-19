import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSessionStore } from '../store/sessionStore'
import { useDownload } from '../hooks/useDownload'
import { getFilename } from '../utils/helpers'
import { PageTransition, PageHeader, DownloadButton, StateCard } from '../components/ui'
import { COLORS } from '../constants'

export default function GifPage() {
  const { sessionData } = useSessionStore()
  const { loading: dlLoading, success: dlSuccess, download } = useDownload()
  const [gifLoaded, setGifLoaded] = useState(false)
  const [gifError, setGifError] = useState(false)

  const gifUrl = sessionData?.gifUrl

  const handleDownload = () => {
    download(gifUrl, getFilename(gifUrl, 'retroppies-result.gif'))
  }

  return (
    <PageTransition>
      <div className="page-container" style={{
        paddingTop: '1.25rem',
        paddingBottom: '2rem',
        display: 'flex',
        z: 10,
        flexDirection: 'column',
        minHeight: '100dvh',
      }}>
        <PageHeader title="GIF" />

        {!gifUrl || gifError ? (
          <StateCard
            icon="🎞️"
            title="GIF TIDAK TERSEDIA"
            message="GIF belum tersedia untuk sesi ini. Coba lagi beberapa saat."
            action={gifError ? { label: 'COBA LAGI', onClick: () => setGifError(false) } : null}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
            {/* GIF Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                background: 'var(--color-card)',
                boxShadow: 'var(--shadow-card)',
                position: 'relative',
              }}
            >
              {/* Loading state while GIF loads */}
              {!gifLoaded && (
                <div style={{
                  width: '100%', aspectRatio: '1 / 1',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: '0.75rem',
                  background: 'var(--color-card)',
                }}>
                  <div style={{
                    width: '48px', height: '48px',
                    border: `3px solid var(--color-border)`,
                    borderTopColor: COLORS.gold.DEFAULT,
                    borderRadius: '50%',
                    animation: 'spin-slow 0.8s linear infinite',
                  }} />
                  <p className="font-gaming" style={{
                    fontSize: '0.5rem',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.1em',
                  }}>
                    MEMUAT GIF...
                  </p>
                </div>
              )}

              <img
                src={gifUrl}
                alt="GIF Retroppies"
                onLoad={() => setGifLoaded(true)}
                onError={() => setGifError(true)}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: gifLoaded ? 'block' : 'none',
                }}
              />

              {/* GIF badge */}
              {gifLoaded && (
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'var(--overlay-heavy)',
                  border: `1px solid ${COLORS.gold.DEFAULT}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.15rem 0.4rem',
                }}>
                  <span className="font-gaming" style={{
                    fontSize: '0.45rem',
                    color: COLORS.gold.DEFAULT,
                    letterSpacing: '0.1em',
                  }}>
                    GIF
                  </span>
                </div>
              )}
            </motion.div>

            {/* Info */}
            {gifLoaded && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  textAlign: 'center',
                }}
              >
                GIF ini berisi animasi dari 4 foto sesi kamu
              </motion.p>
            )}

            {/* Download */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <DownloadButton
                onDownload={handleDownload}
                loading={dlLoading}
                success={dlSuccess}
              />
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
