import React, {FunctionComponent} from "react";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {Grid, TextField} from "@mui/material";
import {useAppSelector} from "../../../../hooks";
import {selectProducto} from "../../slices/productos/producto.slice";

interface OwnProps {
}

type Props = OwnProps;

const ProductoHomologacion: FunctionComponent<Props> = (props) => {
    const producto = useAppSelector(selectProducto)
    console.log(producto)
    return (

        <>
            <SimpleCard title={'Homologación de productos'}>
                <Grid container spacing={1}>
                    <Grid item>
                        fsfs
                    </Grid>
                </Grid>
            </SimpleCard>
        </>
    );
};

export default ProductoHomologacion;