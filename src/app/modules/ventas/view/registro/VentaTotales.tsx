// noinspection GraphQLUnresolvedReference

import { Discount, MonetizationOn, Paid } from '@mui/icons-material'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  useTheme,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  MRT_ColumnDef,
  MRT_Table,
  MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table'
import InputNumber from 'rc-input-number'
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import RepresentacionGraficaUrls from '../../../../base/components/RepresentacionGrafica/RepresentacionGraficaUrls'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../../base/hooks/useAuth'
import { genReplaceEmpty, openInNewTab } from '../../../../utils/helper'
import { MuiTableBasicOptionsProps } from '../../../../utils/materialReactTableUtils'
import { notError } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { genRound } from '../../../../utils/utils'
import { apiMonedas } from '../../../base/moneda/api/monedaListado.api'
import { MonedaProps } from '../../../base/moneda/interfaces/moneda'
import { fetchFacturaCreate } from '../../api/facturaCreate.api'
import { FacturaInitialValues, FacturaInputProps } from '../../interfaces/factura'
import {
  genCalculoTotalesService,
  montoSubTotal,
} from '../../services/operacionesService'
import { composeFactura, composeFacturaValidator } from '../../utils/composeFactura'
import MetodosPago from './MetodosPago'
import { DescuentoAdicionalDialog } from './ventaTotales/DescuentoAdicionalDialog'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
}

type Props = OwnProps

// Definimos las columnas a mostrar
interface TblVentaTotalesProps {
  campo: string
  valor: string
  id: number
  moneda: string
}

const tblColumns: MRT_ColumnDef<TblVentaTotalesProps>[] = [
  {
    accessorKey: 'campo',
    header: 'Campo',
    size: 100,
    Cell: ({ cell }) => <strong>{cell.getValue<string>().toUpperCase()}</strong>,
  },
  {
    accessorKey: 'valor',
    header: 'Valor',
    muiTableBodyCellProps: {
      align: 'right',
    },
    Cell: ({ cell, row }) => {
      if (row.original.id === 5) {
        return (
          <>
            <span style={{ fontWeight: 500, fontSize: '1.2em' }}>
              {cell.getValue<string>()}
            </span>{' '}
            <span style={{ fontSize: '0.9em', fontWeight: 500 }}>
              {row.original.moneda}
            </span>
          </>
        )
      }
      return (
        <>
          <span style={{ fontWeight: 400, fontSize: '1.1em' }}>
            {cell.getValue<string>()}
          </span>{' '}
          <span style={{ fontSize: '0.8em' }}> {row.original.moneda}</span>
        </>
      )
    },
  },
]

/**
 * @description Cálculo de ventas totales, descuentos y datos del cliente de venta
 * @param props
 * @constructor
 */
