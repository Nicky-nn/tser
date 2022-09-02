import { PersonAddAlt1Outlined, TableChart } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import React, { FC, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';

import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel';
import { reactSelectStyles } from '../../../../base/components/MySelect/ReactSelect';
import { PerfilProps } from '../../../../base/models/loginModel';
import { genReplaceEmpty } from '../../../../utils/helper';
import { swalException } from '../../../../utils/swal';
import { apiClienteBusqueda } from '../../../clientes/api/clienteBusqueda.api';
import ClienteExplorarDialog from '../../../clientes/components/ClienteExplorarDialog';
import { ClienteProps } from '../../../clientes/interfaces/cliente';
import ClienteRegistroDialog from '../../../clientes/view/ClienteRegistroDialog';
import { FacturaInputProps } from '../../interfaces/factura';

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>;
  user: PerfilProps;
}

type Props = OwnProps;

export const DatosTransaccionComercial: FC<Props> = (props) => {
  const {
    form: {
      control,
      watch,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props;
  const [openNuevoCliente, setNuevoCliente] = useState(false);
  const [openExplorarCliente, setExplorarCliente] = useState(false);
  const watchAllFields = watch();

  const fetchClientes = async (inputValue: string): Promise<any[]> => {
    try {
      if (inputValue.length > 2) {
        const clientes = await apiClienteBusqueda(inputValue);
        if (clientes) return clientes;
      }
      return [];
    } catch (e: any) {
      swalException(e);
      return [];
    }
  };

  return (
    <>
      <Grid container spacing={1} rowSpacing={3}>
        <Grid item xs={12} lg={8} sm={12} md={12}>
          <Controller
            name="cliente"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.cliente)}>
                <MyInputLabel shrink>Busqueda de clientes</MyInputLabel>
                <AsyncSelect<ClienteProps>
                  {...field}
                  cacheOptions={false}
                  defaultOptions={true}
                  styles={reactSelectStyles}
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
                    field.onChange(cliente);
                    setValue('emailCliente', genReplaceEmpty(cliente?.email, ''));
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

        <Grid item lg={4} xs={12} md={3}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setExplorarCliente(true)}
            startIcon={<TableChart />}
          >
            Explorar Clientes
          </Button>
        </Grid>

        <Grid item lg={8} xs={12} md={12}>
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

        <Grid item lg={4} xs={12} md={3}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setNuevoCliente(true)}
            startIcon={<PersonAddAlt1Outlined />}
          >
            Nuevo Cliente
          </Button>
        </Grid>
        <Grid item lg={12}>
          <List style={{ marginTop: -10, marginLeft: 10, padding: 0 }}>
            <ListItem style={{ padding: 0 }}>
              <ListItemText>
                <strong>Nombre/Razón Social:</strong>&nbsp;&nbsp;{' '}
                {watchAllFields.cliente?.razonSocial || ''}
              </ListItemText>
            </ListItem>
            <ListItem style={{ padding: 0 }}>
              <ListItemText>
                <strong>NIT/CI/CEX:</strong>&nbsp;&nbsp;{' '}
                {watchAllFields.cliente?.numeroDocumento || ''}{' '}
                {watchAllFields.cliente?.complemento || ''}
              </ListItemText>
            </ListItem>
            <ListItem style={{ padding: 0 }}>
              <ListItemText>
                <strong>Correo:</strong>&nbsp;&nbsp; {watchAllFields.emailCliente || ''}
              </ListItemText>
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <>
        <ClienteRegistroDialog
          id={'nuevoClienteDialog'}
          keepMounted={false}
          open={openNuevoCliente}
          onClose={async (value?: ClienteProps) => {
            if (value) {
              setValue('cliente', value);
              setValue('emailCliente', value.email);
              await fetchClientes(value.codigoCliente);
              setNuevoCliente(false);
            } else {
              setNuevoCliente(false);
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
              setValue('cliente', value);
              setValue('emailCliente', value.email);
              await fetchClientes(value.codigoCliente);
              setExplorarCliente(false);
            } else {
              setExplorarCliente(false);
            }
          }}
        />
      </>
    </>
  );
};
