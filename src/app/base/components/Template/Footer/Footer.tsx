import { AppBar, styled, ThemeProvider, Toolbar, useTheme } from '@mui/material'
import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'

import { topBarHeight } from '../../../../utils/constant'
import useSettings from '../../../hooks/useSettings'
import { Paragraph, Span } from '../Typography'

const AppFooter = styled(Toolbar)(() => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: topBarHeight,
  '@media (max-width: 499px)': {
    display: 'table',
    width: '100%',
    minHeight: 'auto',
    padding: '1rem 0',
    '& .container': {
      flexDirection: 'column !important',
      '& a': {
        margin: '0 0 16px !important',
      },
    },
  },
}))

const FooterContent = styled('div')(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '0px 1rem',
  maxWidth: '1170px',
  margin: '0 auto',
}))

const nombreComercial = import.meta.env.ISI_NOMBRE_COMERCIAL || 'ISI.INVOICE'
const urlEmpresa = import.meta.env.ISI_URL || 'https://integrate.com.bo'

const Footer: FC<any> = () => {
  const theme = useTheme()
  const { settings } = useSettings()
  const location = useLocation()

  const shouldBeCompact = location.pathname.includes('/pedidos/registrar')

  const footerTheme = settings.themes[settings.footer.theme] || theme

  if (shouldBeCompact) {
    return null // Si se cumple la condición, el Footer no se mostrará
  }

  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar color={'primary'} position="static" sx={{ zIndex: 96 }}>
        <AppFooter>
          <FooterContent>
            <Span sx={{ m: 'auto' }}></Span>
            <Paragraph sx={{ m: 0 }}>
              <a href={urlEmpresa} target="_blank" rel="noreferrer">
                © {nombreComercial}
              </a>
              {' 2003-2024 '}
            </Paragraph>
          </FooterContent>
        </AppFooter>
      </AppBar>
    </ThemeProvider>
  )
}

export default Footer
