import { useEffect } from 'react'
import { Outlet, useParams, Link } from 'react-router-dom'
import { useSessionStore } from '../store/sessionStore'
import { PageTransition, StateCard, Logo } from './ui'

export default function SessionLayout() {
  const { sessionCode } = useParams()
  const { fetchSession, sessionData, loading, error } = useSessionStore()

  useEffect(() => {
    if (sessionCode) {
      fetchSession(sessionCode)
    }
  }, [sessionCode, fetchSession])

  // Handle errors (consume api sessioncode failed)
  if (error === 'not-found' || error === 'network') {
    return (
      <PageTransition>
        <div className="page-container flex flex-col justify-center items-center min-h-[100dvh] py-10 z-10">
          <Logo />
          <StateCard
            icon={error === 'network' ? '📡' : '🗂️'}
            title={error === 'network' ? 'GAGAL TERHUBUNG' : 'SESI TIDAK DITEMUKAN'}
            message={
              error === 'network'
                ? 'Tidak dapat terhubung ke server. Periksa koneksi internet kamu dan coba lagi.'
                : 'Sesi ini tidak ditemukan atau sudah melewati masa retensi 7 hari.'
            }
            action={{ label: 'COBA LAGI', onClick: () => fetchSession(sessionCode) }}
          />
          <Link
            to="/"
            className="font-gaming text-xs text-center mt-6 text-[#E9C140] hover:text-[#F5D76E] transition-colors"
          >
            KEMBALI KE BERANDA
          </Link>
        </div>
      </PageTransition>
    )
  }

  // Handle case where we don't have session data and we are loading
  if (loading && (!sessionData || sessionData.sessionCode !== sessionCode)) {
    return (
      <PageTransition>
        <div className="page-container flex flex-col justify-center items-center min-h-[100dvh] py-10 z-10">
          <Logo />
          <div className="flex flex-col items-center gap-4 mt-12">
            <div style={{
              width: '48px',
              height: '48px',
              border: `3px solid var(--color-border)`,
              borderTopColor: '#E9C140',
              borderRadius: '50%',
              animation: 'spin-slow 0.8s linear infinite',
            }} />
            <p className="font-gaming" style={{
              fontSize: '0.6rem',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.15em',
            }}>
              MEMUAT SESI...
            </p>
          </div>
        </div>
      </PageTransition>
    )
  }

  // Render subpages if data is ready
  return <Outlet />
}
