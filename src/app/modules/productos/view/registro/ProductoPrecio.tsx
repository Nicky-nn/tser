import { FormControl, FormHelperText, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import InputNumber from 'rc-input-number';
import React, { FunctionComponent } from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';

import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel';
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput';
import { reactSelectStyles } from '../../../../base/components/MySelect/ReactSelect';
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard';
import { handleSelect } from '../../../../utils/helper';
import { apiSinUnidadMedida } from '../../../sin/api/sinUnidadMedida.api';
import { SinUnidadMedidaProps } from '../../../sin/interfaces/sin.interface';
import { ProductoInputProps } from '../../interfaces/producto.interface';

interface OwnProps {
  form: UseFormReturn<ProductoInputProps>;
}

type Props = OwnProps;

const ProductoPrecio: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      watch,
      formState: { errors },
    },
  } = props;

  const [variantesWatch, varianteWatch] = watch(['variantes', 'variante']);

  const { data: unidadesMedida } = useQuery<SinUnidadMedidaProps[], Error>(
    ['unidadesMedida'],
    () => {
      return apiSinUnidadMedida();
    },
  );

  return (
    <SimpleCard title={'PRECIO'}>
      <Grid container columnSpacing={3} rowSpacing={2}>
        <Grid item lg={12} md={12} xs={12}>
          <Controller
            control={control}
            name={'variante.unidadMedida'}
            render={({ field }) => (
              <FormControl
                fullWidth
                sx={{ mb: 1 }}
                error={Boolean(errors.variante?.unidadMedida)}
              >
                <MyInputLabel shrink>Unidad Medida</MyInputLabel>
                <Select<SinUnidadMedidaProps>
                  {...field}
                  styles={reactSelectStyles}
                  menuPosition={'fixed'}
                  placeholder={'Seleccione la unidad de medida'}
                  value={field.value}
                  onChange={async (unidadMedida: SingleValue<SinUnidadMedidaProps>) => {
                    field.onChange(unidadMedida);
                    setValue(
                      'variantes',
                      variantesWatch.map((vs) => ({
                        ...vs,
                        unidadMedida,
                      })),
                    );
                  }}
                  options={unidadesMedida}
                  getOptionValue={(item) => item.codigoClasificador}
                  getOptionLabel={(item) =>
                    `${item.codigoClasificador} - ${item.descripcion}`
                  }
                />
                <FormHelperText>{errors.variante?.unidadMedida?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <Controller
            control={control}
            name={'variante.precio'}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.variante?.precio)}>
                <MyInputLabel shrink>Precio</MyInputLabel>
                <InputNumber
                  {...field}
                  min={0}
                  placeholder={'0.00'}
                  name={'variante.precio'}
                  value={field.value}
                  onFocus={handleSelect}
                  onChange={(precio: number) => {
                    field.onChange(precio);
                  }}
                  onBlur={(e) => {
                    setValue(
                      'variantes',
                      variantesWatch.map((vs) => ({
                        ...vs,
                        precio: parseFloat(e.target.value),
                      })),
                    );
                  }}
                  formatter={numberWithCommas}
                />
                <FormHelperText>{errors.variante?.precio?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item lg={4} md={4} xs={12}>
          <Controller
            control={control}
            name={'variante.precioComparacion'}
            render={({ field }) => (
              <FormControl fullWidth component={'div'}>
                <MyInputLabel shrink>Precio de comparación</MyInputLabel>
                <InputNumber
                  {...field}
                  min={0}
                  name={'variante.precioComparacion'}
                  placeholder={'0.00'}
                  value={field.value}
                  onFocus={handleSelect}
                  onChange={(precioComparacion: number) => {
                    field.onChange(precioComparacion);
                  }}
                  onBlur={(e) => {
                    setValue(
                      'variantes',
                      variantesWatch.map((vs) => ({
                        ...vs,
                        precioComparacion: parseFloat(e.target.value),
                      })),
                    );
                  }}
                  formatter={numberWithCommas}
                />
              </FormControl>
            )}
          />
        </Grid>

        <Grid item lg={4} md={4} xs={12}>
          <Controller
            control={control}
            name={'variante.costo'}
            render={({ field }) => (
              <FormControl fullWidth component={'div'}>
                <MyInputLabel shrink>Costo</MyInputLabel>
                <InputNumber
                  {...field}
                  min={0}
                  name={'variante.costo'}
                  max={varianteWatch.precio === 0 ? 0 : varianteWatch.precio - 0.01}
                  placeholder={'0.00'}
                  value={field.value}
                  onFocus={handleSelect}
                  onChange={(costo: number) => {
                    field.onChange(costo);
                  }}
                  onBlur={(e) => {
                    setValue(
                      'variantes',
                      variantesWatch.map((vs) => ({
                        ...vs,
                        costo: parseFloat(e.target.value),
                      })),
                    );
                  }}
                  formatter={numberWithCommas}
                />
                <FormHelperText>Información protegida</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </SimpleCard>
  );
};

export default ProductoPrecio;
