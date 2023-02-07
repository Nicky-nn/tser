import { FormControl, FormHelperText, Grid } from '@mui/material'
import React, { FunctionComponent, useEffect } from 'react'
import Select from 'react-select'

import AlertError from '../../../../base/components/Alert/AlertError'
import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import useQueryTipoDocumentoIdentidad from '../../../sin/hooks/useQueryTipoDocumento'
import { SinTipoDocumentoIdentidadProps } from '../../../sin/interfaces/sin.interface'
import { ClienteInputProps } from '../../interfaces/cliente'
import { Controller, UseFormReturn } from 'react-hook-form'
import { FormTextField } from '../../../../base/components/Form'
import { isEmptyValue } from '../../../../utils/helper'
import { actionForm } from '../../../../interfaces'

interface OwnProps {
  form: UseFormReturn<ClienteInputProps>
}

type Props = OwnProps

const ClienteForm: FunctionComponent<Props> = (props) => {
  const { form } = props
  const {
    watch,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = form

  const { tiposDocumentoIdentidad, tdiLoading, tdiIsError, tdiError, tdIsSuccess } =
    useQueryTipoDocumentoIdentidad()

  if (tdiIsError) {
    return <AlertError mensaje={tdiError?.message!} />
  }

  useEffect(() => {
    if (tdIsSuccess) {
      if (isEmptyValue(getValues('sinTipoDocumento.codigoClasificador')))
        setValue('sinTipoDocumento', tiposDocumentoIdentidad![0])
    }
  }, [tdIsSuccess])

  return (
    <form>
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
          {tdiLoading ? (
            <AlertLoading />
          ) : (
            <Controller
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.sinTipoDocumento)} required>
                  <MyInputLabel shrink>Tipo Documento Identidad</MyInputLabel>
                  <Select<SinTipoDocumentoIdentidadProps>
                    menuPosition={'fixed'}
                    styles={reactSelectStyle(Boolean(errors.sinTipoDocumento))}
                    name={'sinTipoDocumento'}
                    placeholder={'Seleccione el tipo documento identidad'}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    isSearchable={false}
                    options={tiposDocumentoIdentidad}
                    getOptionValue={(item) => item.codigoClasificador.toString()}
                    getOptionLabel={(item) => `${item.descripcion}`}
                    required
                    isDisabled={getValues('action') === actionForm.UPDATE}
                  />
                  <FormHelperText>{errors.sinTipoDocumento?.message}</FormHelperText>
                </FormControl>
              )}
              name={'sinTipoDocumento'}
              control={control}
            />
          )}
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

        <Grid item lg={7} md={7} xs={12}>
          <Controller
            control={control}
            name={'numeroDocumento'}
            render={({ field }) => (
              <FormTextField
                name={'numeroDocumento'}
                label="Número Documento"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={Boolean(errors.numeroDocumento)}
                helperText={errors.numeroDocumento?.message}
                required
              />
            )}
          />
        </Grid>

        <Grid item lg={5} md={5} xs={12}>
          <Controller
            control={control}
            name={'complemento'}
            render={({ field }) => (
              <FormTextField
                name={'complemento'}
                label="Complemento"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={Boolean(errors.complemento)}
                helperText={errors.complemento?.message}
              />
            )}
          />
        </Grid>

        <Grid item lg={7} md={7} xs={12}>
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

        <Grid item lg={5} md={5} xs={12}>
          <Controller
            control={control}
            name={'telefono'}
            render={({ field }) => (
              <FormTextField
                name={'telefono'}
                label="Teléfonos"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={Boolean(errors.telefono)}
                helperText={errors.telefono?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  )
}

export default ClienteForm
