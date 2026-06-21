import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo, PageTransition } from '../components/ui'

export default function RootPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedCode = code.trim().toUpperCase()

    if (!trimmedCode) {
      setError('KODE TIDAK BOLEH KOSONG')
      return
    }

    setError('')
    navigate(`/${trimmedCode}`)
  }

  return (
    <PageTransition>
      <div className="page-container flex flex-col justify-center items-center min-h-[100dvh] py-10 z-10">
        <Logo />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card w-full p-8 mt-6 flex flex-col gap-6"
          style={{ maxWidth: '380px' }}
        >
          <div className="text-center">
            <h1 className="font-gaming text-gold-glow text-sm tracking-wider uppercase mb-2">
              RESULT VIEWER
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Masukkan kode sesi yang tertera pada layar photobooth atau struk Anda untuk melihat & menyimpan hasil foto.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="session-code-input" className="font-gaming text-[10px] text-[var(--color-text-muted)] tracking-wider">
                SESSION CODE
              </label>
              <input
                id="session-code-input"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  if (error) setError('')
                }}
                placeholder="RTP-YYYYMMDD-XXXX"
                className="w-full h-12 px-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[#0A0A0A] font-gaming text-sm text-[var(--color-text-primary)] tracking-widest text-center uppercase placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                style={{
                  boxShadow: code ? '0 0 10px rgba(233, 193, 64, 0.1)' : 'none',
                }}
                autoComplete="off"
                spellCheck="false"
                maxLength={25}
              />
              {error && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-gaming text-[9px] text-[#E53935] tracking-wide mt-1 text-center"
                >
                  ⚠️ {error}
                </motion.span>
              )}
            </div>

            <motion.button
              type="submit"
              className="btn-gold w-full mt-2"
              whileTap={{ scale: 0.98 }}
            >
              LIHAT HASIL
            </motion.button>
          </form>

          <div className="border-t border-[var(--color-border)] pt-4 text-center">
            <span className="text-[10px] text-[var(--color-text-muted)] tracking-wider">
              CONTOH KODE: <span className="text-[var(--color-text-secondary)] font-mono">MOCK-123</span>
            </span>
          </div>
        </motion.div>

        {/* Expiry Reminder at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center max-w-[280px]"
        >
          <p className="font-gaming text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] leading-relaxed">
            Masa penyimpanan file adalah 7 hari setelah sesi foto selesai ✨
          </p>
        </motion.div>
      </div>
    </PageTransition>
  )
}
