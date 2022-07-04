import React, {FunctionComponent} from 'react';
import SimpleContainer from "../../../base/components/Container/SimpleContainer";
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";
import {Button, CssBaseline, Grid, Paper, Stack} from "@mui/material";
import Homologacion from "./registro/ProductoHomologacion";
import ProductoPrecio from "./registro/ProductoPrecio";
import ProductoOpciones from "./registro/ProductoOpciones";
import ProductoVariantes from "./registro/ProductoVariantes";
import ProductoClasificador from "./registro/ProductoClasificador";
import ProductoProveedor from "./registro/ProductoProveedor";
import {swalConfirmDialog} from "../../../utils/swal";

interface OwnProps {
}

type Props = OwnProps;

const ProductoRegistro: FunctionComponent<Props> = (props) => {

    const handleSave = () => {
        swalConfirmDialog({}).then(resp => {
            if (resp.isConfirmed) {
                console.log('confi')
            }
        })
    }
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
                    <Button color={'success'} variant={"contained"} onClick={handleSave}>Guardar Producto</Button>
                </Stack>
            </Paper>

            <Grid container spacing={2}>
                <Grid item lg={8} md={8} xs={12}>
                    <Grid container spacing={1}>
                        <Grid item lg={12}>
                            <Homologacion/>
                        </Grid>
                        <Grid item lg={12}>
                            <ProductoPrecio/>
                        </Grid>
                        <Grid item lg={12}>
                            <ProductoOpciones/>
                        </Grid>
                        <Grid item lg={12}>
                            <ProductoVariantes/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                    <Grid container spacing={1}>
                        <Grid item lg={12}>
                            <ProductoClasificador/>
                        </Grid>
                        <Grid item lg={12}>
                            <ProductoProveedor/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </SimpleContainer>
    );
};

export default ProductoRegistro;
