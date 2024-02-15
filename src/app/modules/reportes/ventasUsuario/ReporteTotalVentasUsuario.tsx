import { Box, useTheme } from '@mui/material'
import {
  MRT_ColumnDef,
  MRT_Table,
  MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table'
import React, { FC, useMemo } from 'react'

import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import { genReplaceEmpty } from '../../../utils/helper'
import {
  DCDO,
  DcdoProps,
  MuiTableBasicOptionsProps,
  MuiTableProps,
} from '../../../utils/materialReactTableUtils'
import {
  ReporteVentasUsuarioComposeProps,
  ReporteVentasUsuarioDetalleComposeProps,
} from '../services/reporteVentasUsuarioCompose'

interface OwnProps {
  data: ReporteVentasUsuarioComposeProps
}

type Props = OwnProps

const ReporteTotalVentasUsuario: FC<Props> = (props) => {
  const theme = useTheme()
  const { data } = props
  const columns = useMemo<MRT_ColumnDef<ReporteVentasUsuarioDetalleComposeProps>[]>(
    () => [
      {
        accessorKey: 'usuario',
        header: 'Nombre de Usuario',
      },
      {
        accessorKey: 'montoValidadas',
        header: 'Monto Total Validadas',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 150,
      },
      {
        accessorKey: 'montoAnuladas',
        header: 'Monto Total Anulados',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 150,
      },
      {
        accessorKey: 'montoParcialFacturas',
        header: 'SUB-TOTAL',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
      },
    ],
    [],
  )
  const table = useMaterialReactTable({
    ...(MuiTableBasicOptionsProps(
      theme,
    ) as MRT_TableOptions<ReporteVentasUsuarioDetalleComposeProps>),
    columns,
    data: data.detalle || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableGlobalFilter: false, //turn off a feature
    initialState: {
      density: 'compact',
    },
    displayColumnDefOptions: DCDO as DcdoProps<ReporteVentasUsuarioDetalleComposeProps>,
    muiTableBodyRowProps: { hover: false },
    enableTableHead: true,
  })

  return (
    <>
      <Box overflow={'auto'}>
        <MRT_Table table={table} />
      </Box>
    </>
  )
}

export default ReporteTotalVentasUsuario
