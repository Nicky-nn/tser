import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { isEmptyValue, validateEmail } from '../../../../utils/helper'
import { notSuccess } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiFcvReenvioEmails } from '../../api/facturaReenvioEmail.api'
import { FacturaProps } from '../../interfaces/factura'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: any) => void
  factura: FacturaProps | null
}

type Props = OwnProps

const ReenviarEmailsDialog: FunctionComponent<Props> = (props: Props) => {
  const { onClose, open, factura, ...other } = props
  const [emails, setEmails] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setEmails(factura?.cliente.email || '')
    }
  }, [open])

  const handleCancel = () => {
    onClose()
  }

  const handleOk = async () => {
    let aux = true
    if (!factura?._id) {
      toast.error('Seleccione el documento')
      aux = false
    }
    if (isEmptyValue(emails)) {
      toast.error('Debe registrar al menos un correo electrónico')
      aux = false
    }

    const newEmails: string[] = emails.split(';')
    for (const newEmail of newEmails) {
      if (!validateEmail(newEmail)) {
        toast.error(`${newEmail} no es un correo electrónico válido`)
        aux = false
      }
    }

    if (aux) {
      await swalAsyncConfirmDialog({
        preConfirm: () => {
          return apiFcvReenvioEmails({
            cuf: factura?.cuf!,
            emails: newEmails,
          }).catch((err) => {
            swalException(err)
            return false
          })
        },
      }).then((resp) => {
        if (resp.isConfirmed) {
          notSuccess()
          onClose(resp.value)
        }
      })
    }
  }

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Reenviar Notificación de Factura</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12}>
              Nro Factura: {factura?.numeroFactura || ''} <br />
              Cliente: {factura?.cliente.razonSocial || ''} <br />
              Fecha Emisión: {factura?.fechaEmision || ''} <br />
              Código de control CUF: {factura?.cuf || ''} <br />
            </Grid>
            <Grid item lg={12} md={12}>
              <Alert severity="info">
                Para varios correos, puede registrar las mismas separadas por{' '}
                <strong>;</strong> <br />
                Ejemplo: cliente1@correo.com;cliente2@correo.com
              </Alert>
            </Grid>
            <Grid item lg={12} md={12}>
              <TextField
                id="emails"
                name="emails"
                label="Ingrese los correos separados por ;"
                size="small"
                fullWidth
                value={emails}
                multiline
                rows={2}
                onChange={(event) => {
                  setEmails(event.target.value)
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            size={'small'}
            variant={'contained'}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <LoadingButton
            variant={'contained'}
            size={'small'}
            onClick={handleOk}
            loading={loading}
            style={{ marginRight: 15 }}
          >
            Enviar Notificación
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReenviarEmailsDialog
