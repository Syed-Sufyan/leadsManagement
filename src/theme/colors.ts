
export const COLORS = {
  gradient_1: '#011640',
  gradient_2: '#2F80ED',
  // primary: '#1E50C3',
  primary: '#1958A7',
  homeprimary: '#2f80ed',
  secondary: '#2862E9',
  background: '#F5F7FA',
  white: '#FFFFFF',
  black: '#1A1C1E',
  grey: '#757575',
  error: '#FF3B30',
  orange: '#f97b31',
  success: '#388E3C',
  green: '#4CAF50',
  border: '#E0E0E0',
  buttonColor: '#2f80ed',
} as const;

export type ColorType = typeof COLORS;
