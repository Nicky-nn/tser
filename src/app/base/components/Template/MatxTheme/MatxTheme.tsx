import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC } from 'react'

import useSettings from '../../../hooks/useSettings'
import { CreateMatxThemesProps } from './themeColors'

type MatxThemeProps = {
  children: JSX.Element | JSX.Element[]
}

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
