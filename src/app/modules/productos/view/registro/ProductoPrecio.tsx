import React, {ChangeEvent, FunctionComponent, useEffect, useState} from 'react';
import {Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, TextField, Typography} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {useAppSelector} from "../../../../hooks";
import {selectProducto, setProducto, setProdVariante} from "../../slices/productos/producto.slice";
import InputNumber from "rc-input-number";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import {handleSelect} from "../../../../utils/helper";
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
    const [sucursales, setSucursales] = useState<SucursalProps[]>([]);
    const [unidadesMedida, setUnidadesMedida] = useState<SinUnidadMedidaProps[]>([]);
    const dispatch = useDispatch()

    const resetInventario = (data: SucursalProps[]): Array<any> => {
        return sortBy(data, 'codigo').map(item => ({
            sucursal: item,
            stock: 0
        }))
    }
    // Reset de las cantidades por sucursal
    const resetVariantesStock = (variantes: ProductoVarianteInputProps[], codSucursal: 'ALL' | number, stock = 0) => {
        return variantes.map((value) => {
            return {
                ...value,
                inventario: value.inventario.map(value1 => {
                    if (codSucursal !== 'ALL') {
                        return {...value1, stock}
                    } else {
                        if (value1.sucursal.codigo === parseInt(codSucursal)) {
                            return {...value1, stock}
                        }
                        return {...value1}
                    }
                })
            }
        })
    }
    // Reset de la variante default, tambien actualiza los stocks por codigo sucursal
    const resetVarianteStock = (variante: ProductoVarianteInputProps, codSucursal: 'ALL' | number, stock = 0) => {
        return {
            ...variante,
            inventario: variante.inventario.map(value => {
                if (codSucursal !== 'ALL') {
                    return {...value, stock}
                } else {
                    if (value.sucursal.codigo === parseInt(codSucursal)) {
                        return {...value, stock}
                    }
                    return {...value}
                }
            })
        }
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

    const fetchSucursales = async () => {
        await apiSucursales()
            .then(async (data) => {
                setSucursales(data)
                const inventario = resetInventario(data)
                dispatch(setProdVariante({
                    ...prod.variante,
                    inventario
                }))
            })
            .catch(err => {
                swalException(err);
                return []
            })
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
        fetchSucursales().then()
        fetchUnidadesMedida().then()
    }, []);


    return (
        <SimpleCard title={'Precio - Inventario'}>
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

                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth>
                        <TextField
                            label="SKU (Código de producto)"
                            value={prod.variante.codigoProducto}
                            onChange={(e) => {
                                dispatch(setProdVariante({
                                    ...prod.variante,
                                    codigoProducto: e.target.value
                                }))
                            }}
                            variant="outlined"
                            size="small"
                        />
                    </FormControl>
                </Grid>

                <Grid item lg={8} md={8} xs={12}>
                    <FormControl fullWidth>
                        <TextField
                            label="Código de Barras"
                            value={prod.variante.codigoBarras}
                            onChange={(e) => {
                                dispatch(setProdVariante({
                                    ...prod.variante,
                                    codigoBarras: e.target.value
                                }))
                            }}
                            variant="outlined"
                            size="small"
                        />
                    </FormControl>
                </Grid>
                <Grid item lg={8} md={12} xs={12}>
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={prod.incluirCantidad}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        dispatch(setProducto({
                                            ...prod,
                                            incluirCantidad: e.target.checked,
                                            variante: resetVarianteStock(prod.variante, "ALL"),
                                            variantes: resetVariantesStock(prod.variantes, 'ALL')
                                        }))

                                    }}
                                />
                            }
                            label="¿Incluir cantidad al inventario?"/>
                    </FormControl>
                    {
                        prod.incluirCantidad && (
                            <>
                                <br/>
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!prod.variante.habilitarStock}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    dispatch(setProdVariante({
                                                        ...prod.variante,
                                                        habilitarStock: !e.target.checked
                                                    }))
                                                }}
                                            />
                                        }
                                        label="¿Continuar venta aun si el item este agotado?"/>
                                </FormControl>
                            </>
                        )
                    }
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                    <Typography variant="subtitle2" gutterBottom component="div">
                        &nbsp;CANTIDAD
                    </Typography>
                    <div className={'responsive-table'}>
                        <table>
                            <thead>
                            <tr>
                                <th data-name="COD" style={{width: 50}}>COD</th>
                                <th>NOMBRE SUCURSAL</th>
                                <th style={{width: 250}}>CANTIDAD DISPONIBLE</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                prod.variante.inventario.map((s, index: number) => (
                                    <tr key={s.sucursal.codigo}>
                                        <td data-label="COD">{s.sucursal.codigo}</td>
                                        <td data-label="SUCURSAL">
                                            {s.sucursal.municipio} - {s.sucursal.direccion}
                                        </td>
                                        <td data-label="CANTIDAD" style={{textAlign: 'right'}}>
                                            {
                                                prod.incluirCantidad ?
                                                    (
                                                        <FormControl fullWidth component={'div'}>
                                                            <MyInputLabel shrink>Cantidad</MyInputLabel>
                                                            <InputNumber
                                                                min={0}
                                                                placeholder={'0.00'}
                                                                value={prod.variante.inventario[s.sucursal.codigo].stock}
                                                                onFocus={handleSelect}
                                                                onChange={(stock: number) => {
                                                                    const newArray = [...prod.variante.inventario];
                                                                    newArray[index] = {
                                                                        sucursal: s.sucursal,
                                                                        stock
                                                                    }
                                                                    dispatch(setProducto({
                                                                        ...prod,
                                                                        variante: resetVarianteStock(prod.variante, s.sucursal.codigo, stock),
                                                                        variantes: resetVariantesStock(prod.variantes, s.sucursal.codigo, stock)
                                                                    }))
                                                                }}
                                                                formatter={numberWithCommas}
                                                            />
                                                        </FormControl>
                                                    )
                                                    : (
                                                        <Typography variant="subtitle2">No medido</Typography>
                                                    )
                                            }
                                        </td>
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

export default ProductoPrecio;
