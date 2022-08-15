import SecondarySidebarToggle from './SecondarySidebarToggle'
import SecondarySidebarContent from './SecondarySidebarContent'
import SecondarySidenavTheme from '../MatxTheme/SecondarySidenavTheme/SecondarySidenavTheme'
import useSettings from "../../../hooks/useSettings";

const SecondarySidebar = () => {
    const {settings} = useSettings()
    // @ts-ignore
    const secondarySidebarTheme: any = settings.themes[settings.secondarySidebar.theme]

    return (
        <SecondarySidenavTheme theme={secondarySidebarTheme}>
            {settings.secondarySidebar.open! && <SecondarySidebarContent/>}
            <SecondarySidebarToggle/>
        </SecondarySidenavTheme>
    )
}

export default SecondarySidebar
