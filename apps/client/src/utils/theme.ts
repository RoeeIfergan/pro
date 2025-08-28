import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        '*': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.background.default,
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.divider,
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: theme.palette.text.secondary
            }
          }
        }
      })
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: '#d32f2f'
        }
      }
    }
  },
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: '#00A064',
      dark: '#282828',
      light: '#13bb7c'
    },
    secondary: {
      main: '#117220'
    },
    // badge: {
    //   main: '#d32424',
    //   light: '#da0606',
    //   dark: '#da0606',
    //   contrastText: 'white'
    // }
    background: {
      default: '#3C3C3C',
      paper: '#121212'
    }
  }
})
