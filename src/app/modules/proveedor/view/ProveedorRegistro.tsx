import { Container } from '@mui/material'
import { Box } from '@mui/system'
import { FormikProps, useFormik } from 'formik'
import React, { FunctionComponent } from 'react'
import { object, string } from 'yup'

import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import { genRandomString } from '../../../utils/helper'
import { ProveedorInputProp } from '../interfaces/proveedor.interface'
import ProveedorForm from './ProveedorForm'

interface OwnProps {}

type Props = OwnProps

const validationSchema = object({
  codigo: string().email('Enter a valid email').required('Código es requerido'),
  nombre: string().required('Nombre Proveedor es requerido'),
  direccion: string().required('Dirección es requerido'),
  ciudad: string().required('Ciudad / Ubicación es requerido'),
  contacto: string().required('Nombre de contacto es requerido'),
  correo: string().email('Ingrese Correo válido').required('Correo es requerido'),
  telefono: string(),
})

const ProveedorRegistro: FunctionComponent<Props> = (props) => {
  const formik: FormikProps<ProveedorInputProp> = useFormik<ProveedorInputProp>({
    initialValues: {
      codigo: genRandomString().toUpperCase(),
      nombre: '',
      direccion: '',
      ciudad: '',
      contacto: '',
      correo: '',
      telefono: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values)
    },
  })

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Ventas', path: '/ventas/registro' },
            { name: 'Registrar Venta' },
          ]}
        />
      </div>

      <ProveedorForm formik={formik} />
      <Box py="12px" />
    </Container>
  )
}

export default ProveedorRegistro
