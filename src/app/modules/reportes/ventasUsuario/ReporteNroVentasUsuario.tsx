import { Box } from '@mui/material'
import {
  type MRT_ColumnDef,
  MRT_Table,
  MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table'
import React, { FC, useMemo } from 'react'

import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import { genReplaceEmpty } from '../../../utils/helper'
import { MuiTableBasicOptionsProps } from '../../../utils/muiTable/materialReactTableUtils'
import {
  ReporteVentasUsuarioComposeProps,
  ReporteVentasUsuarioDetalleComposeProps,
} from '../services/reporteVentasUsuarioCompose'

interface OwnProps {
  data: ReporteVentasUsuarioComposeProps
}

type Props = OwnProps

const ReporteNroVentasUsuario: FC<Props> = (props) => {
  const { data } = props
  const columns = useMemo<MRT_ColumnDef<ReporteVentasUsuarioDetalleComposeProps, any>[]>(
    () => [
      {
        accessorKey: 'usuario',
        header: 'Nombre de Usuario',
      },
      {
        accessorKey: 'nroValidadas',
        header: 'Nro. Validadas',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 130,
      },
      {
        accessorKey: 'nroAnuladas',
        header: 'Nro. Anulados',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 130,
      },
      {
        accessorKey: 'nroParcialFacturas',
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
    ...(MuiTableBasicOptionsProps as MRT_TableOptions<ReporteVentasUsuarioDetalleComposeProps>),
    columns,
    data: data.detalle || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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

export default ReporteNroVentasUsuario
