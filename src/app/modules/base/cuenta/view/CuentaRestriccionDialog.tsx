import CloseIcon from '@mui/icons-material/Close'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import React, { FunctionComponent } from 'react'

import CuentaRestriccionTable from './CuentaRestriccionTable'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: boolean) => void
}

type Props = OwnProps

const CuentaRestriccionDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 'md' } }}
        maxWidth="md"
        open={open}
        onClose={() => onClose()} // Maneja el cierre por Escape
        {...other}
      >
        <DialogTitle>
          Cambiar Sucursal / Punto Venta
          <IconButton
            aria-label="close"
            onClick={() => onClose()} // Maneja el cierre por clic en la "X"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <CuentaRestriccionTable />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CuentaRestriccionDialog
