/* eslint-disable no-unused-vars */
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { ClearIcon } from '@mui/x-date-pickers'
import { FunctionComponent, useEffect } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select, { SingleValue } from 'react-select'
import AsyncSelect from 'react-select/async'

import AlertError from '../../../../base/components/Alert/AlertError'
import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { FormTextField } from '../../../../base/components/Form'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { isEmptyValue } from '../../../../utils/helper'
import { swalException } from '../../../../utils/swal'
import useQueryTipoDocumentoIdentidad from '../../../sin/hooks/useQueryTipoDocumento'
import { SinTipoDocumentoIdentidadProps } from '../../../sin/interfaces/sin.interface'
import { apiClienteBusqueda } from '../../api/clienteBusqueda.api'
import { ClienteInputProps, ClienteProps } from '../../interfaces/cliente'

interface OwnProps {
  form: UseFormReturn<ClienteInputProps>
  reactSelectStyle: any
  genReplaceEmpty: (value: any, replaceValue: any) => any
}

type Props = OwnProps

const ClienteFormCRUD: FunctionComponent<Props> = (props) => {
  const { form, reactSelectStyle, genReplaceEmpty } = props
  const {
    watch,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = form

  const { tiposDocumentoIdentidad, tdiLoading, tdiIsError, tdiError, tdIsSuccess } =
    useQueryTipoDocumentoIdentidad()

  const fetchClientes = async (inputValue: string): Promise<ClienteProps[]> => {
    try {
      if (inputValue.length > 2) {
        const clientes = await apiClienteBusqueda(inputValue)
        if (clientes) return clientes
      }
      return []
    } catch (e: any) {
      swalException(e)
      return []
    }
  }

  if (tdiIsError) {
    return <AlertError mensaje={tdiError?.message!} />
  }

  useEffect(() => {
    if (tdIsSuccess) {
      if (isEmptyValue(getValues('sinTipoDocumento.codigoClasificador')))
        setValue('sinTipoDocumento', tiposDocumentoIdentidad![0])
    }
  }, [tdIsSuccess])

  useEffect(() => {
    const setClientePorDefecto = async () => {
      const clientePorDefecto = {
        codigoCliente: '00',
        apellidos: 'Sin Apellidos',
        complemento: null,
        numeroDocumento: '00',
        razonSocial: 'Sin Razón Social',
        state: 'ELABORADO',
        nombres: 'Sin Nombre',
        email: 'sinCorreo@gmail.com',
        tipoDocumentoIdentidad: {
          codigoClasificador: 1,
          descripcion: 'CI - CEDULA DE IDENTIDAD',
        },
      }
      if (clientePorDefecto) {
        setValue('codigoCliente', genReplaceEmpty(clientePorDefecto.codigoCliente, ''))
        setValue('email', genReplaceEmpty(clientePorDefecto.email, ''))
        setValue(
          'numeroDocumento',
          genReplaceEmpty(clientePorDefecto.numeroDocumento, ''),
        )
        setValue('complemento', genReplaceEmpty(clientePorDefecto.complemento, ''))
        setValue('sinTipoDocumento', clientePorDefecto.tipoDocumentoIdentidad)
        setValue('razonSocial', clientePorDefecto.razonSocial)
      }
    }

    setClientePorDefecto()
  }, [])

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
                    isDisabled={!!watch('razonSocial')}
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
            // MOtivo: NO tenemos un tipo para el campo busquedaCliente
            name={'busquedaCliente'}
            render={({ field }) => (
              <AsyncSelect<any>
                {...field}
                styles={reactSelectStyle(Boolean(errors.busquedaCliente))}
                cacheOptions={false}
                defaultOptions={true}
                menuPosition={'fixed'}
                name="busquedaCliente"
                placeholder={'Buscar Cliente'}
                loadOptions={fetchClientes}
                isClearable={true}
                value={field.value || null}
                getOptionValue={(item) => item.codigoCliente}
                getOptionLabel={(item) =>
                  `${item.numeroDocumento}${item.complemento || ''} - ${item.razonSocial}`
                }
                onChange={(cliente: SingleValue<ClienteProps>) => {
                  field.onChange(cliente)
                  setValue('email', genReplaceEmpty(cliente?.email, ''))
                  setValue('telefono', genReplaceEmpty(cliente?.telefono, ''))
                  setValue(
                    'numeroDocumento',
                    genReplaceEmpty(cliente?.numeroDocumento, ''),
                  )
                  setValue('complemento', genReplaceEmpty(cliente?.complemento, ''))
                  setValue('sinTipoDocumento', cliente?.tipoDocumentoIdentidad || null)
                  setValue('razonSocial', cliente?.razonSocial || '')
                  setValue('codigoCliente', cliente?.codigoCliente || '')
                }}
                onBlur={field.onBlur}
                noOptionsMessage={() =>
                  'Ingrese al menos 3 caracteres para buscar un cliente'
                }
                loadingMessage={() => 'Buscando...'}
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
                // Final del input
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Limpiar"
                        edge="end"
                        onClick={() => {
                          setValue('razonSocial', '')
                          setValue('codigoCliente', '')
                          setValue('email', '')
                          setValue('telefono', '')
                          setValue('numeroDocumento', '')
                          setValue('complemento', '')
                          setValue('sinTipoDocumento', null)
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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

export default ClienteFormCRUD
