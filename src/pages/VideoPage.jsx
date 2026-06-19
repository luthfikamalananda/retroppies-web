import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useSessionStore } from '../store/sessionStore'
import { useDownload } from '../hooks/useDownload'
import { getFilename } from '../utils/helpers'
import { PageTransition, PageHeader, DownloadButton, StateCard } from '../components/ui'
import { COLORS } from '../constants'

export default function VideoPage() {
  const { sessionData } = useSessionStore()
  const { loading: dlLoading, success: dlSuccess, download } = useDownload()
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef(null)

  const videoUrl = sessionData?.videoUrl
  const posterUrl = sessionData?.photo1Url

  const handleDownload = () => {
    download(videoUrl, getFilename(videoUrl, 'retroppies-video.mp4'))
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
        <PageHeader title="VIDEO" />

        {!videoUrl || videoError ? (
          <StateCard
            icon="🎬"
            title="VIDEO TIDAK TERSEDIA"
            message="Video belum tersedia untuk sesi ini. Coba lagi beberapa saat."
            action={videoError ? { label: 'COBA LAGI', onClick: () => setVideoError(false) } : null}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                background: '#000',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl}
                controls
                playsInline
                preload="metadata"
                onError={() => setVideoError(true)}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  maxHeight: '70dvh',
                  // Style native controls to match theme where possible
                  colorScheme: 'dark',
                }}
                aria-label="Video hasil Retroppies"
              >
                Browser kamu tidak mendukung pemutaran video.
              </video>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold.DEFAULT} strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Tekan play untuk memutar video. Gunakan tombol fullscreen untuk tampilan penuh.
              </p>
            </motion.div>

            {/* Download */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DownloadButton
                onDownload={handleDownload}
                loading={dlLoading}
                success={dlSuccess}
                label="DOWNLOAD VIDEO"
              />
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
