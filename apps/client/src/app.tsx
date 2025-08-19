import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

import 'moment/locale/en-il'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import { SnackbarProvider } from 'notistack'

import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'

import { theme } from './utils/theme'
import Router from '@pro3/client/src/components/Router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// import Auth from 'components/Auth'

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin]
})

const queryClient = new QueryClient()

const App = () => (
  <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={theme}>
      {/* <Auth> */}
      <CssBaseline />

      <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='en-il'>
          <QueryClientProvider client={queryClient}>
            <Router />
          </QueryClientProvider>
        </LocalizationProvider>
      </SnackbarProvider>
      {/* </Auth> */}
    </ThemeProvider>
  </CacheProvider>
)

export default App
