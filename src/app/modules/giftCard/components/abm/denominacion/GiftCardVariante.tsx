import { DeleteForever } from '@mui/icons-material'
import { FormControl, FormHelperText, Grid, IconButton } from '@mui/material'
import InputNumber from 'rc-input-number'
import React, { FunctionComponent } from 'react'
import { Controller, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form'

import { FormTextField } from '../../../../../base/components/Form'
import { MyInputLabel } from '../../../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../../../base/components/MyInputs/NumberInput'
import { handleSelect } from '../../../../../utils/helper'
import { GiftCardInputProps } from '../../../interfaces/giftCard.interface'

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>
  itemField: any
  varianteField: UseFieldArrayReturn<GiftCardInputProps, 'variantes', 'id'>
  index: number
}

type Props = OwnProps

const GiftCarVariante: FunctionComponent<Props> = (props) => {
  const { form, itemField, varianteField, index } = props
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = form

  const eliminarVariante = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    varianteField.remove(index)
  }

  return (
    <Grid container sx={{ mt: 2 }} columnSpacing={1} rowSpacing={2}>
      <Grid item lg={3} md={3} xs={12}>
        <Controller
          control={control}
          name={`variantes.${index}.codigoProducto`}
          render={({ field }) => (
            <FormTextField
              name={`variantes.${index}.codigoProducto`}
              label="Código Producto"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={Boolean(errors.variantes?.[index]?.codigoProducto)}
              helperText={errors.variantes?.[index]?.codigoProducto?.message}
            />
          )}
        />
      </Grid>

      <Grid item lg={5} md={5} xs={12}>
        <Controller
          control={control}
          name={`variantes.${index}.titulo`}
          render={({ field }) => (
            <FormTextField
              name={`variantes.${index}.titulo`}
              label="Titulo / Nombre"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={Boolean(errors.variantes?.[index]?.titulo)}
              helperText={errors.variantes?.[index]?.titulo?.message}
            />
          )}
        />
      </Grid>

      <Grid item lg={3} md={4} xs={10}>
        <Controller
          control={control}
          name={`variantes.${index}.precio`}
          render={({ field }) => (
            <FormControl fullWidth error={Boolean(errors.variantes?.[index]?.precio)}>
              <MyInputLabel shrink>Denominación</MyInputLabel>
              <InputNumber
                {...field}
                min={0}
                placeholder={'0.00'}
                name={`variantes.${index}.precio`}
                value={field.value}
                onFocus={handleSelect}
                onChange={field.onChange}
                onBlur={field.onBlur}
                formatter={numberWithCommas}
              />
              <FormHelperText>
                {errors.variantes?.[index]?.precio?.message || ''}
              </FormHelperText>
            </FormControl>
          )}
        />
      </Grid>
      <Grid item lg={1} md={1} xs={1}>
        <IconButton
          aria-label="delete"
          size="small"
          color={'error'}
          onClick={(event) => eliminarVariante(event)}
        >
          <DeleteForever fontSize="large" sx={{ mt: '-4px' }} />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default GiftCarVariante
