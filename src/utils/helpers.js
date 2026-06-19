import { formatDistanceToNow, addDays, isPast } from 'date-fns'
import { id } from 'date-fns/locale'

/**
 * Format the expiry message for a session.
 * @param {string} createdAt - ISO date string
 * @returns {{ expired: boolean, label: string, daysLeft: number }}
 */
export function getExpiryInfo(createdAt) {
  if (!createdAt) return { expired: false, label: '7 hari', daysLeft: 7 }

  const created = new Date(createdAt)
  const expiry = addDays(created, 7)
  const expired = isPast(expiry)

  if (expired) return { expired: true, label: 'sudah expired', daysLeft: 0 }

  const label = formatDistanceToNow(expiry, { locale: id, addSuffix: false })
  const daysLeft = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24))

  return { expired: false, label, daysLeft }
}

/**
 * Get filename from URL path
 */
export function getFilename(url, fallback = 'retroppies') {
  if (!url) return fallback
  try {
    const parts = new URL(url).pathname.split('/')
    return parts[parts.length - 1] || fallback
  } catch {
    return fallback
  }
}

/**
 * Check if running inside Instagram/TikTok/FB in-app browser
 */
export function isInAppBrowser() {
  const ua = navigator.userAgent || ''
  return /Instagram|FBAN|FBAV|TikTok|Twitter/i.test(ua)
}
