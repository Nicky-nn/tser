import { TextFieldProps } from '@mui/material'
import { AlertProps } from '@mui/material/Alert'
import { TableProps } from '@mui/material/Table'
import { MRT_ColumnDef, MRT_DisplayColumnIds } from 'material-react-table'

export const muiTableApiEstado = ['ANULADO', 'VALIDADA', 'ELABORADO', 'PENDIENTE']

/**
 * @description Espacio de para las acciones de fila
 */
export const DisplayColumnDefOptions: Partial<{
  [key in MRT_DisplayColumnIds]: Partial<MRT_ColumnDef>
}> = {
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
 */
export const MuiTableHeadCellFilterTextFieldProps: TextFieldProps = {
  sx: { m: '0.5rem 0', width: '92%' },
  variant: 'outlined',
  size: 'small',
}

/**
 * @description propiedades de la tabla segun especificaciones de MUI
 */
export const MuiTableProps: TableProps = {
  sx: {
    tableLayout: 'fixed',
  },
}
