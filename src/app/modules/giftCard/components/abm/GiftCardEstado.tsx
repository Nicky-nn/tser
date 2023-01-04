import { FormControl, Grid } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'
import {
  GIFT_CARD_ESTADO_VALUES,
  GiftCardEstadoProps,
  GiftCardInputProps,
} from '../../interfaces/giftCard.interface'
import { reactSelectStyles } from '../../../../base/components/MySelect/ReactSelect'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>
}

type Props = OwnProps

const GiftCardEstado: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      formState: { errors },
    },
  } = props

  return (
    <Grid container spacing={1}>
      <Grid item lg={12} md={12} xs={12}>
        <Controller
          control={control}
          name={'estado'}
          render={({ field }) => (
            <FormControl fullWidth>
              <MyInputLabel shrink>Estado</MyInputLabel>
              <Select<GiftCardEstadoProps>
                {...field}
                styles={reactSelectStyles}
                menuPosition={'fixed'}
                name="estado"
                placeholder={'Seleccione...'}
                value={field.value}
                onChange={field.onChange}
                options={GIFT_CARD_ESTADO_VALUES}
                isClearable={true}
                getOptionValue={(ps) => ps.key.toString()}
                getOptionLabel={(item) => `${item.value}`}
              />
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  )
}

export default GiftCardEstado
