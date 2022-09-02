import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { FunctionComponent } from 'react';

import { ProveedorInputProp } from '../../proveedor/interfaces/proveedor.interface';
import CuentaRestriccionTable from './CuentaRestriccionTable';

interface OwnProps {
  id: string;
  keepMounted: boolean;
  open: boolean;
  onClose: (value?: ProveedorInputProp) => void;
}

type Props = OwnProps;

const CuentaRestriccionDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props;
  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 500 } }}
        maxWidth="lg"
        open={open}
        {...other}
      >
        <DialogTitle>Cambiar Sucursal / Punto Venta</DialogTitle>
        <DialogContent dividers>
          <CuentaRestriccionTable />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            size={'small'}
            variant={'contained'}
            onClick={handleCancel}
            sx={{ mr: 2 }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CuentaRestriccionDialog;