const VentaTotales: FunctionComponent<Props> = (props) => {
  const theme = useTheme()
  const {
    user: { moneda, monedaTienda, tipoRepresentacionGrafica },
  } = useAuth()
  const {
    form: {
      control,
      reset,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props
  const [openDescuentoAdicional, setOpenDescuentoAdicional] = useState(false)
  const mySwal = withReactContent(Swal)
  const inputMoneda = getValues('moneda')
  const tipoCambio = getValues('tipoCambio')

  const handleFocus = (event: any) => event.target.select()

  /**
   * @description validacion, Composición y envio del formulario de factura
   * @param data
   */
  const onSubmit: SubmitHandler<FacturaInputProps> = async (data) => {
    const inputFactura = composeFactura(data)
    const validator = await composeFacturaValidator(inputFactura).catch((err: Error) => {
      notError(err.message)
    })

    if (validator) {
      await swalAsyncConfirmDialog({
        text: '¿Confirma que desea emitir el documento fiscal?',
        preConfirm: () => {
          return fetchFacturaCreate(inputFactura).catch((err) => {
            swalException(err)
            return false
          })
        },
      }).then((resp) => {
        if (resp.isConfirmed) {
          const { value }: any = resp
          reset({ ...FacturaInitialValues, actividadEconomica: data.actividadEconomica })
          if (tipoRepresentacionGrafica === 'pdf')
            openInNewTab(value.representacionGrafica.pdf)
          if (tipoRepresentacionGrafica === 'rollo')
            openInNewTab(value.representacionGrafica.rollo)
          mySwal.fire({
            title: `Documento generado correctamente`,
            html: (
              <RepresentacionGraficaUrls
                representacionGrafica={value.representacionGrafica}
              />
            ),
          })
        }
      })
    }
  }

  const {
    data: monedas,
    isLoading: monedaLoading,
    isError: monedasIsError,
    error: monedasError,
  } = useQuery<MonedaProps[], Error>({
    queryKey: ['apiMonedas'],
    queryFn: async () => {
      const resp = await apiMonedas()
      if (resp.length > 0) {
        // monedaUsuario
        const sessionMoneda = resp.find(
          (i) => i.codigo === genReplaceEmpty(inputMoneda?.codigo, moneda.codigo),
        )
        // montoTienda
        const mt = resp.find((i) => i.codigo === monedaTienda.codigo)
        if (sessionMoneda && mt) {
          setValue('moneda', sessionMoneda)
          setValue('tipoCambio', mt.tipoCambio)
        }
        return resp
      }
      return []
    },
  })

  const calculoMoneda = (monto: number): number => {
    try {
      return genRound((monto * tipoCambio) / genRound(inputMoneda!.tipoCambio))
    } catch (e) {
      return monto
    }
  }

  // Creación de la tabla para mostrar los totales
  const columns = useMemo<MRT_ColumnDef<TblVentaTotalesProps>[]>(() => tblColumns, [])
  const table = useMaterialReactTable({
    ...(MuiTableBasicOptionsProps(theme) as MRT_TableOptions<TblVentaTotalesProps>),
    columns,
    data: [
      {
        campo: 'Sub-Total',
        id: 1,
        valor: numberWithCommas(calculoMoneda(getValues('montoSubTotal') || 0), {}),
        moneda: inputMoneda?.sigla || '',
      },
      {
        campo: 'Descuento Adicional',
        id: 2,
        valor: numberWithCommas(calculoMoneda(getValues('descuentoAdicional') || 0), {}),
        moneda: inputMoneda?.sigla || '',
      },
      {
        campo: 'Monto Gift-Card',
        id: 3,
        valor: numberWithCommas(calculoMoneda(getValues('montoGiftCard') || 0), {}),
        moneda: inputMoneda?.sigla || '',
      },
      {
        campo: 'Total',
        id: 4,
        valor: numberWithCommas(calculoMoneda(getValues('total') || 0), {}),
        moneda: inputMoneda?.sigla || '',
      },
      {
        campo: 'Monto a Pagar',
        id: 5,
        valor: numberWithCommas(calculoMoneda(getValues('montoPagar') || 0), {}),
        moneda: inputMoneda?.sigla || '',
      },
    ],
    renderCaption: () => `Cálculo de los totales.`,
    enableRowActions: true,
    positionActionsColumn: 'last',
    displayColumnDefOptions: {
      'mrt-row-actions': {
        minSize: 20,
        size: 30, //if using layoutMode that is not 'semantic', the columns will not auto-size, so you need to set the size manually
        grow: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
    },
    renderRowActions: ({ row }) => {
      if (row.original.id === 2) {
        return (
          <IconButton
            size={'small'}
            onClick={() => setOpenDescuentoAdicional(true)}
            color={'primary'}
          >
            <Discount />
          </IconButton>
        )
      }
      if (row.original.id === 3) {
        return (
          <IconButton size={'small'} color={'secondary'}>
            <Discount />
          </IconButton>
        )
      }
      return ''
    },
  })

  useEffect(() => {
    const totales = genCalculoTotalesService(getValues())
    setValue('montoSubTotal', totales.subTotal)
    setValue('montoPagar', totales.montoPagar)
    setValue('inputVuelto', totales.vuelto)
    setValue('total', totales.total)
  }, [getValues('descuentoAdicional'), getValues('inputMontoPagar')])

  return (
    <>
      <SimpleCard title="Cálculo de los totales" childIcon={<MonetizationOn />}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {monedaLoading ? (
              <AlertLoading />
            ) : (
              <Controller
                name="moneda"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.moneda)}>
                    <MyInputLabel shrink>Moneda de venta</MyInputLabel>
                    <Select<MonedaProps>
                      {...field}
                      styles={{
                        ...reactSelectStyle(false),
                        control: (styles) => ({
                          ...styles,
                          fontWeight: 500,
                          fontSize: '1.1em',
                        }),
                      }}
                      name="moneda"
                      placeholder={'Seleccione la moneda de venta'}
                      value={field.value}
                      onChange={async (val: any) => {
                        field.onChange(val)
                      }}
                      onBlur={async (val) => {
                        field.onBlur()
                      }}
                      isSearchable={false}
                      options={monedas}
                      getOptionValue={(item) => item.codigo.toString()}
                      getOptionLabel={(item) =>
                        `${item.descripcion} (${item.sigla}) - ${numberWithCommas(item.tipoCambio, {})}`
                      }
                    />
                    {errors.moneda && (
                      <FormHelperText>{errors.moneda?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <MetodosPago form={props.form} />
          </Grid>
          <Grid item xs={12}>
            <Box overflow={'auto'}>
              <MRT_Table table={table} />
            </Box>
          </Grid>
          <Grid item xs={12} md={7} lg={7}>
            <Controller
              control={control}
              name={'inputMontoPagar'}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.inputMontoPagar?.message)}>
                  <MyInputLabel shrink>Ingrese Monto</MyInputLabel>
                  <InputNumber
                    {...field}
                    min={0}
                    id={'montoPagar'}
                    className="inputMontoPagar"
                    value={field.value}
                    onFocus={handleFocus}
                    onChange={(value: number | null) => {
                      field.onChange(value)
                    }}
                    precision={2}
                    formatter={numberWithCommas}
                  />
                  <FormHelperText>{errors.inputMontoPagar?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            <TextField
              color="info"
              fullWidth
              inputProps={{
                style: { textAlign: 'right' },
                readOnly: true,
              }}
              sx={{
                '& .MuiInputBase-root': {
                  color: 'error.main',
                  fontSize: '16px',
                  fontWeight: 500,
                },
              }}
              size={'small'}
              label="Vuelto / Saldo"
              value={numberWithCommas(calculoMoneda(getValues('inputVuelto') || 0), {})}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              fullWidth={true}
              color="primary"
              size={'large'}
              startIcon={<Paid />}
            >
              REALIZAR PAGO
            </Button>
          </Grid>
        </Grid>
      </SimpleCard>

      <DescuentoAdicionalDialog
        id="ringtone-menu"
        keepMounted={false}
        open={openDescuentoAdicional}
        onClose={(newValue) => {
          setOpenDescuentoAdicional(false)
          if (newValue || newValue === 0) {
            setValue('descuentoAdicional', newValue)
          }
        }}
        value={getValues('descuentoAdicional') || 0}
      />
    </>
  )
}
export default VentaTotales
