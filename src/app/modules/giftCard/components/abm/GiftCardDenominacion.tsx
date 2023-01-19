import { Button, Grid } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import {
  GIFT_CARD_VARIANTE_INITIAL_VALUES,
  GiftCardInputProps,
} from '../../interfaces/giftCard.interface'
import GiftCardVariante from './denominacion/GiftCardVariante'
import { genRandomString } from '../../../../utils/helper'

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>
}

type Props = OwnProps

const GiftCardDenominacion: FunctionComponent<Props> = (props) => {
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
          <GiftCardVariante
            key={field.id}
            form={form}
            field={field}
            variantes={variantesField}
            index={index}
          />
        ))}
      </Grid>

      <Grid container item sx={{ mt: 2, mr: 20 }}>
        <Button
          variant={'outlined'}
          size={'small'}
          onClick={() => {
            variantesField.append({
              ...GIFT_CARD_VARIANTE_INITIAL_VALUES,
              inventario: varianteWatch.inventario,
              id: genRandomString(),
            })
          }}
        >
          Agregar Denominación
        </Button>
      </Grid>
    </>
  )
}

export default GiftCardDenominacion
