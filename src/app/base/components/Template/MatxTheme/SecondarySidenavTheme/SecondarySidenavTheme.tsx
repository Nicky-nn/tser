import {FC} from 'react'
import {Theme, ThemeProvider} from '@mui/material'

type SecondarySidenavThemeProps = {
    theme: Theme,
    classes?: string,
    children: JSX.Element | JSX.Element[],
    open?: any
}

const SecondarySidenavTheme = ({theme, classes, children, open}: SecondarySidenavThemeProps) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
export default SecondarySidenavTheme
