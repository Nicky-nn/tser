import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import { replace } from 'lodash';
import React, { FunctionComponent, useEffect } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

import { TarjetaMask } from '../../../../base/components/Mask/TarjetaMask';
import { FacturaInputProps } from '../../interfaces/factura';

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>;
}

type Props = OwnProps;
const MetodosPago: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      watch,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props;
  const codigoMetodoPagoValue = watch('codigoMetodoPago');

  useEffect(() => {
    const metodoPago = parseInt(codigoMetodoPagoValue.toString());
    if (metodoPago === 1) {
      setValue('numeroTarjeta', '');
    }
  }, [codigoMetodoPagoValue]);

  return (
    <>
      <Stack spacing={2} pt={2}>
        <Controller
          name={'codigoMetodoPago'}
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Método de págo</FormLabel>
              <RadioGroup
                {...field}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={field.value}
                onChange={field.onChange}
              >
                <FormControlLabel value="1" control={<Radio />} label="Efectivo" />
                <FormControlLabel value="2" control={<Radio />} label="Tarjeta" />
              </RadioGroup>
            </FormControl>
          )}
        />
        {parseInt(getValues('codigoMetodoPago').toString()) === 2 && (
          <>
            <Controller
              name={'numeroTarjeta'}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size={'small'}>
                  <InputLabel htmlFor="formatted-text-mask-input">
                    Ingrese el Número de tarjeta
                  </InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Ingrese el Número de tarjeta"
                    value={field.value || ''}
                    onChange={(event) => {
                      const numeroTarjeta = replace(
                        event.target.value,
                        new RegExp('-', 'g'),
                        '',
                      )
                        .replace(/_/g, '')
                        .trim();
                      field.onChange(numeroTarjeta);
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
  );
};

export default MetodosPago;
