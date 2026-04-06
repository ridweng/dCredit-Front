// @dcredit/ui — shared design tokens and style constants
// These are framework-agnostic values used by apps/web and apps/mobile.
// React/React Native components go in separate files to avoid cross-platform conflicts.

// ──────────────────────────────────────────
// Design Tokens — Color
// ──────────────────────────────────────────

export const colors = {
  // Primary teal
  primary: '#0f766e',
  primaryLight: '#14b8a6',
  primaryXLight: '#ccfbf1',
  primaryDark: '#0d9488',

  // Text
  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#94a3b8',

  // Backgrounds
  bgApp: '#f8fafc',
  bgCard: '#ffffff',
  bgSubtle: '#f1f5f9',

  // Borders
  border: '#e2e8f0',

  // Semantic
  safe: '#0f766e',
  caution: '#d97706',
  risky: '#dc2626',

  priorityHigh: '#dc2626',
  priorityMedium: '#d97706',
  priorityLow: '#0f766e',
} as const;

// ──────────────────────────────────────────
// Design Tokens — Spacing & Typography
// ──────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
