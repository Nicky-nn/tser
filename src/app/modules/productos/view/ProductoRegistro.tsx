import React, {FunctionComponent} from 'react';
import SimpleContainer from "../../../base/components/Container/SimpleContainer";
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";
import {Grid} from "@mui/material";
import Homologacion from "./registro/ProductoHomologacion";
import ProductoPrecio from "./registro/ProductoPrecio";
import ProductoOpciones from "./registro/ProductoOpciones";
import ProductoVariantes from "./registro/ProductoVariantes";

interface OwnProps {
}

type Props = OwnProps;

const ProductoRegistro: FunctionComponent<Props> = (props) => {

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
            <Grid container spacing={2}>
                <Grid item lg={8} md={8} xs={12}>
                    <Grid container spacing={1}>
                        <Grid item lg={12}>
                            <Homologacion/>
                        </Grid>
                        <Grid item lg={12}>
                            <ProductoPrecio />
                        </Grid>
                        <Grid item lg={12}>
                            <ProductoOpciones />
                        </Grid>
                        <Grid item lg={12}>
                            <ProductoVariantes />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                    PANEL IZQUIERDO
                </Grid>
            </Grid>
        </SimpleContainer>
    );
};

export default ProductoRegistro;
