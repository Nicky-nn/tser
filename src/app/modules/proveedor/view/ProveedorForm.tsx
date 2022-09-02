import { Grid, TextField } from '@mui/material';
import { FormikProps } from 'formik';
import React, { FunctionComponent } from 'react';

import { ProveedorInputProp } from '../interfaces/proveedor.interface';

interface OwnProps {
  formik: FormikProps<ProveedorInputProp>;
}

type Props = OwnProps;

const ProveedorForm: FunctionComponent<Props> = (props) => {
  const { formik } = props;
  return (
    <>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} lg={4}>
            <TextField
              name="codigo"
              label="Código"
              size="small"
              fullWidth
              value={formik.values.codigo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.codigo && Boolean(formik.errors.codigo)}
              helperText={formik.touched.codigo && formik.errors.codigo}
            />
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <TextField
              name="nombre"
              label="Nombre Proveedor"
              size="small"
              fullWidth
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <TextField
              name="ciudad"
              label="Ciudad / Ubicación"
              size="small"
              fullWidth
              value={formik.values.ciudad}
              onChange={formik.handleChange}
              required
              onBlur={formik.handleBlur}
              error={formik.touched.ciudad && Boolean(formik.errors.ciudad)}
              helperText={formik.touched.ciudad && formik.errors.ciudad}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <TextField
              name="direccion"
              label="Dirección"
              size="small"
              fullWidth
              value={formik.values.direccion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.direccion && Boolean(formik.errors.direccion)}
              helperText={formik.touched.direccion && formik.errors.direccion}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <TextField
              name="contacto"
              label="Nombre del contacto"
              size="small"
              fullWidth
              value={formik.values.contacto}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.contacto && Boolean(formik.errors.contacto)}
              helperText={formik.touched.contacto && formik.errors.contacto}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <TextField
              name="correo"
              label="Correo Electrónico"
              size="small"
              fullWidth
              value={formik.values.correo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.correo && Boolean(formik.errors.correo)}
              helperText={formik.touched.correo && formik.errors.correo}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <TextField
              name="telefono"
              label="Teléfono"
              size="small"
              fullWidth
              value={formik.values.telefono}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.telefono && Boolean(formik.errors.telefono)}
              helperText={formik.touched.telefono && formik.errors.telefono}
            />
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default ProveedorForm;
