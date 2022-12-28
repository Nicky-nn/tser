import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'

import { notSuccess } from '../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiTipoProductoRegistro } from '../api/tipoProductoRegistro.api'
import {
  TIPO_PRODUCTO_INITIAL_VALUES,
  TipoProductoInputProp,
  TipoProductoProps,
} from '../interfaces/tipoProducto.interface'
import { tipoProductoRegistroValidationSchema } from '../validator/tipoProductoRegistro.validator'
import TipoProductoForm from './TipoProductoForm'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: TipoProductoProps) => void
}

type Props = OwnProps

const TipoProductoDialogRegistro: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props

  const formik: FormikProps<TipoProductoInputProp> = useFormik<TipoProductoInputProp>({
    initialValues: TIPO_PRODUCTO_INITIAL_VALUES,
    validationSchema: tipoProductoRegistroValidationSchema,
    onSubmit: async (values) => {
      await swalAsyncConfirmDialog({
        preConfirm: () => {
          return apiTipoProductoRegistro(values).catch((err) => {
            swalException(err)
            return false
          })
        },
        text: 'Confirma que desea reagistrar al proveedor',
      }).then((resp) => {
        if (resp.isConfirmed) {
          notSuccess()
          onClose(resp.value)
        }
      })
    },
  })

  const handleCancel = () => {
    onClose()
  }

  useEffect(() => {
    formik.resetForm()
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 500 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Registrar nuevo clasificador de productos</DialogTitle>
        <DialogContent dividers>
          <TipoProductoForm formik={formik} />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            size={'small'}
            variant={'contained'}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            onClick={formik.submitForm}
            size={'small'}
            style={{ marginRight: 25 }}
            variant={'contained'}
            disabled={!formik.isValid}
          >
            Registrar Clasificador
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TipoProductoDialogRegistro
