import { Button, Grid } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form'

import { genRandomString } from '../../../../utils/helper'
import {
  GIFT_CARD_VARIANTE_INITIAL_VALUES,
  GiftCardInputProps,
} from '../../interfaces/giftCard.interface'
import GiftCardVariante from './denominacion/GiftCardVariante'
import { FormTextField } from '../../../../base/components/Form'

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>
}

type Props = OwnProps

const GiftCardDenominacion: FunctionComponent<Props> = (props) => {
  const { form } = props
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = form

  const [variantesWatch] = watch(['variantes'])
  const variantesField = useFieldArray({
    control,
    name: 'variantes',
  })
  const agregarDenominacion = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    variantesField.append({
      ...GIFT_CARD_VARIANTE_INITIAL_VALUES,
      id: genRandomString(10),
    })
  }

  return (
    <>
      <Grid container item sx={{ mb: 2 }}>
        <Grid item lg={3} md={3} xs={12}>
          <FormTextField
            name={`codigos`}
            label="Generar Código"
            value={''}
            onChange={() => console.log}
          />
        </Grid>
      </Grid>
      <hr />

      <Grid container item rowSpacing={2}>
        {variantesField.fields.map((item, index) => (
          <GiftCardVariante
            key={item.id}
            form={form}
            itemField={item}
            varianteField={variantesField}
            index={index}
          />
        ))}
      </Grid>

      <Grid container item sx={{ mt: 2, mr: 20 }}>
        <Button
          variant={'outlined'}
          size={'small'}
          onClick={(event) => agregarDenominacion(event)}
        >
          Agregar Denominación
        </Button>
      </Grid>
    </>
  )
}

export default GiftCardDenominacion
