import './App.css'

import { CssBaseline } from '@mui/material'
import { useEffect } from 'react'
import { useRoutes } from 'react-router-dom'

import MatxTheme from './app/base/components/Template/MatxTheme/MatxTheme'
import { AuthProvider } from './app/base/contexts/JWTAuthContext'
import { SettingsProvider } from './app/base/contexts/SettingsContext'
import { appRoutes } from './app/routes/routes'
import { genReplaceEmpty } from './app/utils/helper'

function App() {
  const content = useRoutes(appRoutes)

  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]')
    if (link) {
      if (import.meta.env.ISI_FAVICON) {
        link.setAttribute('href', import.meta.env.ISI_FAVICON)
      }
    }
  }, [])

  return (
    <SettingsProvider>
      <AuthProvider>
        <MatxTheme>
          <CssBaseline />
          {content}
        </MatxTheme>
      </AuthProvider>
    </SettingsProvider>
  )
}

export default App
