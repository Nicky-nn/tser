import React, {ChangeEvent, FunctionComponent} from 'react';
import {Checkbox, FormControl, FormControlLabel, FormGroup, Grid} from "@mui/material";
import {selectProducto} from "../../slices/productos/producto.slice";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {useAppSelector} from "../../../../hooks";

interface OwnProps {
}

type Props = OwnProps;

const ProductoVariantes: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    if (!prod.varianteUnica) {
        return ('')
    }

    return (
        <SimpleCard title={'Variantes de productos'}>
            <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
                <Grid item lg={12} md={12} xs={12}>
                    <div className="responsive-table">
                        <table>
                            <thead>
                            <tr>
                                <th>Variante</th>
                                <th>Código Producto</th>
                                <th>Precio</th>
                                <th>Costo</th>
                                <th>Cantidad</th>
                                <th>Opciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                prod.variantes.map(v => (
                                    <tr key={v.titulo}>
                                        <td>{v.titulo}</td>
                                        <td>{v.titulo}</td>
                                        <td>{v.titulo}</td>
                                        <td>{v.titulo}</td>
                                        <td>{v.titulo}</td>
                                        <td>{v.titulo}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </Grid>
            </Grid>
        </SimpleCard>
    );
};

export default ProductoVariantes;
