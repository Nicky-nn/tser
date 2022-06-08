import {FC} from 'react'
import {Theme, ThemeProvider} from '@mui/material'

type SecondarySidenavThemeProps = {
    theme: Theme,
    classes: string,
    children: JSX.Element,
    open: any
}

const SecondarySidenavTheme: FC<any> = ({theme, classes, children, open}: SecondarySidenavThemeProps) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
export default SecondarySidenavTheme
