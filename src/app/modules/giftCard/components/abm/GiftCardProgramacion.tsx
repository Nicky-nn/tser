import { Button, FormControl, Grid } from '@mui/material'
import React, { forwardRef, FunctionComponent } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { GiftCardInputProps } from '../../interfaces/giftCard.interface'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>
}

type Props = OwnProps

const GiftCardProgramacion: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      formState: { errors },
    },
  } = props

  const ExampleCustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <Button onClick={onClick} ref={ref}>
      {value}
    </Button>
  ))

  return (
    <Grid container spacing={1}>
      <Grid item lg={12} md={12} xs={12}>
        <Controller
          control={control}
          name={'fechaInicio'}
          render={({ field }) => (
            <FormControl fullWidth>
              <DatePicker
                name={'fechaInicio'}
                selected={field.value}
                onChange={field.onChange}
                locale={'es'}
                startDate={field.value}
                showTimeSelect
                dateFormat="dd/MM/yyyy h:mm aa"
                customInput={<ExampleCustomInput />}
                isClearable={false}
              />
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  )
}

export default GiftCardProgramacion
