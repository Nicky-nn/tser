import { Components, Theme } from '@mui/material'

import { themeShadows } from './themeColors'

interface ComponentsProps extends Components<Omit<Theme, 'components'>> {
  MUIDataTableSelectCell: any
  MUIDataTableHeadCell: any
  MUIDataTableBodyCell: any
  MuiExpansionPanel: any
}

export const components: ComponentsProps = {
  MuiTable: {
    styleOverrides: {
      root: {
        tableLayout: 'fixed',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: {
        fontSize: '13px',
        padding: '12px 0px',
      },
      root: {
        fontSize: '14px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        padding: '12px 8px 12px 0px',
      },
    },
  },
  MUIDataTableSelectCell: {
    styleOverrides: {
      root: {
        paddingLeft: 12,
      },
    },
  },
  MUIDataTableHeadCell: {
    styleOverrides: {
      root: {
        paddingLeft: 16,
      },
    },
  },
  MUIDataTableBodyCell: {
    styleOverrides: {
      root: {
        paddingLeft: 8,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        fontSize: '14px',
        textTransform: 'none',
        fontWeight: '400',
      },
      contained: {
        boxShadow: themeShadows[8],
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        MozOsxFontSmoothing: 'grayscale',
        WebkitFontSmoothing: 'antialiased',
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
      },
      a: {
        textDecoration: 'none',
        color: 'inherit',
      },
      '#root': {
        height: '100%',
      },
      '#nprogress .bar': {
        zIndex: '2000 !important',
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        boxShadow: themeShadows[12],
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        '&:before': {
          display: 'none',
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: '11px',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
      },
    },
  },
  MuiExpansionPanel: {
    styleOverrides: {
      root: {
        '&:before': {
          display: 'none',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        boxShadow:
          '0px 3px 3px -2px rgb(0 0 0 / 6%), 0px 3px 4px 0px rgb(0 0 0 / 4%), 0px 1px 8px 0px rgb(0 0 0 / 4%) !important',
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: '15px',
      },
      shrink: {
        transform: 'translate(15px, -11px) scale(0.90) !important',
      },
      outlined: {
        // transform: 'translate(15px 9px) scale(1)',
        backgroundColor: 'none',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& fieldset': {
          fontSize: '18px',
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        '& fieldset': {
          fontSize: '18px',
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        '& fieldset': {
          fontSize: '18px',
        },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        '& fieldset': {
          fontSize: 25,
        },
        '& .MuiSvgIcon-root': { fontSize: 25 },
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        '& fieldset': {
          fontSize: '18px',
        },
        '& .MuiSvgIcon-root': { fontSize: 25 },
      },
    },
  },
}
