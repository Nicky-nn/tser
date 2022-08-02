import React, {FunctionComponent} from 'react';
import {FormikProps, useFormik} from "formik";
import {ProveedorInputProp} from "../interfaces/proveedor.interface";
import {Grid, TextField} from "@mui/material";
import {genRandomString} from "../../../utils/helper";
import {object, string} from "yup";

interface OwnProps {
    onFormSubmit?: (value?: ProveedorInputProp) => void;
}

type Props = OwnProps;

const validationSchema = object({
    codigo: string().email('Enter a valid email').required('Código es requerido'),
    nombre: string().required('Nombre Proveedor es requerido'),
    direccion: string().required('Dirección es requerido'),
    ciudad: string().required('Ciudad / Ubicación es requerido'),
    contacto: string().required('Nombre de contacto es requerido'),
    correo: string().email('Ingrese Correo válido').required('Correo es requerido'),
    telefono: string()
});

const ProveedorForm: FunctionComponent<Props> = (props) => {
    const formik: FormikProps<ProveedorInputProp> = useFormik<ProveedorInputProp>({
        initialValues: {
            codigo: genRandomString().toUpperCase(),
            nombre: '',
            direccion: '',
            ciudad: '',
            contacto: '',
            correo: '',
            telefono: ''
        },
        validationSchema,
        onSubmit: (values) => {
            console.log(values);
        }
    });

    return (<>
        <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={1}>
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
                        onBlur={formik.handleBlur}
                        error={formik.touched.ciudad && Boolean(formik.errors.ciudad)}
                        helperText={formik.touched.ciudad && formik.errors.ciudad}
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
    </>);
};

export default ProveedorForm;
