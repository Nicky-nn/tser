import { TextFieldProps, Theme } from '@mui/material'
import { AlertProps } from '@mui/material/Alert'
import { TableProps } from '@mui/material/Table'
import {
  MRT_DisplayColumnDef,
  MRT_DisplayColumnIds,
  MRT_RowData,
  MRT_TableOptions,
} from 'material-react-table'
import { MRT_Localization_ES } from 'material-react-table/locales/es'

export const muiTableApiEstado = ['ANULADO', 'VALIDADA', 'ELABORADO', 'PENDIENTE']

const tableThemeDarkDark = 'rgba(3, 44, 43, 1)'
const tableThemeLigth = 'rgba(254, 254, 254, 1)'

export type DcdoProps<TData extends MRT_RowData, TValue = unknown> = Partial<{
  [key in MRT_DisplayColumnIds]: Partial<MRT_DisplayColumnDef<TData, TValue>>
}>

/**
 * @description Espacio de para las acciones de fila
 */
export const DCDO: DcdoProps<any> = {
  'mrt-row-actions': {
    muiTableHeadCellProps: {
      align: 'center',
      headers: 'Acciones',
    },
    size: 100,
  },
}

/**
 * @description Input para búsquedas
 */
export const MuiSearchTextFieldProps: TextFieldProps = {
  variant: 'outlined',
  placeholder: 'Búsqueda',
  InputLabelProps: { shrink: true },
  size: 'small',
}

export const MuiToolbarAlertBannerProps = (isError: boolean): AlertProps | undefined =>
  isError ? { color: 'error', children: 'Error en cargar los datos' } : undefined

/**
 * @description Ancho de los inputs y propiedades segun mui
 * muiFilterTextFieldProps
 */
export const MuiFilterTextFieldProps: TextFieldProps = {
  sx: { m: '0.5rem 0', width: '95%' },
  variant: 'outlined',
  size: 'small',
}

/**
 * @description propiedades de la tabla segun especificaciones de MUI
 */
export const MuiTableProps: TableProps = {
  sx: {
    tableLayout: 'fixed',
    // border: '1px solid rgba(81, 81, 81, .1)',
    caption: {
      captionSide: 'top',
      padding: 0.5,
    },
  },
}
/**
 * @description propiedades de la tabla segun especificaciones de MUI
 */
export const MuiTableCompactProps: TableProps = {
  sx: {
    tableLayout: 'fixed',
    border: '1px solid rgba(81, 81, 81, .2)',
    caption: {
      captionSide: 'top',
      padding: 0.5,
    },
  },
}

/**
 * @description propiedades de la tabla muy básica según especificaciones de MUI
 */
export const MuiTableBasicOptionsProps = (theme: Theme): MRT_TableOptions<any> => {
  const baseBackgroundColor =
    theme.palette.mode === 'dark' ? tableThemeDarkDark : 'rgba(252, 252, 252, 1)'
  return {
    columns: [],
    data: [],
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableTableHead: false,
    muiTableProps: MuiTableCompactProps,
    muiTableBodyRowProps: { hover: false },
    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor, // Color en funcio a useTheme que se haya elegido
      draggingBorderColor: theme.palette.secondary.main,
    }),
    initialState: {
      density: 'compact',
    },
    localization: MRT_Localization_ES,
  }
}

/**
 * @description propiedades de la tabla muy básica según especificaciones de MUI
 */
export const MuiTableAdvancedOptionsProps = (theme: Theme): MRT_TableOptions<any> => {
  //light or dark green
  const baseBackgroundColor =
    theme.palette.mode === 'dark' ? tableThemeDarkDark : tableThemeLigth

  return {
    columns: [],
    data: [],
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableDensityToggle: false,
    enableGlobalFilter: false,
    localization: MRT_Localization_ES,
    enableRowActions: true,
    positionActionsColumn: 'first',
    muiFilterTextFieldProps: MuiFilterTextFieldProps,
    enableColumnResizing: true,
    layoutMode: 'grid',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'head-overlay',
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [5, 10, 20, 30, 50, 100],
      shape: 'rounded',
      variant: 'outlined',
    },
    muiTablePaperProps: {
      elevation: 1, //Cambiamos la elevacion de sombras
      //customizamos los bordes
      sx: {
        borderRadius: '2',
        border: '1px solid rgba(81, 81, 81, .1)',
      },
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor, // Color en funcio a useTheme que se haya elegido
      draggingBorderColor: theme.palette.secondary.main,
    }),
  }
}
