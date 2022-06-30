import React, {FunctionComponent} from 'react';
import {FormControl, Grid, TextField} from "@mui/material";
import Select from "react-select";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {useAppSelector} from "../../../../hooks";
import {selectProducto} from "../../slices/productos/producto.slice";
import InputNumber from "rc-input-number";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";

interface OwnProps {
}

type Props = OwnProps;

const ProductoPrecio: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    console.log(prod)
    return (
        <SimpleCard title={'Precio'}>
            <Grid container spacing={3}>
                <Grid item lg={6} md={6} xs={12}>
                    <FormControl fullWidth>
                        <small>Precio</small>
                        <InputNumber
                            min={1}
                            value={10}
                            onFocus={(e) => e.target.focus()}
                            onChange={(e: number) => {
                                console.log(e)
                            }}
                            formatter={numberWithCommas}
                        />
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <FormControl fullWidth>
                        <small>Descuento</small>
                        <InputNumber
                            min={1}
                            value={10}
                            onFocus={(e) => e.target.focus()}
                            onChange={(e: number) => {
                                console.log(e)
                            }}
                            formatter={numberWithCommas}
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </SimpleCard>
    );
};

export default ProductoPrecio;
