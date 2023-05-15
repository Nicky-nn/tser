import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC, ReactElement } from 'react'

import useSettings from '../../../hooks/useSettings'
import { CreateMatxThemesProps } from './themeColors'

type MatxThemeProps = {
  children: ReactElement | ReactElement[] | null
}

/**
 * Inicio y creación de la plantilla matx
 * @param children
 * @constructor
 */
const MatxTheme: FC<MatxThemeProps> = ({ children }: MatxThemeProps) => {
  const { settings } = useSettings()
  // @ts-ignore
  let activeTheme: CreateMatxThemesProps = { ...settings.themes[settings.activeTheme] }
  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default MatxTheme
