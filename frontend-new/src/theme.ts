import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#181B2C', // dark navy blue
      light: '#23264a',
      dark: '#101223',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6C63FF', // accent purple/blue
      light: '#8d86ff',
      dark: '#4b47b2',
      contrastText: '#fff',
    },
    background: {
      default: '#181B2C', // sidebar/nav background
      paper: '#fff', // cards/forms
    },
    text: {
      primary: '#181B2C', // dark text on light
      secondary: '#6C63FF', // accent text
    },
    divider: '#E0E3E7',
  },
  typography: {
    fontFamily: 'Poppins, Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#181B2C',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#181B2C',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#181B2C',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#181B2C',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#181B2C',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#181B2C',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#181B2C',
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.43,
      color: '#181B2C',
    },
    button: {
      fontWeight: 600,
      fontSize: '1rem',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 18, // pill/rounded
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '10px 28px',
          fontWeight: 600,
          boxShadow: 'none',
        },
        contained: {
          backgroundColor: '#181B2C',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#23264a',
            boxShadow: '0px 2px 8px rgba(24, 27, 44, 0.08)',
          },
        },
        outlined: {
          borderColor: '#181B2C',
          color: '#181B2C',
          '&:hover': {
            backgroundColor: '#f5f6fa',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0px 4px 24px rgba(24, 27, 44, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0px 4px 24px rgba(24, 27, 44, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 18,
            background: '#f5f6fa',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: '#f5f6fa',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#181B2C',
          color: '#fff',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 0',
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: '#23264a',
            color: '#fff',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
  },
});

export default theme; 