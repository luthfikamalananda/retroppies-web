import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import HomePage from './pages/HomePage'
import PhotoFramePage from './pages/PhotoFramePage'
import RawPhotoPage from './pages/RawPhotoPage'
import GifPage from './pages/GifPage'
import VideoPage from './pages/VideoPage'
import { bgBlack } from './assets'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.img
        key="image"
        src={bgBlack}
        alt=""
        className="absolute inset-0 w-screen h-screen object-cover select-none"
        draggable={false}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/photo-frame" element={<PhotoFramePage />} />
        <Route path="/raw-photo" element={<RawPhotoPage />} />
        <Route path="/gif" element={<GifPage />} />
        <Route path="/video" element={<VideoPage />} />
      </Routes>
    </AnimatePresence >
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
