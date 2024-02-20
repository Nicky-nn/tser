import { Box, useTheme } from '@mui/material'
import {
  MRT_ColumnDef,
  MRT_Table,
  MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table'
import React, { FunctionComponent, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { MuiTableBasicOptionsProps } from '../../../../utils/muiTable/materialReactTableUtils'
import { FacturaInputProps } from '../../interfaces/factura'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
}

type Props = OwnProps

/**
 * @description Componente que muestra los datos del cliente
 * @param props
 * @constructor
 */
const DatosCliente: FunctionComponent<Props> = (props) => {
  const theme = useTheme()
  const {
    form: { watch },
  } = props
  const watchAllFields = watch()

  // Definimos la tabla de las columnas
  const columns = useMemo<MRT_ColumnDef<{ campo: string; valor: string }>[]>(
    () => [
      {
        accessorKey: 'campo',
        header: 'Campo',
        size: 75,
        Cell: ({ cell }) => <strong>{cell.getValue<string>()}</strong>,
      },
      { accessorKey: 'valor', header: 'Valor', grow: true },
    ],
    [],
  )

  /**
   * @description Material React Table
   */
  const table = useMaterialReactTable({
    ...(MuiTableBasicOptionsProps as MRT_TableOptions<{
      campo: string
      valor: string
    }>),
    columns,
    data: [
      {
        campo: 'Nombre/Razón Social',
        valor: watchAllFields.cliente?.razonSocial || '--',
      },
      {
        campo: 'NIT/CI/CEX',
        valor: `${watchAllFields.cliente?.numeroDocumento || '--'} ${watchAllFields.cliente?.complemento || ''}`,
      },
      {
        campo: 'Correo Electrónico',
        valor: watchAllFields.emailCliente || '--',
      },
    ],
    renderCaption: () => `Cliente`,
  })

  return (
    <>
      <Box overflow={'auto'}>
        <MRT_Table table={table} />
      </Box>
    </>
  )
}

export default DatosCliente
