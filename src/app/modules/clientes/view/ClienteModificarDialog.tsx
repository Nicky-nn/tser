import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useFormik } from 'formik';
import React, { FunctionComponent, useEffect } from 'react';

import { notSuccess } from '../../../utils/notification';
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal';
import { apiClienteUpdate } from '../api/clienteUpdate.api';
import { ClienteInputProps, clienteInputUpdateDefault, ClienteProps } from '../interfaces/cliente';
import { clienteInputValidator } from '../validator/clienteInputValidator';
import ClienteForm from './ClienteForm';

interface OwnProps {
  id: string;
  keepMounted: boolean;
  open: boolean;
  cliente: ClienteProps;
  onClose: (value?: ClienteProps) => void;
}

type Props = OwnProps;

const ClienteModificarDialog: FunctionComponent<Props> = (props) => {
  const { onClose, cliente, open, ...other } = props;

  const clienteForm = useFormik<ClienteInputProps>({
    initialValues: clienteInputUpdateDefault(cliente),
    validationSchema: clienteInputValidator,
    onSubmit: async (values) => {
      await swalAsyncConfirmDialog({
        preConfirm: () => {
          return apiClienteUpdate(cliente._id, {
            ...values,
            codigoTipoDocumentoIdentidad: parseInt(values.codigoTipoDocumentoIdentidad.toString()),
          }).catch((err) => {
            swalException(err);
            return false;
          });
        },
        text: 'Confirma que desea actualizar los datos del cliente',
      }).then((resp) => {
        if (resp.isConfirmed) {
          notSuccess();
          onClose(resp.value);
        }
      });
    },
  });

  useEffect(() => {
    if (open) {
      // clienteForm.resetForm()
    }
  }, [open]);

  return (
    <>
      <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} maxWidth="sm" open={open} {...other}>
        <DialogTitle>Modificar cliente {cliente.razonSocial}</DialogTitle>
        <DialogContent dividers>
          <ClienteForm formik={clienteForm} />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            variant={'contained'}
            size={'small'}
            onClick={() => {
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button onClick={clienteForm.submitForm} style={{ marginRight: 15 }} size={'small'} variant={'contained'}>
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClienteModificarDialog;
