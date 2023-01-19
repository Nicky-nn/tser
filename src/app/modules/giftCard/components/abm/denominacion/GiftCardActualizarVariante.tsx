import { DeleteForever, Edit } from '@mui/icons-material'
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
} from '@mui/material'
import InputNumber from 'rc-input-number'
import React, { FunctionComponent, useState } from 'react'
import {
  Controller,
  FieldArrayWithId,
  UseFieldArrayReturn,
  UseFormReturn,
  useWatch,
} from 'react-hook-form'

import { FormTextField } from '../../../../../base/components/Form'
import { MyInputLabel } from '../../../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../../../base/components/MyInputs/NumberInput'
import { handleSelect } from '../../../../../utils/helper'
import { GiftCardInputProps } from '../../../interfaces/giftCard.interface'
import { InputCodigoMask } from '../../../../../base/components/MyInputs/InputCodigoMask'
import GiftCardVarianteDialog from './GiftCardVarianteDialog'
import { notDanger } from '../../../../../utils/notification'

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>
  variantes: UseFieldArrayReturn<GiftCardInputProps, 'variantes', 'id'>
  field: FieldArrayWithId<GiftCardInputProps, 'variantes', 'id'>
  index: number
}

type Props = OwnProps

const GiftCarActualizarVariante: FunctionComponent<Props> = (props) => {
  const { form, variantes, field, index } = props
  const {
    control,
    formState: { errors },
  } = form

  const variante = useWatch({
    control,
    name: 'variantes',
  })[index]

  const [openVariante, setOpenVariante] = useState(false)

  return (
    <>
      <Grid container sx={{ mt: 2 }} columnSpacing={1} rowSpacing={2}>
        <Grid item lg={3} md={3} xs={12}>
          <Controller
            control={control}
            name={`variantes.${index}.codigoProducto`}
            render={({ field }) => (
              <FormControl
                variant={'outlined'}
                size={'small'}
                error={Boolean(errors.variantes?.[index]?.codigoProducto)}
                disabled={true}
              >
                <InputLabel>Código Tarjeta Regalo</InputLabel>
                <OutlinedInput
                  label={'Código Tarjeta Regalo'}
                  value={field.value}
                  onChange={field.onChange}
                  name={`variantes.${index}.codigoProducto`}
                  inputComponent={InputCodigoMask as any}
                />
                <FormHelperText>
                  {errors.variantes?.[index]?.codigoProducto?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item lg={4} md={5} xs={12}>
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
        <Grid item lg={2} md={2} xs={2}>
          <IconButton
            aria-label="edit"
            size="large"
            color={'primary'}
            onClick={() => {
              if (variante.codigoProducto.trim().length > 0) {
                setOpenVariante(true)
              } else {
                notDanger('Debe registrar un código de tarjeta de regalo')
              }
            }}
            sx={{ p: 0.5 }}
          >
            <Edit fontSize="inherit" />
          </IconButton>

          <IconButton
            aria-label="delete"
            size="large"
            color={'error'}
            onClick={() => variantes.remove(index)}
            disabled={index === 0}
            sx={{ p: 0.5 }}
          >
            <DeleteForever fontSize="inherit" />
          </IconButton>
        </Grid>
      </Grid>

      <GiftCardVarianteDialog
        id={index.toString()}
        open={openVariante}
        form={form}
        variantes={variantes}
        index={index}
        onClose={() => setOpenVariante(false)}
        keepMounted={false}
      />
    </>
  )
}

export default GiftCarActualizarVariante
