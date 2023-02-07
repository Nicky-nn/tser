import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { FunctionComponent, useEffect } from 'react'
import {
  CLIENTE_DEFAULT_INPUT,
  ClienteInputProps,
  ClienteProps,
} from '../../interfaces/cliente'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { clienteInputValidator } from '../../validator/clienteInputValidator'
import { clienteRegistroValidator } from '../../validator/clienteRegistroValidator'
import { notError, notSuccess } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import ClienteForm from '../../components/abm/ClienteForm'
import { clienteDecomposeService } from '../../services/clienteDecomposeService'
import { actionForm } from '../../../../interfaces'
import { clienteActualizarComposeService } from '../../services/clienteActualizarComposerService'
import { apiClienteActualizar } from '../../api/clienteUpdate.api'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  cliente: ClienteProps
  onClose: (value?: ClienteProps) => void
}

type Props = OwnProps

const ClienteActualizarDialog: FunctionComponent<Props> = (props) => {
  const { onClose, keepMounted, open, cliente, ...other } = props

  const form = useForm<ClienteInputProps>({
    defaultValues: {
      ...CLIENTE_DEFAULT_INPUT,
      action: actionForm.UPDATE,
    },
    resolver: yupResolver(clienteInputValidator),
  })

  const onSubmit: SubmitHandler<ClienteInputProps> = async (values) => {
    const val = await clienteRegistroValidator(values)
    if (val.length > 0) {
      notError(val.join('<br>'))
    } else {
      const apiInput = clienteActualizarComposeService(values)
      await swalAsyncConfirmDialog({
        preConfirm: async () => {
          const resp: any = await apiClienteActualizar(cliente._id, apiInput).catch(
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
    if (cliente && open) {
      form.reset(clienteDecomposeService(cliente, actionForm.UPDATE))
    }
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 800 } }}
        maxWidth="sm"
        keepMounted={keepMounted}
        open={open}
        {...other}
      >
        <DialogTitle>Actualizar cliente {cliente.razonSocial}</DialogTitle>
        <DialogContent dividers>
          <ClienteForm form={form} />
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
            disabled={!form.formState.isValid}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ClienteActualizarDialog
