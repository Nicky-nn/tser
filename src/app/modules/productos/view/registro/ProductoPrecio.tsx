import React, {ChangeEvent, FunctionComponent, useEffect, useState} from 'react';
import {Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, TextField, Typography} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {useAppSelector} from "../../../../hooks";
import {selectProducto, setProducto, setProdVariante} from "../../slices/productos/producto.slice";
import InputNumber from "rc-input-number";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import {genReplaceEmpty, handleSelect} from "../../../../utils/helper";
import {MyInputLabel} from "../../../../base/components/MyInputs/MyInputLabel";
import {swalException} from "../../../../utils/swal";
import {apiSucursales} from "../../../sucursal/api/sucursales.api";
import {SucursalProps} from "../../../sucursal/interfaces/sucursal";
import {useDispatch} from "react-redux";
import {sortBy} from "lodash";
import {apiSinUnidadMedida} from "../../../sin/api/sinUnidadMedida.api";
import {SinUnidadMedidaProps} from "../../../sin/interfaces/sin.interface";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import Select from "react-select";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import {ProductoVarianteInputProps} from "../../interfaces/producto.interface";

interface OwnProps {
}

type Props = OwnProps;

const ProductoPrecio: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    const [isError, setError] = useState<any>(null);
    const [sucursales, setSucursales] = useState<SucursalProps[]>([]);
    const [unidadesMedida, setUnidadesMedida] = useState<SinUnidadMedidaProps[]>([]);
    const dispatch = useDispatch()

    const resetInventario = (data: SucursalProps[]): Array<any> => {
        return sortBy(data, 'codigo').map(item => ({
            sucursal: {codigo: item.codigo},
            stock: genReplaceEmpty(prod.variante.inventario.find(inv => inv.sucursal.codigo == item.codigo)?.stock, 0)
        }))
    }

    // Reset de las unidades de medida, tambien actualizar las unidades de medida de las variantes
    const resetUnidadMedida = (variante: ProductoVarianteInputProps, variantes: ProductoVarianteInputProps[], unidadMedida: SinUnidadMedidaProps) => {
        return {
            variante: {
                ...variante,
                unidadMedida
            },
            variantes: variantes.map((value) => {
                return {
                    ...value,
                    unidadMedida
                }
            })
        }
    }

    const fetchUnidadesMedida = async () => {
        await apiSinUnidadMedida().then((data) => {
            setUnidadesMedida(data)
        }).catch(err => {
            swalException(err)
            return []
        })
    }

    useEffect(() => {
        fetchUnidadesMedida().then()
    }, []);

    if (isError) {
        return <h1>Ocurrio un error</h1>
    }

    return (
        <SimpleCard title={'PRECIO'}>
            <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
                <Grid item lg={12} md={12} xs={12}>
                    <FormControl fullWidth sx={{mb: 1}}>
                        <SelectInputLabel shrink>
                            Unidad Medida
                        </SelectInputLabel>
                        <Select<SinUnidadMedidaProps>
                            styles={reactSelectStyles}
                            menuPosition={'fixed'}
                            name="unidadMedida"
                            placeholder={'Seleccione la unidad de medida'}
                            value={prod.variante.unidadMedida}
                            onChange={async (val: any) => {
                                const unidadMedida = resetUnidadMedida(prod.variante, prod.variantes, val)
                                dispatch(setProducto({
                                    ...prod,
                                    variante: unidadMedida.variante,
                                    variantes: unidadMedida.variantes
                                }))
                            }}
                            options={unidadesMedida}
                            getOptionValue={(item) => item.codigoClasificador}
                            getOptionLabel={(item) => `${item.codigoClasificador} - ${item.descripcion}`}
                        />
                    </FormControl>
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth>
                        <MyInputLabel shrink>Precio</MyInputLabel>
                        <InputNumber
                            min={0}
                            placeholder={'0.00'}
                            value={prod.variante.precio}
                            onFocus={handleSelect}
                            onChange={(precio: number) => {
                                dispatch(setProdVariante({
                                    ...prod.variante,
                                    precio
                                }))
                            }}
                            formatter={numberWithCommas}
                        />
                    </FormControl>
                </Grid>

                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth component={'div'}>
                        <MyInputLabel shrink>Precio de comparación</MyInputLabel>
                        <InputNumber
                            min={0}
                            placeholder={'0.00'}
                            value={prod.variante.precioComparacion}
                            onFocus={handleSelect}
                            onChange={(precioComparacion: number) => {
                                dispatch(setProdVariante({
                                    ...prod.variante,
                                    precioComparacion
                                }))
                            }}
                            formatter={numberWithCommas}
                        />
                    </FormControl>
                </Grid>

                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth component={'div'}>
                        <MyInputLabel shrink>Costo</MyInputLabel>
                        <InputNumber
                            min={0}
                            placeholder={'0.00'}
                            value={prod.variante.costo}
                            onFocus={handleSelect}
                            onChange={(costo: number) => {
                                dispatch(setProdVariante({
                                    ...prod.variante,
                                    costo
                                }))
                            }}
                            formatter={numberWithCommas}
                        />
                        <FormHelperText>Información protegida</FormHelperText>
                    </FormControl>
                </Grid>

            </Grid>
        </SimpleCard>
    );
};

export default ProductoPrecio;
