import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

import 'moment/locale/en-il'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import { prefixer } from 'stylis'
import { SnackbarProvider } from 'notistack'
import rtlPlugin from 'stylis-plugin-rtl'

import { theme } from '@client/utils/theme'
import Router from '@client/components/Router'
// import Auth from 'components/Auth'

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin]
})

const App = () => {
  console.log('asdas')

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        {/* <Auth> */}
        <CssBaseline />

        <SnackbarProvider
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale='en-il'
          >
            <Router />
          </LocalizationProvider>
        </SnackbarProvider>
        {/* </Auth> */}
      </ThemeProvider>
    </CacheProvider>
  )
}

export default App
