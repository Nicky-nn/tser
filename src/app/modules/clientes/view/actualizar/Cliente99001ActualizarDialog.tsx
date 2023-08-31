import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { FunctionComponent, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { actionForm } from '../../../../interfaces'
import { notError, notSuccess } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiCliente99001Actualizar } from '../../api/cliente99001Actualizar.api'
import Cliente99001Form from '../../components/abm/Cliente99001Form'
import {
  CLIENTE_99001_DEFAULT_INPUT,
  Cliente99001InputProps,
  ClienteProps,
} from '../../interfaces/cliente'
import { cliente99001ActualizarComposeService } from '../../services/cliente99001ActualizarComposeService'
import { cliente99001DecomposeService } from '../../services/cliente99001DecomposeService'
import { cliente99001RegistroValidator } from '../../validator/cliente99001RegistroValidator'
import { cliente99001InputValidator } from '../../validator/clienteInputValidator'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  cliente: ClienteProps
  onClose: (value?: ClienteProps) => void
}

type Props = OwnProps

const Cliente99001ActualizarDialog: FunctionComponent<Props> = (props) => {
  const { onClose, keepMounted, open, cliente, ...other } = props

  const form = useForm<Cliente99001InputProps>({
    defaultValues: {
      ...CLIENTE_99001_DEFAULT_INPUT,
      action: actionForm.UPDATE,
    },
    resolver: yupResolver<any>(cliente99001InputValidator),
  })

  const onSubmit: SubmitHandler<Cliente99001InputProps> = async (values) => {
    const val = await cliente99001RegistroValidator(values)
    if (val.length > 0) {
      notError(val.join('<br>'))
    } else {
      const apiInput = cliente99001ActualizarComposeService(values)
      await swalAsyncConfirmDialog({
        preConfirm: async () => {
          const resp: any = await apiCliente99001Actualizar(cliente._id, apiInput).catch(
            (e) => ({
              error: e,
            }),
          )
          if (resp.error) {
            swalException(resp.error)
            return false
          }
          return resp
        },
      }).then((resp) => {
        if (resp.isConfirmed) {
          notSuccess()
          onClose(resp.value)
        }
        if (resp.isDenied) {
          swalException(resp.value)
        }
        return
      })
    }
  }
  const onError = (errors: any, e: any) => console.log(errors, e)
  useEffect(() => {
    if (open)
      if (cliente && open) {
        form.reset(cliente99001DecomposeService(cliente, actionForm.UPDATE))
      }
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '90%', maxHeight: 600 } }}
        maxWidth="sm"
        keepMounted={keepMounted}
        open={open}
        {...other}
      >
        <DialogTitle>Actualizar cliente 99001 {cliente.razonSocial}</DialogTitle>
        <DialogContent dividers>
          <Cliente99001Form form={form} />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            variant={'contained'}
            size={'small'}
            onClick={() => {
              onClose()
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit, onError)}
            style={{ marginRight: 15 }}
            size={'small'}
            variant={'contained'}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Cliente99001ActualizarDialog
