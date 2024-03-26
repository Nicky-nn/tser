import { ThemeOptions } from '@mui/material'
import { red } from '@mui/material/colors'

import { components } from './components'

export interface ThemeOptionsProps extends ThemeOptions {
  status: {
    danger: any
  }
}

const themeOptions: ThemeOptionsProps = {
  typography: {
    fontSize: 14,
    body1: {
      fontSize: '14px',
    },
  },
  status: {
    danger: red[500],
  },
  components: {
    ...components,
  },
}

export default themeOptions
