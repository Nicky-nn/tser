import React, {FunctionComponent, useEffect} from 'react';
import SimpleContainer from "../../../base/components/Container/SimpleContainer";
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";
import {Button, CssBaseline, Grid, Paper, Stack} from "@mui/material";
import Homologacion from "./registro/ProductoHomologacion";
import ProductoPrecio from "./registro/ProductoPrecio";
import ProductoOpciones from "./registro/ProductoOpciones";
import ProductoVariantes from "./registro/ProductoVariantes";
import ProductoClasificador from "./registro/ProductoClasificador";
import ProductoProveedor from "./registro/ProductoProveedor";
import {swalAsyncConfirmDialog, swalClose, swalException, swalLoading} from "../../../utils/swal";
import {Description, Save} from "@mui/icons-material";
import {useAppSelector} from "../../../hooks";
import {selectProducto, setProducto} from "../slices/productos/producto.slice";
import {productoRegistroValidator} from "../validator/productoRegistroValidator";
import {notDanger, notError, notSuccess} from "../../../utils/notification";
import {productoComposeService, productoInputComposeService} from "../services/ProductoComposeService";
import {useNavigate, useParams} from "react-router-dom";
import {isEmptyValue} from "../../../utils/helper";
import {apiProductoPorId} from "../api/productoPorId.api";
import {apiProductoModificar} from "../api/productoModificar.api";
import {productosRouteMap} from "../ProductosRoutesMap";
import {fetchSinActividadesPorDocumentoSector} from "../../sin/api/sinActividadesPorDocumentoSector";
import {useDispatch} from "react-redux";

interface OwnProps {
}

type Props = OwnProps;

const ProductoActualizar: FunctionComponent<Props> = (props) => {
    const {id}: { id?: string } = useParams();
    const navigate = useNavigate()
    const prod = useAppSelector(selectProducto)
    const dispatch = useDispatch()
    const fetchProductoPorId = async (id: string) => {
        try {
            swalLoading()
            const response = await apiProductoPorId(id);
            swalClose()
            if (response) {
                const actividades = await fetchSinActividadesPorDocumentoSector()
                    .then(async (data) => {
                        if (data)
                            return data.find(item => item.codigoActividad === response.sinProductoServicio.codigoActividad)
                        throw new Error('Error en cargar los datos')
                    })
                const prodInput = productoInputComposeService(response, actividades!)
                console.log(JSON.stringify(prodInput))
                dispatch(setProducto(prodInput))

            } else {
                notDanger('No se ha podido encontrar datos del producto')
                navigate(-1)
            }
        } catch (e: any) {
            swalException(e)
        }

    }

    useEffect(() => {
        (async () => {
            if (!isEmptyValue(id)) {
                await fetchProductoPorId(id!).then()
            } else {
                notDanger('Require codigo del producto')
                navigate(-1)
            }
        })()
    }, []);

    // GUARDAMOS LOS CAMBIOS
    const handleSave = async () => {
        // Reglas de validacion
        const val = await productoRegistroValidator(prod)
        if (val.length > 0) {
            notError(val.join('<br>'))
        } else {
            const apiInput = productoComposeService(prod)
            await swalAsyncConfirmDialog({
                preConfirm: async () => {
                    const resp: any = await apiProductoModificar(apiInput).catch(err => ({error: err}))
                    if (resp.error) {
                        swalException(resp.error)
                        return false
                    }
                    return resp;
                }
            }).then(resp => {
                if (resp.isConfirmed) {
                    notSuccess()
                    console.log(resp.value)
                }
                if (resp.isDenied) {
                    swalException(resp.value)
                }
                return
            })
        }
    }
    return (
        <SimpleContainer>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Productos', path: '/productos/gestion'},
                        {name: 'Modificar Producto'},
                    ]}
                />
            </div>
            <CssBaseline/>

            <Paper elevation={0} variant="elevation" square sx={{mb: 2, p: 0.5}} className={'asideSidebarFixed'}>
                <Stack
                    direction={{xs: 'column', sm: 'row'}}
                    style={{marginTop: 2}}
                    spacing={{xs: -2, sm: 0, md: 1, xl: 0}}
                    justifyContent="flex-end"
                >
                    <Button color={'primary'} startIcon={<Description/>} variant={"contained"}
                            onClick={() => navigate(productosRouteMap.nuevo)}>
                        Nuevo Producto
                    </Button>&nbsp;

                    <Button color={'success'} startIcon={<Save/>} variant={"contained"} onClick={handleSave}>
                        Guardar Cambios
                    </Button>
                </Stack>
            </Paper>

            <Grid container spacing={2}>
                <Grid item lg={8} md={8} xs={12}>
                    <Grid container spacing={1}>
                        <Grid item lg={12} md={12} xs={12}>
                            <Homologacion/>
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            <ProductoPrecio/>
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            <ProductoOpciones/>
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            <ProductoVariantes/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                    <Grid container spacing={1}>
                        <Grid item lg={12} md={12} xs={12}>
                            <ProductoClasificador/>
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                            <ProductoProveedor/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </SimpleContainer>
    );
};

export default ProductoActualizar;
