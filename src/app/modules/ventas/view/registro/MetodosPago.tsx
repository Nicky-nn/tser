import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material'
import { replace } from 'lodash'
import React, { FunctionComponent, useEffect } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'

import { TarjetaMask } from '../../../../base/components/Mask/TarjetaMask'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyles } from '../../../../base/components/MySelect/ReactSelect'
import useQueryMetodosPago from '../../../base/metodoPago/hooks/useQueryMetodosPago'
import { MetodoPagoProp } from '../../../base/metodoPago/interfaces/metodoPago'
import { FacturaInputProps } from '../../interfaces/factura'

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
    if (metodoPago === 1) {
      setValue('numeroTarjeta', '')
    }
  }, [codigoMetodoPagoValue])

  return (
    <>
      <Stack spacing={3} pt={2} mt={2}>
        <Controller
          name={'codigoMetodoPago'}
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={Boolean(errors.codigoMetodoPago)}>
              <MyInputLabel shrink>Método de Págo</MyInputLabel>
              <Select<MetodoPagoProp>
                {...field}
                styles={{
                  ...reactSelectStyles,
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

        {getValues('codigoMetodoPago').codigoClasificador === 2 && (
          <>
            <Controller
              name={'numeroTarjeta'}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size={'small'} focused style={{ zIndex: 0 }}>
                  <InputLabel htmlFor="formatted-text-mask-input">
                    Ingrese el Número de tarjeta
                  </InputLabel>
                  <OutlinedInput
                    label="Ingrese el Número de tarjeta"
                    {...field}
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
                    inputComponent={TarjetaMask as any}
                  />
                  <small>Ingrese los primero 4 y últimos 4 dígitos</small>
                </FormControl>
              )}
            />
          </>
        )}
      </Stack>
    </>
  )
}

export default MetodosPago
