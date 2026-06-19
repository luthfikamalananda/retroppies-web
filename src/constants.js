// =============================================================================
// RETROPPIES COLOR CONSTANTS
// =============================================================================

export const COLORS = {
  // --- Primary Gold / Amber ---
  gold: {
    DEFAULT: '#E9C140',
    light: '#F5D76E',
    dark: '#C9A022',
    muted: '#B8951F',
    pale: '#F9EBB2',
    glow: 'rgba(233, 193, 64, 0.35)',
  },

  // --- Background / Dark ---
  dark: {
    DEFAULT: '#0A0A0A',
    surface: '#111111',
    card: '#1A1A1A',
    elevated: '#222222',
    border: '#2A2A2A',
    divider: '#1F1F1F',
  },

  // --- Text ---
  text: {
    primary: '#F5F0E8',
    secondary: '#C8BFA8',
    muted: '#8A7F6E',
    inverse: '#0A0A0A',
    gold: '#E9C140',
  },

  // --- Status ---
  status: {
    success: '#4CAF50',
    error: '#E53935',
    warning: '#FFA726',
    info: '#29B6F6',
  },

  // --- Overlay ---
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(0, 0, 0, 0.5)',
    heavy: 'rgba(0, 0, 0, 0.85)',
    gold: 'rgba(233, 193, 64, 0.1)',
    goldHover: 'rgba(233, 193, 64, 0.2)',
  },
}

// =============================================================================
// GRADIENT CONSTANTS
// =============================================================================

export const GRADIENTS = {
  goldButton: `linear-gradient(135deg, ${COLORS.gold.light} 0%, ${COLORS.gold.DEFAULT} 50%, ${COLORS.gold.dark} 100%)`,
  goldShimmer: `linear-gradient(90deg, transparent 0%, ${COLORS.gold.glow} 50%, transparent 100%)`,
  darkSurface: `linear-gradient(180deg, ${COLORS.dark.surface} 0%, ${COLORS.dark.DEFAULT} 100%)`,
  pageBackground: `radial-gradient(ellipse at top, #1a150a 0%, ${COLORS.dark.DEFAULT} 60%)`,
}

// =============================================================================
// FONT CONSTANTS
// =============================================================================

export const FONTS = {
  gaming: '"RetroGaming", "Courier New", monospace',
  body: '"Inter", system-ui, -apple-system, sans-serif',
}

// =============================================================================
// SPACING / LAYOUT CONSTANTS
// =============================================================================

export const LAYOUT = {
  maxWidth: '448px',      // ~max-w-md, Linktree-style mobile container
  pagePadding: '1.25rem', // 20px horizontal padding
  buttonHeight: '3.5rem', // pill button height
  borderRadius: {
    pill: '9999px',
    card: '1rem',
    sm: '0.5rem',
  },
}
