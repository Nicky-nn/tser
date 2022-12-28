import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { FunctionComponent, useEffect, useState } from 'react'

import { ClienteProps } from '../interfaces/cliente'
import ClientesListadoDialog from './ClientesListadoDialog'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: ClienteProps) => void
}

type Props = OwnProps

const ClienteExplorarDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props
  const [rowCliente, setRowCliente] = useState<ClienteProps | null>(null)

  useEffect(() => {
    if (rowCliente) {
      onClose(rowCliente)
    }
  }, [rowCliente])

  useEffect(() => {
    if (open) setRowCliente(null)
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 750 } }}
        maxWidth="xl"
        open={open}
        {...other}
      >
        <DialogTitle>Explorar Clientes</DialogTitle>
        <DialogContent dividers>
          <ClientesListadoDialog setRowCliente={setRowCliente} />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            size={'small'}
            variant={'contained'}
            onClick={() => onClose()}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ClienteExplorarDialog
