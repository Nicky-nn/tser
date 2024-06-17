import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FunctionComponent, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import { genReplaceEmpty } from '../../../../utils/helper'
import { notError, notSuccess } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiClienteRegistro } from '../../api/clienteRegistro.api'
import ClienteFormCRUD from '../../components/abm/ClienteFormCRUD'
import { CLIENTE_DEFAULT_INPUT, ClienteInputProps } from '../../interfaces/cliente'
import { clienteRegistroComposeService } from '../../services/clienteRegistroComposerService'
import { clienteInputValidator } from '../../validator/clienteInputValidator'
import { clienteRegistroValidator } from '../../validator/clienteRegistroValidator'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  // eslint-disable-next-line no-unused-vars
  onClose: (value?: any) => void
  onFinished: () => void
}

type Props = OwnProps

const ClienteCrudDialog: FunctionComponent<Props> = (props) => {
  const { onClose, keepMounted, open, ...other } = props

  const form = useForm<ClienteInputProps>({
    defaultValues: {
      ...CLIENTE_DEFAULT_INPUT,
    },
    resolver: yupResolver<any>(clienteInputValidator),
  })

  const [, setIsSelecting] = useState(false)

  const razonSocial = form.watch('razonSocial')

  useEffect(() => {
    setIsSelecting(razonSocial !== null)
  }, [razonSocial])

  const onSubmit: SubmitHandler<ClienteInputProps> = async (values) => {
    const val = await clienteRegistroValidator(values)
    if (val.length > 0) {
      notError(val.join('<br>'))
    } else {
      const apiInput = clienteRegistroComposeService(values)
      await swalAsyncConfirmDialog({
        preConfirm: async () => {
          const resp: any = await apiClienteRegistro(apiInput).catch((e) => ({
            error: e,
          }))
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
        props.onFinished()
        if (resp.isDenied) {
          swalException(resp.value)
        }
        return
      })
    }
  }

  const onError = (errors: any, e: any) => console.log(errors, e)

  useEffect(() => {
    form.reset()
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="sm"
        keepMounted={keepMounted}
        open={open}
        {...other}
      >
        <DialogTitle>Se Finalizará con el Cliente</DialogTitle>
        <DialogContent dividers>
          <ClienteFormCRUD
            form={form}
            reactSelectStyle={reactSelectStyle}
            genReplaceEmpty={genReplaceEmpty}
          />
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
            size={'small'}
            variant={'contained'}
          >
            Registrar y Facturar
          </Button>
          <Button
            style={{ marginRight: 15 }}
            onClick={() => {
              onClose(form.getValues())
              props.onFinished()
            }}
            size={'small'}
            variant={'contained'}
          >
            Facturar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ClienteCrudDialog
