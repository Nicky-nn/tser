import { themes } from '../MatxTheme/initThemes'
import { CreateMatxThemesProps, ThemeTypeColorsProps } from '../MatxTheme/themeColors'
import layout1Settings, { LayoutSettingsProps } from './Layout1/Layout1Settings'

export interface MatxLayoutSettingsProps {
  activeLayout: 'layout1' | 'layout2' // layout1, layout2
  activeTheme: ThemeTypeColorsProps // View all valid theme colors inside MatxTheme/themeColors.js
  perfectScrollbar: boolean
  themes: CreateMatxThemesProps
  layout1Settings: LayoutSettingsProps // open Layout1/Layout1Settings.js

  secondarySidebar: {
    show: boolean
    open: boolean
    theme: ThemeTypeColorsProps // View all valid theme colors inside MatxTheme/themeColors.js
  }
  // Footer options
  footer: {
    show: boolean
    fixed: boolean
    theme: ThemeTypeColorsProps // View all valid theme colors inside MatxTheme/themeColors.js
  }
}

// UPDATE BELOW CODE
// DOC http://demos.ui-lib.com/matx-react-doc/layout.html
export const MatxLayoutSettings: MatxLayoutSettingsProps = {
  activeLayout: 'layout1', // layout1, layout2
  activeTheme: 'blue', // View all valid theme colors inside MatxTheme/themeColors.js
  perfectScrollbar: true,

  themes: themes,
  layout1Settings, // open Layout1/Layout1Settings.js

  secondarySidebar: {
    show: true,
    open: false,
    theme: 'slateDark1', // View all valid theme colors inside MatxTheme/themeColors.js
  },
  // Footer options
  footer: {
    show: true,
    fixed: false,
    theme: 'slateDark1', // View all valid theme colors inside MatxTheme/themeColors.js
  },
}
