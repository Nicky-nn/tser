import { FormControl, FormHelperText, Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { FunctionComponent, useEffect } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'

import AlertError from '../../../../base/components/Alert/AlertError'
import { FormTextField } from '../../../../base/components/Form'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import {
  reactSelectStyle,
  reactSelectStyles,
} from '../../../../base/components/MySelect/ReactSelect'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../../base/hooks/useAuth'
import { fetchSinProductoServicioPorActividad } from '../../../sin/api/sinProductoServicio.api'
import useQueryActividades from '../../../sin/hooks/useQueryActividades'
import {
  SinActividadesProps,
  SinProductoServicioProps,
} from '../../../sin/interfaces/sin.interface'
import { GiftCardInputProps } from '../../interfaces/giftCard.interface'

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>
}

type Props = OwnProps

const GiftCardHomologacion: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      getValues,
      watch,
      formState: { errors },
    },
  } = props
  const actividadEconomicaWatch = watch('actividad')

  // const {values, setFieldValue} = formik
  const { user } = useAuth()

  // CARGA DATOS DE ACTIVIDADES
  const { actividades, actIsError, actError, actLoading } = useQueryActividades()

  // CARGA DE DATOS DE PRODUCTOS SERVICIOS
  const { data: productosServicios, error: prodServError } = useQuery<
    SinProductoServicioProps[],
    Error
  >(
    ['productosServicios', actividadEconomicaWatch],
    async () => {
      return await fetchSinProductoServicioPorActividad(getValues('actividad.codigoCaeb'))
    },
    {
      keepPreviousData: false,
    },
  )

  useEffect(() => {
    setValue('actividad', user.actividadEconomica)
  }, [])

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} xs={12}>
          {actError ? (
            <AlertError mensaje={actError.message} />
          ) : (
            <Controller
              name="actividad"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <MyInputLabel shrink>Actividad Económica</MyInputLabel>
                  <Select<SinActividadesProps>
                    {...field}
                    styles={reactSelectStyles}
                    name="actividadEconomica"
                    placeholder={'Seleccione la actividad económica'}
                    menuPosition={'fixed'}
                    value={field.value}
                    onChange={async (actividadEconomica: any) => {
                      field.onChange(actividadEconomica)
                      setValue('sinProductoServicio', null)
                    }}
                    onBlur={async (val) => {
                      field.onBlur()
                    }}
                    isSearchable={false}
                    options={actividades}
                    getOptionValue={(item) => item.codigoCaeb}
                    getOptionLabel={(item) =>
                      `${item.tipoActividad} - ${item.codigoCaeb} - ${item.descripcion}`
                    }
                  />
                </FormControl>
              )}
            />
          )}
        </Grid>

        <Grid item lg={12} md={12} xs={12}>
          {prodServError ? (
            <AlertError mensaje={prodServError.message} />
          ) : (
            <Controller
              name={'sinProductoServicio'}
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  component={'div'}
                  error={Boolean(errors.sinProductoServicio)}
                >
                  <MyInputLabel shrink>Producto Homologado</MyInputLabel>
                  <Select<SinProductoServicioProps>
                    {...field}
                    styles={reactSelectStyle(Boolean(errors.sinProductoServicio))}
                    classNames={{
                      control: (state) =>
                        state.isFocused ? 'border-red-600' : 'border-grey-300',
                    }}
                    menuPosition={'fixed'}
                    name="sinProductoServicio"
                    placeholder={'Seleccione producto para homolgación'}
                    value={field.value || null}
                    onChange={(sinProductoServicio) => {
                      field.onChange(sinProductoServicio)
                    }}
                    options={productosServicios}
                    getOptionValue={(ps) => ps.codigoProducto}
                    getOptionLabel={(ps) =>
                      `${ps.codigoProducto} - ${ps.descripcionProducto}`
                    }
                  />
                  <FormHelperText>{errors.sinProductoServicio?.message}</FormHelperText>
                </FormControl>
              )}
            />
          )}
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <Controller
            control={control}
            name={'titulo'}
            render={({ field }) => (
              <FormTextField
                name="titulo"
                label="Nombre Producto"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={Boolean(errors.titulo)}
                helperText={errors.titulo?.message}
              />
            )}
          />
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <Controller
            name={'descripcion'}
            control={control}
            render={({ field }) => (
              <FormTextField
                name="descripcion"
                label="Descripcion"
                multiline
                minRows={3}
                maxRows={5}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default GiftCardHomologacion
