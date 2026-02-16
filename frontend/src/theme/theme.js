import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light mode
                primary: {
                    main: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#ec4899',
                    light: '#f472b6',
                    dark: '#db2777',
                    contrastText: '#ffffff',
                },
                success: {
                    main: '#10b981',
                    light: '#34d399',
                    dark: '#059669',
                },
                warning: {
                    main: '#f59e0b',
                    light: '#fbbf24',
                    dark: '#d97706',
                },
                error: {
                    main: '#ef4444',
                    light: '#f87171',
                    dark: '#dc2626',
                },
                info: {
                    main: '#3b82f6',
                    light: '#60a5fa',
                    dark: '#2563eb',
                },
                background: {
                    default: '#f8fafc',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#1e293b',
                    secondary: '#64748b',
                },
            }
            : {
                // Dark mode
                primary: {
                    main: '#818cf8',
                    light: '#a5b4fc',
                    dark: '#6366f1',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#f472b6',
                    light: '#f9a8d4',
                    dark: '#ec4899',
                    contrastText: '#ffffff',
                },
                success: {
                    main: '#34d399',
                    light: '#6ee7b7',
                    dark: '#10b981',
                },
                warning: {
                    main: '#fbbf24',
                    light: '#fcd34d',
                    dark: '#f59e0b',
                },
                error: {
                    main: '#f87171',
                    light: '#fca5a5',
                    dark: '#ef4444',
                },
                info: {
                    main: '#60a5fa',
                    light: '#93c5fd',
                    dark: '#3b82f6',
                },
                background: {
                    default: '#0f172a',
                    paper: '#1e293b',
                },
                text: {
                    primary: '#f1f5f9',
                    secondary: '#cbd5e1',
                },
            }),
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 800,
            fontSize: '2.2rem', // Reduced from 2.5rem
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            fontSize: '1.8rem', // Reduced from 2rem
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            fontSize: '1.5rem', // Reduced from 1.75rem
            lineHeight: 1.4,
        },
        h4: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '1.25rem', // Reduced from 1.5rem
            lineHeight: 1.4,
        },
        h5: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '1.1rem', // Reduced from 1.25rem
            lineHeight: 1.5,
        },
        h6: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '0.95rem', // Reduced from 1rem
            lineHeight: 1.6,
        },
        body1: {
            fontSize: '0.95rem', // Reduced from 1rem
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.85rem', // Reduced from 0.875rem
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Reduced from 10
                    padding: '8px 20px', // Reduced from 10px 24px
                    fontSize: '0.9rem', // Reduced from 0.95rem
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // Reduced from 16
                    boxShadow: mode === 'dark'
                        ? '0 4px 20px rgba(0, 0, 0, 0.5)'
                        : '0 4px 20px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // Reduced from 16
                },
                elevation1: {
                    boxShadow: mode === 'dark'
                        ? '0 2px 8px rgba(0, 0, 0, 0.4)'
                        : '0 2px 8px rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8, // Reduced from 10
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6, // Reduced from 8
                    fontWeight: 600,
                    height: 28, // Reduced height for more compact look
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                },
            },
        },
    },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
