import {createTheme, CssBaseline, ThemeProvider} from '@mui/material'
import useSettings from "../../../hooks/useSettings";
import {FC} from "react";
import {esES} from "@mui/material/locale";

type MatxThemeProps = {
    children: JSX.Element
}

const MatxTheme: FC<any> = ({children}: MatxThemeProps) => {
    const {settings} = useSettings()
    let activeTheme = {...settings.themes[settings.activeTheme]}
    return (
        <ThemeProvider theme={createTheme(activeTheme, esES)}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    )
}

export default MatxTheme
