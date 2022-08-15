import {ThemeTypeColorsProps} from "../../MatxTheme/themeColors";


export interface LayoutSettingsProps {
    leftSidebar: {
        show: boolean,
        mode: 'full' | 'close' | 'compact' | 'mobile',
        theme: ThemeTypeColorsProps, // View all valid theme colors inside MatxTheme/themeColors.js
        bgImgURL: string,
    },
    topbar: {
        show: boolean,
        fixed: boolean,
        theme: ThemeTypeColorsProps, // View all valid theme colors inside MatxTheme/themeColors.js
    },
}

const Layout1Settings: LayoutSettingsProps = {
    leftSidebar: {
        show: true,
        mode: 'full', // full, close, compact, mobile,
        theme: 'slateDark1', // View all valid theme colors inside MatxTheme/themeColors.js
        bgImgURL: '/assets/images/sidebar/sidebar-bg-dark.jpg',
    },
    topbar: {
        show: true,
        fixed: true,
        theme: 'whiteBlue', // View all valid theme colors inside MatxTheme/themeColors.js
    },
}

export default Layout1Settings
