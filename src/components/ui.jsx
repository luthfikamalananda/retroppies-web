import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { COLORS } from '../constants'

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in:      { opacity: 1, x: 0 },
  out:     { opacity: 0, x: -20 },
}

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25,
}

export function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </motion.div>
  )
}

// Back button with session code preserved
export function BackButton() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  return (
    <button
      className="btn-back"
      onClick={() => navigate(`/?session=${params.get('session') ?? ''}`)}
      aria-label="Kembali ke halaman utama"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      BACK
    </button>
  )
}

// Download button with loading / success states
export function DownloadButton({ onDownload, loading, success, label = 'SIMPAN KE DEVICE' }) {
  return (
    <button
      className="btn-download"
      onClick={onDownload}
      disabled={loading}
      aria-label={label}
    >
      {loading ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: 'spin-slow 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          LOADING...
        </>
      ) : success ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.status.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span style={{ color: COLORS.status.success }}>TERSIMPAN!</span>
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

// Skeleton placeholder
export function Skeleton({ style }) {
  return <div className="skeleton" style={{ width: '100%', ...style }} />
}

// Error / empty state card
export function StateCard({ icon, title, message, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '3rem 1.5rem',
      textAlign: 'center',
      flex: 1,
    }}>
      <div style={{ fontSize: '3rem', lineHeight: 1 }}>{icon}</div>
      <h2 className="font-gaming" style={{
        fontSize: '0.75rem',
        color: 'var(--color-gold)',
        letterSpacing: '0.1em',
      }}>
        {title}
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '280px' }}>
        {message}
      </p>
      {action && (
        <button className="btn-gold" style={{ maxWidth: '200px', marginTop: '0.5rem' }} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}

// Page header (back + title)
export function PageHeader({ title }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem',
      paddingTop: '0.25rem',
    }}>
      <BackButton />
      <span className="font-gaming" style={{
        fontSize: '0.65rem',
        color: 'var(--color-text-muted)',
        letterSpacing: '0.12em',
        flex: 1,
        textAlign: 'right',
      }}>
        {title}
      </span>
    </div>
  )
}
