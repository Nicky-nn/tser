import { Alert, AlertTitle, Grid } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'

import { FormTextField } from '../../../../base/components/Form'
import { actionForm } from '../../../../interfaces'
import { Cliente99001InputProps } from '../../interfaces/cliente'

interface OwnProps {
  form: UseFormReturn<Cliente99001InputProps>
}

type Props = OwnProps

const Cliente99001Form: FunctionComponent<Props> = (props) => {
  const { form } = props
  const {
    control,
    getValues,
    formState: { errors },
  } = form

  return (
    <form>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info">
            <AlertTitle>¿Que es un cliente 99001?</AlertTitle>
            Son Consulados, embajadas, organismos internacionales, patrimonios autónomos,
            personal diplomático y personas extranjeras sin residencia, excepto en el caso
            de exportación de servicios turísticos.
          </Alert>
        </Grid>

        <Grid item lg={6} md={6} xs={12}>
          <Controller
            control={control}
            name={'codigoCliente'}
            render={({ field }) => (
              <FormTextField
                name={'codigoCliente'}
                label="Codigo Cliente"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={Boolean(errors.codigoCliente)}
                helperText={
                  errors.codigoCliente?.message || 'Código aleatorio modificable'
                }
                required
                disabled={getValues('action') === actionForm.UPDATE}
              />
            )}
          />
        </Grid>

        <Grid item lg={12} md={12} xs={12}>
          <Controller
            control={control}
            name={'razonSocial'}
            render={({ field }) => (
              <FormTextField
                name={'razonSocial'}
                label="Razón Social"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={Boolean(errors.razonSocial)}
                helperText={errors.razonSocial?.message}
                required
              />
            )}
          />
        </Grid>

        <Grid item lg={12} md={12} xs={12}>
          <Controller
            control={control}
            name={'email'}
            render={({ field }) => (
              <FormTextField
                name={'email'}
                label="Correo Electrónico"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                required
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  )
}

export default Cliente99001Form
