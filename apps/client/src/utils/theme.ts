import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: '#00A064',
      dark: '#282828',
      light: '#4B4B4B'
    },
    secondary: {
      main: '#117220'
    }
    // badge: {
    //   main: '#d32424',
    //   light: '#da0606',
    //   dark: '#da0606',
    //   contrastText: 'white'
    // }
    // background: {
    //   main: '#3C3C3C',
    //   dark: '#282828',
    //   light: '#4B4B4B'
    // }
  }
})
