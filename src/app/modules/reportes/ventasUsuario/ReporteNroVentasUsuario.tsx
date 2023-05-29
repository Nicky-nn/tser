import { Box } from '@mui/system'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import React, { FC, useMemo } from 'react'

import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import { genReplaceEmpty } from '../../../utils/helper'
import {
  DisplayColumnDefOptions,
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

const ReporteNroVentasUsuario: FC<Props> = (props) => {
  const { data } = props
  const columns = useMemo<MRT_ColumnDef<ReporteVentasUsuarioDetalleComposeProps>[]>(
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
  return (
    <>
      <Box>
        <MaterialReactTable
          columns={columns}
          data={data.detalle || []}
          initialState={{
            density: 'compact',
          }}
          localization={MRT_Localization_ES}
          displayColumnDefOptions={DisplayColumnDefOptions}
          muiTableProps={MuiTableProps}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          muiTableBodyRowProps={{ hover: false }}
        />
      </Box>
    </>
  )
}

export default ReporteNroVentasUsuario
