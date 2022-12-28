import { Grid, TextField } from '@mui/material'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'

import AlertError from '../../../base/components/Alert/AlertError'
import { Cliente99001InputProps } from '../interfaces/cliente'

interface OwnProps {
  formik: FormikProps<Cliente99001InputProps>
}

type Props = OwnProps

const Cliente99001Form: FunctionComponent<Props> = (props) => {
  const { formik, ...other } = props

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} xs={12}>
          <Grid item lg={7} md={7} xs={12}>
            <TextField
              id="codigoCliente"
              name="codigoCliente"
              label="Código de cliente"
              size="small"
              fullWidth
              value={formik.values.codigoCliente}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.codigoCliente && Boolean(formik.errors.codigoCliente)}
              helperText={formik.touched.codigoCliente && formik.errors.codigoCliente}
            />
          </Grid>
        </Grid>

        <Grid item lg={12} md={12} xs={12}>
          <TextField
            id="razonSocial"
            name="razonSocial"
            label="Razon Social"
            size="small"
            fullWidth
            value={formik.values.razonSocial}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.razonSocial && Boolean(formik.errors.razonSocial)}
            helperText={formik.touched.razonSocial && formik.errors.razonSocial}
          />
        </Grid>

        <Grid item lg={12} md={12} xs={12}>
          <TextField
            id="email"
            name="email"
            label="Correo Electrónico"
            size="small"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
      </Grid>
    </form>
  )
}

export default Cliente99001Form
