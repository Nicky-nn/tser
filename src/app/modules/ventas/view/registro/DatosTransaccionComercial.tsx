import { PersonAddAlt1Outlined, TableChart } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material'
import React, { FC, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { SingleValue } from 'react-select'
import AsyncSelect from 'react-select/async'

import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import { PerfilProps } from '../../../../base/models/loginModel'
import { genReplaceEmpty } from '../../../../utils/helper'
import { swalException } from '../../../../utils/swal'
import { apiClienteBusqueda } from '../../../clientes/api/clienteBusqueda.api'
import ClienteExplorarDialog from '../../../clientes/components/ClienteExplorarDialog'
import { ClienteProps } from '../../../clientes/interfaces/cliente'
import Cliente99001RegistroDialog from '../../../clientes/view/registro/Cliente99001RegistroDialog'
import ClienteRegistroDialog from '../../../clientes/view/registro/ClienteRegistroDialog'
import { FacturaInputProps } from '../../interfaces/factura'
import DatosCliente from './DatosCliente'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
  user: PerfilProps
}

type Props = OwnProps

export const DatosTransaccionComercial: FC<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props
  const [openNuevoCliente, setNuevoCliente] = useState(false)
  const [openExplorarCliente, setExplorarCliente] = useState(false)
  const [openCliente99001, setCliente99001] = useState(false)

  const fetchClientes = async (inputValue: string): Promise<any[]> => {
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

  return (
    <>
      <Grid container spacing={2} rowSpacing={3}>
        <Grid item xs={12} sm={7} lg={7} xl={8}>
          <Controller
            name="cliente"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.cliente)}>
                <MyInputLabel shrink>Búsqueda de clientes</MyInputLabel>
                <AsyncSelect<ClienteProps>
                  {...field}
                  cacheOptions={false}
                  defaultOptions={true}
                  styles={reactSelectStyle(Boolean(errors.cliente))}
                  menuPosition={'fixed'}
                  name="clientes"
                  placeholder={'Seleccione Cliente'}
                  loadOptions={fetchClientes}
                  isClearable={true}
                  value={field.value || null}
                  getOptionValue={(item) => item.codigoCliente}
                  getOptionLabel={(item) =>
                    `${item.numeroDocumento}${item.complemento || ''} - ${
                      item.razonSocial
                    } - ${item.tipoDocumentoIdentidad.descripcion}`
                  }
                  onChange={(cliente: SingleValue<ClienteProps>) => {
                    field.onChange(cliente)
                    setValue('emailCliente', genReplaceEmpty(cliente?.email, ''))
                  }}
                  onBlur={field.onBlur}
                  noOptionsMessage={() =>
                    'Ingrese referencia -> Razon Social, Codigo Cliente, Numero documento'
                  }
                  loadingMessage={() => 'Buscando...'}
                />
                <FormHelperText>{errors.cliente?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={5} lg={5} xl={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setExplorarCliente(true)}
            startIcon={<TableChart />}
          >
            Explorar Clientes
          </Button>
        </Grid>

        <Grid item xs={12} sm={7} lg={7} xl={5}>
          <Controller
            control={control}
            name={'emailCliente'}
            render={({ field }) => (
              <TextField
                {...field}
                error={Boolean(errors.emailCliente)}
                fullWidth
                name={'emailCliente'}
                size={'small'}
                label="Correo Electrónico Alternativo"
                value={field.value || ''}
                disabled={!getValues('cliente')}
                onChange={field.onChange}
                onBlur={field.onBlur}
                helperText={errors.emailCliente?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={2} lg={5} xl={3}>
          <Button
            variant="outlined"
            fullWidth
            title={'Nuevo Cliente'}
            onClick={() => setNuevoCliente(true)}
            startIcon={<PersonAddAlt1Outlined />}
          >
            N. Cliente
          </Button>
        </Grid>
        <Grid item xs={12} md={12} sm={3} xl={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setCliente99001(true)}
            startIcon={<PersonAddAlt1Outlined />}
          >
            N. Cliente 99001
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <Controller
              name={'codigoExcepcion'}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox {...field} checked={!!getValues('codigoExcepcion')} />
                  }
                  label="Permitir facturar incluso si el NIT es inválido"
                  name={'codigoExcepcion'}
                />
              )}
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <DatosCliente form={props.form} />
        </Grid>
      </Grid>
      <>
        <ClienteRegistroDialog
          id={'nuevoClienteDialog'}
          keepMounted={false}
          open={openNuevoCliente}
          onClose={async (value?: ClienteProps) => {
            if (value) {
              setValue('cliente', value)
              setValue('emailCliente', value.email)
              await fetchClientes(value.codigoCliente)
              setNuevoCliente(false)
            } else {
              setNuevoCliente(false)
            }
          }}
        />
      </>
      <>
        <ClienteExplorarDialog
          id={'explorarClienteDialog'}
          keepMounted={false}
          open={openExplorarCliente}
          onClose={async (value?: ClienteProps) => {
            if (value) {
              setValue('cliente', value)
              setValue('emailCliente', value.email)
              await fetchClientes(value.codigoCliente)
              setExplorarCliente(false)
            } else {
              setExplorarCliente(false)
            }
          }}
        />
      </>
      <>
        <Cliente99001RegistroDialog
          id={'explorarClienteDialog99001'}
          keepMounted={false}
          open={openCliente99001}
          onClose={async (value?: ClienteProps) => {
            if (value) {
              setValue('cliente', value)
              setValue('emailCliente', value.email)
              await fetchClientes(value.codigoCliente)
              setCliente99001(false)
            } else {
              setCliente99001(false)
            }
          }}
        />
      </>
    </>
  )
}
