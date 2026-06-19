import { useState, useCallback } from 'react'

/**
 * Downloads a file by fetching it as a blob and triggering
 * native browser download — works cross-origin on iOS Safari.
 */
export function useDownload() {
  const [state, setState] = useState({ loading: false, success: false, error: null })

  const download = useCallback(async (url, filename) => {
    setState({ loading: true, success: false, error: null })
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Fetch failed')
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = objectUrl
      a.download = filename || 'retroppies-file'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objectUrl)

      setState({ loading: false, success: true, error: null })
      // Reset success after 3s
      setTimeout(() => setState(s => ({ ...s, success: false })), 3000)
    } catch (err) {
      setState({ loading: false, success: false, error: err.message })
    }
  }, [])

  return { ...state, download }
}
