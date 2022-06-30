import React, {FunctionComponent} from "react";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {FormControl, FormControlLabel, Grid, TextField} from "@mui/material";
import {useAppSelector} from "../../../../hooks";
import {selectProducto} from "../../slices/productos/producto.slice";
import Select from "react-select";
import {reactSelectCustomStyles} from "../../../../base/components/MySelect/ReactSelect";

interface OwnProps {
}

type Props = OwnProps;

const options: any = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

const ProductoHomologacion: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    console.log(prod)
    return (

        <>
            <SimpleCard title={'Datos Básicos'}>
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} xs={12}>
                        <FormControl fullWidth>
                            <small>Producto Homologado</small>
                            <Select
                                menuPortalTarget={document.body}
                                value={prod.codigoProductoSin}
                                onChange={(e) => {
                                    console.log(e)
                                }}
                                options={options}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <TextField
                            name="nombre"
                            label="Nombre Producto"
                            size="small"
                            fullWidth
                            value={prod.titulo}
                            onChange={(e) => {
                                console.log(e)
                            }}
                        />
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <TextField
                            name="descripcion"
                            label="Descripcion"
                            size="small"
                            fullWidth
                            value={prod.descripcion}
                            onChange={(e) => {
                                console.log(e)
                            }}
                        />
                    </Grid>
                </Grid>
            </SimpleCard>
        </>
    );
};

export default ProductoHomologacion;