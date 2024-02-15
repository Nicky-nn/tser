import { Button, Grid, Typography, useTheme } from '@mui/material'
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MRT_TableOptions,
} from 'material-react-table'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { FormTextField } from '../../../../base/components/Form'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import {
  DCDO,
  MuiTableBasicOptionsProps,
} from '../../../../utils/materialReactTableUtils'
import { DetalleFacturaProps, FacturaProps } from '../../../ventas/interfaces/factura'
import { NcdInputProps } from '../../interfaces/ncdInterface'
import NcdFacturaOriginalDialog from './NcdFacturaOriginalDialog'

interface OwnProps {
  form: UseFormReturn<NcdInputProps>
}

type Props = OwnProps

const NcdFacturaOriginal: FunctionComponent<Props> = (props) => {
  const theme = useTheme()
  const {
    form: {
      control,
      setValue,
      getValues,
      watch,
      formState: { errors },
    },
  } = props

  const [openDialog, setOpenDialog] = useState(false)
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})

  const [selectedRows, setSelectedRows] = useState([])

  const columns = useMemo<MRT_ColumnDef<DetalleFacturaProps>[]>(
    () => [
      {
        accessorKey: 'nroItem',
        header: 'Nro. Item',
        size: 50,
      },
      {
        accessorKey: 'cantidad',
        header: 'Cantidad',
        size: 80,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue<number>(), {})}</span>,
      },
      {
        accessorKey: 'descripcion',
        header: 'Descripción',
        minSize: 300,
        maxSize: 800,
        size: 100,
      },
      {
        accessorKey: 'montoDescuento',
        header: 'Descuento',
        size: 100,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue<number>(), {})}</span>,
      },
      {
        accessorKey: 'precioUnitario',
        header: 'Precio Unitario',
        size: 100,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue<number>(), {})}</span>,
      },
      {
        accessorKey: 'subTotal',
        header: 'Sub Total',
        size: 100,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue<number>(), {})}</span>,
      },
    ],
    [],
  )

  useEffect(() => {
    setSelectedRows([])
    setValue('detalleFactura', [])
  }, [])

  useEffect(() => {
    if (rowSelection) {
      const p = Object.keys(rowSelection)
      if (p.length > 0) {
        const pvs = getValues('detalle').filter((i) => p.includes(i.nroItem.toString()))
        if (pvs.length > 0) {
          const detalle = pvs.map((d: DetalleFacturaProps) => ({
            nroItem: d.nroItem,
            cantidadOriginal: d.cantidad,
            cantidad: d.cantidad,
            descripcion: d.descripcion,
            montoDescuento: d.montoDescuento,
            precioUnitario: d.precioUnitario,
            subTotal: d.subTotal,
          }))
          setValue('detalleFactura', detalle)
        } else {
          setValue('detalleFactura', [])
        }
      } else {
        setValue('detalleFactura', [])
      }
    }
  }, [rowSelection])

  return (
    <>
      <SimpleCard title={'DATOS DE LA FACTURA ORIGINAL'}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Button
              size={'small'}
              variant={'outlined'}
              color={'info'}
              onClick={() => setOpenDialog(true)}
            >
              Seleccionar Factura
            </Button>
            <hr />
          </Grid>
          <Grid item lg={2} md={2} xs={12}>
            <FormTextField
              name="numeroFactura"
              label="Número Factura"
              value={getValues('numeroFactura')}
              autoComplete="off"
            />
          </Grid>
          <Grid item lg={4} md={4} xs={12}>
            <FormTextField
              name="fechaEmision"
              label="Fecha Emisión"
              value={getValues('fechaEmision')}
            />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <FormTextField
              name="razonSocial"
              label="Razon Social"
              value={getValues('razonSocial')}
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <FormTextField
              name="cuf"
              label="Código Control (C.U.F.)"
              value={getValues('facturaCuf')}
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <Typography gutterBottom variant={'subtitle1'}>
              Seleccione los items a ser devueltos
            </Typography>
            <MaterialReactTable
              {...(MuiTableBasicOptionsProps(
                theme,
              ) as MRT_TableOptions<DetalleFacturaProps>)}
              columns={columns}
              data={getValues('detalle') || []}
              localization={MRT_Localization_ES}
              enableBottomToolbar={false}
              state={{
                rowSelection,
                density: 'comfortable',
              }}
              displayColumnDefOptions={DCDO}
              enableTopToolbar={false}
              enableRowSelection
              onRowSelectionChange={setRowSelection}
              getRowId={(row) => row.nroItem.toString()}
              muiTableBodyRowProps={({ row }) => ({
                onClick: row.getToggleSelectedHandler(),
                sx: {
                  cursor: 'pointer',
                },
              })}
            />
          </Grid>
        </Grid>
      </SimpleCard>
      <>
        <NcdFacturaOriginalDialog
          id={'ncdFacturaOriginalDialogSeleccion'}
          keepMounted={true}
          open={openDialog}
          onClose={(value?: FacturaProps) => {
            setOpenDialog(false)
            if (value) {
              setValue('numeroFactura', value.numeroFactura.toString())
              setValue('fechaEmision', value.fechaEmision)
              setValue('razonSocial', value.cliente.razonSocial)
              setValue('facturaCuf', value.cuf)
              setValue('detalleFactura', [])
              setValue('detalle', value.detalle)
              setSelectedRows([])
            }
          }}
        />
      </>
    </>
  )
}

export default NcdFacturaOriginal
