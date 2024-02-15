import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material'
import { replace } from 'lodash'
import React, { FunctionComponent, useEffect } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'

import { TarjetaMask } from '../../../../base/components/Mask/TarjetaMask'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import useQueryMetodosPago from '../../../base/metodoPago/hooks/useQueryMetodosPago'
import { MetodoPagoProp } from '../../../base/metodoPago/interfaces/metodoPago'
import { FacturaInputProps } from '../../interfaces/factura'
import { METODOS_PAGO_TARJETA } from '../../utils/metodosPago'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
}

type Props = OwnProps
const MetodosPago: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      watch,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props
  const codigoMetodoPagoValue = watch('codigoMetodoPago')

  const { metodosPago, mpIsError, mpError, mpLoading } = useQueryMetodosPago()

  useEffect(() => {
    const metodoPago = codigoMetodoPagoValue.codigoClasificador
    // Si el método de págo no es tarjeta, setear el codigo a ''
    if (!METODOS_PAGO_TARJETA.includes(metodoPago)) {
      setValue('numeroTarjeta', '')
    }
  }, [codigoMetodoPagoValue])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Controller
            name={'codigoMetodoPago'}
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.codigoMetodoPago)}>
                <MyInputLabel shrink>Método de Págo</MyInputLabel>
                <Select<MetodoPagoProp>
                  {...field}
                  styles={{
                    ...reactSelectStyle(Boolean(errors.codigoMetodoPago)),
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      fontWeight: 'bold',
                      fontSize: '15px',
                    }),
                  }}
                  name="codigoMetodoPago"
                  placeholder={'Seleccione el método de págo'}
                  value={field.value}
                  onChange={async (val: any) => {
                    field.onChange(val)
                  }}
                  onBlur={async (val) => {
                    field.onBlur()
                  }}
                  isSearchable={false}
                  options={metodosPago}
                  getOptionValue={(item) => item.codigoClasificador.toString()}
                  getOptionLabel={(item) =>
                    `${item.codigoClasificador} - ${item.descripcion}`
                  }
                />
                {errors.codigoMetodoPago && (
                  <FormHelperText>{errors.codigoMetodoPago?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name={'numeroTarjeta'}
            control={control}
            disabled={
              !METODOS_PAGO_TARJETA.includes(
                getValues('codigoMetodoPago').codigoClasificador,
              )
            }
            render={({ field }) => (
              <FormControl fullWidth style={{ zIndex: 0 }}>
                <TextField
                  {...field}
                  label="Número de tarjeta"
                  variant={'outlined'}
                  value={field.value || ''}
                  onChange={(event) => {
                    const numeroTarjeta = replace(
                      event.target.value,
                      new RegExp('-', 'g'),
                      '',
                    )
                      .replace(/_/g, '')
                      .trim()
                    field.onChange(numeroTarjeta)
                  }}
                  name="numeroTarjeta"
                  size={'small'}
                  InputProps={{
                    inputComponent: TarjetaMask as any,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <FormHelperText>
                  Ingrese los primeros 4 y últimos 4 dígitos
                </FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default MetodosPago
