import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useFormik } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'

import useAuth from '../../../base/hooks/useAuth'
import { genRandomString } from '../../../utils/helper'
import { notSuccess } from '../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiCliente99001Create } from '../api/cliente99001Create.api'
import {
  CLIENTE_99001_DEFAULT_INPUT,
  Cliente99001InputProps,
  ClienteProps,
} from '../interfaces/cliente'
import { cliente99001InputValidator } from '../validator/clienteInputValidator'
import Cliente99001Form from './Cliente99001Form'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: ClienteProps) => void
}

type Props = OwnProps

const Cliente99001RegistroDialog: FunctionComponent<Props> = (props) => {
  const { onClose, keepMounted, open, ...other } = props
  const { user } = useAuth()

  const cliente99001Form = useFormik<Cliente99001InputProps>({
    initialValues: CLIENTE_99001_DEFAULT_INPUT,
    validationSchema: cliente99001InputValidator,
    onSubmit: async (values) => {
      await swalAsyncConfirmDialog({
        preConfirm: () => {
          return apiCliente99001Create({
            ...values,
          }).catch((err) => {
            swalException(err)
            return false
          })
        },
        text: 'Confirma que desea registrar al nuevo cliente Extranjero?',
      }).then((resp) => {
        if (resp.isConfirmed) {
          notSuccess()
          onClose(resp.value)
        }
      })
    },
  })

  useEffect(() => {
    if (open) {
      cliente99001Form.resetForm()
      cliente99001Form.setFieldValue('codigoCliente', genRandomString(10).toUpperCase())
      cliente99001Form.setFieldValue('email', user.correo)
      // clienteForm.setValues(CLIENTE_DEFAULT_INPUT)
    }
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
        <DialogTitle>Agregar Cliente Extranjero (99001) </DialogTitle>
        <DialogContent dividers>
          <Cliente99001Form formik={cliente99001Form} />
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
            onClick={cliente99001Form.submitForm}
            style={{ marginRight: 15 }}
            size={'small'}
            variant={'contained'}
          >
            Registrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Cliente99001RegistroDialog
