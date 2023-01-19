import { Grid } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { GiftCardInputProps } from '../../interfaces/giftCard.interface'
import GiftCardActualizarVariante from './denominacion/GiftCardActualizarVariante'

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>
}

type Props = OwnProps

const GiftCardActualizarDenominacion: FunctionComponent<Props> = (props) => {
  const { form } = props
  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = form

  const [varianteWatch] = watch(['variante'])

  const variantesField = useFieldArray({
    control,
    name: 'variantes',
  })

  return (
    <>
      <Grid container item rowSpacing={2}>
        {variantesField.fields.map((field, index) => (
          <GiftCardActualizarVariante
            key={field.id}
            form={form}
            field={field}
            variantes={variantesField}
            index={index}
          />
        ))}
      </Grid>
    </>
  )
}

export default GiftCardActualizarDenominacion
