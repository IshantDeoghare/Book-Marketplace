'use client';

import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';
import { useTheme } from 'next-themes';

// 2025 Modern Color Palette - Nature-inspired with tech accents
const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode - Modern 2025 palette
          primary: { 
            main: '#0f172a', // Slate 900 - Deep, trustworthy
            light: '#1e293b', // Slate 800
            dark: '#020617', // Slate 950
            contrastText: '#ffffff'
          },
          secondary: { 
            main: '#06b6d4', // Cyan 500 - Modern teal
            light: '#67e8f9', // Cyan 300
            dark: '#0891b2', // Cyan 600
            contrastText: '#ffffff'
          },
          accent: {
            main: '#f59e0b', // Amber 500 - Warm accent
            light: '#fbbf24', // Amber 400
            dark: '#d97706', // Amber 600
          },
          success: {
            main: '#10b981', // Emerald 500
            light: '#34d399', // Emerald 400
            dark: '#059669', // Emerald 600
          },
          warning: {
            main: '#f59e0b', // Amber 500
            light: '#fbbf24', // Amber 400
            dark: '#d97706', // Amber 600
          },
          error: {
            main: '#ef4444', // Red 500
            light: '#f87171', // Red 400
            dark: '#dc2626', // Red 600
          },
          background: {
            default: '#fefefe', // Near white
            paper: '#ffffff', // Pure white
            surface: '#f8fafc', // Slate 50
          },
          text: { 
            primary: '#1e293b', // Slate 800
            secondary: '#64748b', // Slate 500
            disabled: '#94a3b8', // Slate 400
          },
          divider: '#e2e8f0', // Slate 200
          // Custom gradient colors
          gradient: {
            primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            card: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          }
        }
      : {
          // Dark mode - Enhanced for 2025
          primary: { 
            main: '#3b82f6', // Blue 500
            light: '#60a5fa', // Blue 400
            dark: '#1d4ed8', // Blue 700
            contrastText: '#ffffff'
          },
          secondary: { 
            main: '#06b6d4', // Cyan 500
            light: '#67e8f9', // Cyan 300
            dark: '#0891b2', // Cyan 600
            contrastText: '#ffffff'
          },
          background: {
            default: '#0f172a', // Slate 900
            paper: '#1e293b', // Slate 800
            surface: '#334155', // Slate 700
          },
          text: { 
            primary: '#f1f5f9', // Slate 100
            secondary: '#cbd5e1', // Slate 300
            disabled: '#64748b', // Slate 500
          },
          divider: '#334155', // Slate 700
        }),
  },
  typography: {
    fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
    h1: { 
      fontFamily: 'var(--font-playfair-display), serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: { 
      fontFamily: 'var(--font-playfair-display), serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: { 
      fontFamily: 'var(--font-playfair-display), serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h4: { 
      fontFamily: 'var(--font-playfair-display), serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: { 
      fontFamily: 'var(--font-playfair-display), serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: { 
      fontFamily: 'var(--font-playfair-display), serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01071em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12, // More modern rounded corners
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)', // Subtle shadows
    '0px 4px 8px rgba(0, 0, 0, 0.1)',
    '0px 8px 16px rgba(0, 0, 0, 0.1)',
    '0px 12px 24px rgba(0, 0, 0, 0.15)',
    '0px 16px 32px rgba(0, 0, 0, 0.15)',
    ...Array(19).fill('0px 20px 40px rgba(0, 0, 0, 0.2)'), // Consistent for rest
  ],
  components: {
    // Modern button styles
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          fontSize: '1rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    // Modern card styles
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    // Modern paper styles
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    // Modern text field styles
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#06b6d4',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#06b6d4',
              borderWidth: 2,
            },
          },
        },
      },
    },
    // Modern chip styles
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    // Modern app bar
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0px 2px 16px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const theme = createTheme(getDesignTokens(resolvedTheme === 'dark' ? 'light' : 'light'));

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
