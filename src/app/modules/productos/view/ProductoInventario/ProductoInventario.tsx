import React, {ChangeEvent, FunctionComponent} from 'react';
import {Checkbox, FormControl, FormControlLabel, Grid, TextField, Typography} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {useAppSelector} from "../../../../hooks";
import {selectProducto, setProducto} from "../../slices/productos/producto.slice";
import InputNumber from "rc-input-number";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import {genReplaceEmpty, handleSelect, isEmptyValue} from "../../../../utils/helper";
import {MyInputLabel} from "../../../../base/components/MyInputs/MyInputLabel";
import {apiSucursales} from "../../../sucursal/api/sucursales.api";
import {SucursalProps} from "../../../sucursal/interfaces/sucursal";
import {useDispatch} from "react-redux";
import {sortBy} from "lodash";
import {useQuery} from "@tanstack/react-query";

interface OwnProps {

}

type Props = OwnProps;

const ProductoInventario: FunctionComponent<Props> = (props) => {
    const prod = useAppSelector(selectProducto)
    const dispatch = useDispatch()

    const crearInventario = (data: SucursalProps[]): Array<any> => {
        return sortBy(data, 'codigo').map(sucursal => ({
            sucursal,
            stock: genReplaceEmpty(prod.variante.inventario.find(inv => inv.sucursal.codigo == sucursal.codigo)?.stock, 0)
        }))
    }

    const {data: sucursales} = useQuery<SucursalProps[], Error>(['sucursales', prod], async () => {
        const data = await apiSucursales()
        if (data.length > 0) {
            if (prod.variante.inventario.length === 0) {
                const inventario = crearInventario(data)
                dispatch(setProducto({
                    ...prod,
                    variante: {...prod.variante, inventario}
                }))
            }
        }
        return data || []
    }, {keepPreviousData: true})

    return (
        <SimpleCard title={'INVENTARIO'}>
            <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth>
                        <TextField
                            label="SKU (Código de producto)"
                            value={prod.variante.codigoProducto}
                            onChange={(e) => {
                                dispatch(setProducto({
                                    ...prod,
                                    variante: {...prod.variante, codigoProducto: e.target.value},
                                    variantes: prod.variantes.map((vs, index) => ({
                                        ...vs,
                                        codigoProducto: !isEmptyValue(e.target.value) ? `${e.target.value}-${index + 1}` : e.target.value
                                    }))
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
                            value={prod.variante.codigoBarras || ''}
                            onChange={(e) => {
                                dispatch(setProducto({
                                    ...prod,
                                    variante: {...prod.variante, codigoBarras: e.target.value},
                                    variantes: prod.variantes.map((vs, index) => ({
                                        ...vs,
                                        codigoBarras: !isEmptyValue(e.target.value) ? `${e.target.value}-${index + 1}` : e.target.value || ''
                                    }))
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
                                    checked={prod.variante.incluirCantidad}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        dispatch(setProducto({
                                            ...prod,
                                            variante: {...prod.variante, incluirCantidad: e.target.checked},
                                            variantes: prod.variantes.map(pvs => ({
                                                ...pvs,
                                                incluirCantidad: e.target.checked
                                            }))
                                        }))

                                    }}
                                />
                            }
                            label="¿Incluir cantidad al inventario?"/>
                    </FormControl>
                    {
                        prod.variante.incluirCantidad && (
                            <>
                                <br/>
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!prod.variante.verificarStock}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    dispatch(setProducto({
                                                        ...prod,
                                                        variante: {...prod.variante, verificarStock: !e.target.checked},
                                                        variantes: prod.variantes.map(vs => ({
                                                            ...vs,
                                                            verificarStock: !e.target.checked
                                                        }))
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
                        &nbsp;Cantidad
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
                                sucursales &&
                                sucursales.map((s, index: number) => (
                                    <tr key={s.codigo}>
                                        <td data-label="COD">{s.codigo}</td>
                                        <td data-label="SUCURSAL">
                                            {s.municipio} - {s.direccion}
                                        </td>
                                        <td data-label="CANTIDAD" style={{textAlign: 'right'}}>
                                            {
                                                prod.variante.incluirCantidad ?
                                                    (
                                                        <FormControl fullWidth component={'div'}>
                                                            <MyInputLabel shrink>Cantidad</MyInputLabel>
                                                            <InputNumber
                                                                min={0}
                                                                placeholder={'0.00'}
                                                                value={genReplaceEmpty(prod.variante.inventario.find(inv => inv.sucursal.codigo === s.codigo)?.stock, 0)}
                                                                onFocus={handleSelect}
                                                                onChange={(stock: number) => {
                                                                    dispatch(setProducto({
                                                                        ...prod,
                                                                        variante: {
                                                                            ...prod.variante,
                                                                            inventario: prod.variante.inventario.map(pvi => {
                                                                                return pvi.sucursal.codigo === s.codigo ? {
                                                                                    ...pvi,
                                                                                    stock
                                                                                } : pvi
                                                                            })
                                                                        },
                                                                        variantes: prod.variantes.map(pvs => {
                                                                            return {
                                                                                ...pvs,
                                                                                inventario: pvs.inventario.map(pvsi => ({
                                                                                    ...pvsi,
                                                                                    stock
                                                                                }))
                                                                            }
                                                                        })
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

export default ProductoInventario;
