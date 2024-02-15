import { FormControl, FormHelperText, useTheme } from '@mui/material'
import React, { FunctionComponent, useEffect } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'

import AlertError from '../../../../base/components/Alert/AlertError'
import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../../base/hooks/useAuth'
import { genReplaceEmpty, isEmptyValue } from '../../../../utils/helper'
import useQueryActividadesPorDocumentoSector from '../../../sin/hooks/useQueryActividadesPorDocumentoSector'
import { SinActividadesPorDocumentoSector } from '../../../sin/interfaces/sin.interface'
import { FacturaInputProps } from '../../interfaces/factura'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
}

type Props = OwnProps

const DatosActividadEconomica: FunctionComponent<Props> = (props) => {
  const { user } = useAuth()
  const {
    form: {
      control,
      setValue,
      reset,
      getValues,
      formState: { errors, isSubmitted, isSubmitSuccessful },
    },
  } = props
  const { actividades, actIsError, actError, actLoading } =
    useQueryActividadesPorDocumentoSector()

  useEffect(() => {
    if (!actLoading && genReplaceEmpty(actividades, []).length > 0) {
      if (isEmptyValue(getValues('actividadEconomica'))) {
        const tempActividades = actividades!.find(
          (a) => a.codigoActividad === user.actividadEconomica.codigoCaeb,
        )
        if (tempActividades) {
          setValue('actividadEconomica', tempActividades)
        } else {
          setValue('actividadEconomica', actividades![0])
        }
      }
    }
    // setValue('actividadEconomica', user.actividadEconomica)
  }, [actLoading])

  if (actIsError) {
    return <AlertError mensaje={actError?.message!} />
  }

  const t = useTheme()

  return (
    <>
      <SimpleCard>
        {actLoading ? (
          <AlertLoading />
        ) : (
          <Controller
            name="actividadEconomica"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.actividadEconomica)}>
                <MyInputLabel shrink>Actividad Económica</MyInputLabel>
                <Select<SinActividadesPorDocumentoSector>
                  {...field}
                  styles={reactSelectStyle(Boolean(errors.actividadEconomica))}
                  name="actividadEconomica"
                  placeholder={'Seleccione la actividad económica'}
                  value={field.value}
                  onChange={async (val: any) => {
                    field.onChange(val)
                  }}
                  onBlur={async (val) => {
                    field.onBlur()
                  }}
                  isSearchable={false}
                  options={actividades}
                  getOptionValue={(item) => item.codigoActividad}
                  getOptionLabel={(item) =>
                    `${item.tipoActividad} - ${item.codigoActividad} - ${item.actividadEconomica}`
                  }
                />
                {errors.actividadEconomica && (
                  <FormHelperText>{errors.actividadEconomica?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}
      </SimpleCard>
    </>
  )
}

export default DatosActividadEconomica
