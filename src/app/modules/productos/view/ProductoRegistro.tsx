import React, {FunctionComponent, useEffect} from 'react';
import SimpleContainer from "../../../base/components/Container/SimpleContainer";
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";
import {Button, CssBaseline, Grid, Paper, Stack} from "@mui/material";
import Homologacion from "./registro/ProductoHomologacion";
import {swalAsyncConfirmDialog, swalException} from "../../../utils/swal";
import {Save} from "@mui/icons-material";
import {notError, notSuccess} from "../../../utils/notification";
import {useNavigate} from "react-router-dom";
import {FormikProps, useFormik} from "formik";
import {PRODUCTO_INITIAL_VALUES, ProductoInputProps} from "../interfaces/producto.interface";
import {genRandomString} from "../../../utils/helper";
import ProductoPrecio from "./registro/ProductoPrecio";
import ProductoInventario from "./ProductoInventario/ProductoInventario";
import ProductoOpciones from "./registro/ProductoOpciones";
import ProductoVariantes from "./registro/ProductoVariantes";
import ProductoClasificador from "./registro/ProductoClasificador";
import ProductoProveedor from "./registro/ProductoProveedor";
import {productoRegistroValidationSchema, productoRegistroValidator} from "../validator/productoRegistroValidator";
import {productoComposeService} from "../services/ProductoComposeService";
import {apiProductoRegistro} from "../api/productoRegistro.api";

interface OwnProps {
    formik: FormikProps<ProductoInputProps>
}

type Props = OwnProps;

const ProductoRegistro: FunctionComponent<Props> = (props) => {
    const navigate = useNavigate()

    const formik: FormikProps<ProductoInputProps> = useFormik<ProductoInputProps>({
        initialValues: PRODUCTO_INITIAL_VALUES,
        validationSchema: productoRegistroValidationSchema,
        onSubmit: async (values) => {
            console.log(values)
            const val = await productoRegistroValidator(values)
            if (val.length > 0) {
                notError(val.join('<br>'))
            } else {
                const apiInput = productoComposeService(values)
                await swalAsyncConfirmDialog({
                    preConfirm: async () => {
                        const resp: any = await apiProductoRegistro(apiInput).catch(err => ({error: err}))
                        if (resp.error) {
                            swalException(resp.error)
                            return false
                        }
                        return resp;
                    }
                }).then(resp => {
                    if (resp.isConfirmed) {
                        notSuccess()
                        navigate(`/productos/modificar/${resp.value._id}`, {replace: true})
                    }
                    if (resp.isDenied) {
                        swalException(resp.value)
                    }
                    return
                })
            }
        },
    });

    useEffect(() => {
        formik.setFieldValue('variante.id', genRandomString(10))
    }, []);

    return (
        <SimpleContainer>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Productos', path: '/productos/gestion'},
                        {name: 'Nuevo Producto'},
                    ]}
                />
            </div>
            <CssBaseline/>

            <Paper elevation={0} variant="elevation" square sx={{mb: 2, p: 0.5}} className={'asideSidebarFixed'}>
                <Stack
                    direction={{xs: 'column', sm: 'row'}}
                    style={{marginTop: 2}}
                    spacing={{xs: 1, sm: 1, md: 1, xl: 1}}
                    justifyContent="flex-end"
                >
                    <Button color={'success'} startIcon={<Save/>} variant={"contained"} onClick={formik.submitForm}>
                        Guardar Producto
                    </Button>
                </Stack>
            </Paper>

            <Grid container spacing={2}>
                <Grid item lg={8} md={8} xs={12}>
                    <Grid container spacing={1}>
                        <Grid item lg={12} md={12} xs={12}>
                            <Homologacion formik={formik}/>
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            {<ProductoPrecio formik={formik}/>}
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            {<ProductoInventario formik={formik}/>}
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            {<ProductoOpciones formik={formik}/>}
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            {<ProductoVariantes formik={formik}/>}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                    <Grid container spacing={1}>
                        <Grid item lg={12} md={12} xs={12}>
                            {<ProductoClasificador formik={formik}/>}
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            {<ProductoProveedor formik={formik}/>}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </SimpleContainer>
    );
};

export default ProductoRegistro;
