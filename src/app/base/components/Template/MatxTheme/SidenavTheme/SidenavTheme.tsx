import {ThemeProvider, useTheme} from '@mui/material'
import useSettings from "../../../../hooks/useSettings";
import {FC} from "react";

interface SidenavThemeProp {
    children: JSX.Element
}

const SidenavTheme: FC<SidenavThemeProp> = ({children}: SidenavThemeProp) => {
    const theme = useTheme()
    const {settings} = useSettings()
    const sidenavTheme =
        settings.themes[settings.layout1Settings.leftSidebar.theme] || theme

    return <ThemeProvider theme={sidenavTheme}>{children}</ThemeProvider>
}

export default SidenavTheme
