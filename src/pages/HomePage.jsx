import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { PageTransition, Skeleton, Logo } from '../components/ui'
import { useSessionStore } from '../store/sessionStore'
import { getExpiryInfo } from '../utils/helpers'

const NAV_BUTTONS = [
  {
    id: 'photo-frame',
    label: 'PHOTO FRAME',
    path: '/photo-frame'
  },
  {
    id: 'raw-photo',
    label: 'RAW PHOTO',
    path: '/raw-photo',
  },
  {
    id: 'gif',
    label: 'GIF',
    path: '/gif',
  },
  {
    id: 'video',
    label: 'VIDEO',
    path: '/video',
  },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function HomePage() {
  const navigate = useNavigate()
  const { sessionCode } = useParams()
  const { sessionData, loading } = useSessionStore()

  const expiry = getExpiryInfo(sessionData?.createdAt)

  const handleNav = (path) => {
    navigate(`/${sessionCode}${path}`)
  }

  return (
    <PageTransition>
      <div className="page-container px-12 flex flex-col justify-center items-center" style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '2.5rem',
        paddingBottom: '2rem',
        gap: 0,
        zIndex: 10,
        minHeight: '100dvh',
      }}>
        {/* ── Logo ── */}
        <Logo />

        {/* ── Session info ── */}
        {sessionData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              textAlign: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <span className="font-gaming text-sm" style={{
              color: 'var(--color-text-muted)',
              letterSpacing: '0.15em',
            }}>
              {sessionData.sessionCode}
            </span>
          </motion.div>
        )}

        {/* ── Nav Buttons ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          className='gap-6 px-6'
          animate={loading ? 'hidden' : 'show'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '1.5rem',
            width: "100%",
          }}
        >
          {loading
            ? NAV_BUTTONS.map((btn) => (
              <Skeleton key={btn.id} style={{ height: 'var(--btn-height)', borderRadius: 'var(--radius-pill)' }} />
            ))
            : NAV_BUTTONS.map((btn) => (
              <motion.button
                key={btn.id}
                variants={itemVariants}
                className=" font-gaming text-[#1C1B1F] font-bold text-md bg-[#E9C140] rounded-full w-full h-16"
                onClick={() => handleNav(btn.path)}
                whileTap={{ scale: 0.97 }}
                aria-label={`Lihat ${btn.label}`}
                id={`btn-${btn.id}`}
              >
                {btn.icon}
                {btn.label}
              </motion.button>
            ))
          }
        </motion.div>

        {/* ── Expiry Reminder ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='w-full mt-10 text-center'
        >
          <p className="font-gaming text-md uppercase" style={{
            color: '#FCF8EF',
            letterSpacing: '0.1em',
            lineHeight: 1.8,
          }}>
            {expiry.expired
              ? 'File Expired'
              : `Save your files before they expire in ${expiry.daysLeft} days ✨ 😊`
            }
          </p>
        </motion.div>
      </div>
    </PageTransition>
  )
}

