import {CssBaseline, ThemeProvider} from '@mui/material'
import useSettings from "../../../hooks/useSettings";
import {FC} from "react";

type MatxThemeProps = {
    children: JSX.Element
}

const MatxTheme: FC<any> = ({children}: MatxThemeProps) => {
    const {settings} = useSettings()
    let activeTheme = {...settings.themes[settings.activeTheme]}
    return (
        <ThemeProvider theme={activeTheme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    )
}

export default MatxTheme
