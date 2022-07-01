import React, {FunctionComponent} from 'react';
import {FormControl, FormHelperText, Grid, TextField} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {useAppSelector} from "../../../../hooks";
import {selectProducto} from "../../slices/productos/producto.slice";
import InputNumber from "rc-input-number";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import {handleSelect} from "../../../../utils/helper";

interface OwnProps {
}

type Props = OwnProps;

const ProductoPrecio: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    return (
        <SimpleCard title={'Precio - Inventario'}>
            <Grid container columnSpacing={3} rowSpacing={{ xs: 2, sm: 2, md: 0, lg:0 }}>
                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth>
                        <small>Precio</small>
                        <InputNumber
                            min={0}
                            placeholder={'0.00'}
                            value={prod.varianteDefault.precio}
                            onFocus={handleSelect}
                            onChange={(e: number) => {
                                console.log(e)
                            }}
                            formatter={numberWithCommas}
                        />
                    </FormControl>
                </Grid>

                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth>
                        <small>Precio de comparación</small>
                        <InputNumber
                            min={0}
                            placeholder={'0.00'}
                            value={prod.varianteDefault.precioComparacion}
                            onFocus={handleSelect}
                            onChange={(e: number) => {
                                console.log(e)
                            }}
                            formatter={numberWithCommas}
                        />
                    </FormControl>
                </Grid>

                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth>
                        <small>Costo</small>
                        <InputNumber
                            min={0}
                            placeholder={'0.00'}
                            value={prod.varianteDefault.costo}
                            onFocus={handleSelect}
                            onChange={(e: number) => {
                                console.log(e)
                            }}
                            formatter={numberWithCommas}
                        />
                        <FormHelperText>Información protegida</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth>
                        <TextField
                            label="SKU (Código de producto)"
                            value={prod.varianteDefault.codigoProducto}
                            variant="outlined"
                            size="small"
                        />
                    </FormControl>
                </Grid>

                <Grid item lg={8} md={8} xs={12}>
                    <FormControl fullWidth>
                        <TextField
                            label="Código de Barras"
                            value={prod.varianteDefault.codigoBarras}
                            variant="outlined"
                            size="small"
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </SimpleCard>
    );
};

export default ProductoPrecio;
