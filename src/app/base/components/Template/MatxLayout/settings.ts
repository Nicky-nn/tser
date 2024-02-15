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

const isiTheme: ThemeTypeColorsProps =
  (import.meta.env.ISI_THEME as ThemeTypeColorsProps) || ''
let activeTheme: ThemeTypeColorsProps = 'default'
let color2: ThemeTypeColorsProps = 'defaultDark'

if (isiTheme === 'green') {
  activeTheme = 'green'
  color2 = 'greenDark'
}

if (isiTheme === 'blue') {
  activeTheme = 'blue'
  color2 = 'blueDark'
}

if (isiTheme === 'blue1') {
  activeTheme = 'blue1'
  color2 = 'blueDark1'
}

if (isiTheme === 'purple') {
  activeTheme = 'purple'
  color2 = 'purpleDark'
}

if (isiTheme === 'indigo') {
  activeTheme = 'indigo'
  color2 = 'indigoDark'
}

// UPDATE BELOW CODE
// DOC http://demos.ui-lib.com/matx-react-doc/layout.html
export const MatxLayoutSettings: MatxLayoutSettingsProps = {
  activeLayout: 'layout1', // layout1, layout2
  activeTheme, // View all valid theme colors inside MatxTheme/themeColors.js
  perfectScrollbar: false,

  themes: themes,
  // Color del layout izquierdo y del top
  layout1Settings: {
    leftSidebar: {
      show: true,
      mode: 'full', // full, close, compact, mobile,
      theme: color2, // View all valid theme colors inside MatxTheme/themeColors.js
      bgImgURL: '/assets/images/sidebar/sidebar-bg-dark.jpg',
    },
    topbar: {
      show: true,
      fixed: true,
      theme: activeTheme, // View all valid theme colors inside MatxTheme/themeColors.js
    },
  }, // open Layout1/Layout1Settings.js

  secondarySidebar: {
    show: false,
    open: false,
    theme: color2, // View all valid theme colors inside MatxTheme/themeColors.js
  },
  // Footer options
  footer: {
    show: true,
    fixed: false,
    theme: color2, // View all valid theme colors inside MatxTheme/themeColors.js
  },
}
