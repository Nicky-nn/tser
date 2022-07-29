import React, {ChangeEvent, FunctionComponent, useEffect, useState} from 'react';
import {Checkbox, FormControl, FormControlLabel, Grid, TextField, Typography} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {useAppSelector} from "../../../../hooks";
import {selectProducto, setProducto} from "../../slices/productos/producto.slice";
import InputNumber from "rc-input-number";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import {genReplaceEmpty, handleSelect, isEmptyValue} from "../../../../utils/helper";
import {MyInputLabel} from "../../../../base/components/MyInputs/MyInputLabel";
import {swalException} from "../../../../utils/swal";
import {apiSucursales} from "../../../sucursal/api/sucursales.api";
import {SucursalProps} from "../../../sucursal/interfaces/sucursal";
import {useDispatch} from "react-redux";
import {sortBy} from "lodash";
import {apiSinUnidadMedida} from "../../../sin/api/sinUnidadMedida.api";
import {SinUnidadMedidaProps} from "../../../sin/interfaces/sin.interface";

interface OwnProps {
}

type Props = OwnProps;

const ProductoInventario: FunctionComponent<Props> = (props) => {
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

    const fetchSucursales = async () => {
        try {
            const sucursales = await apiSucursales()
            if (sucursales.length > 0) {
                setSucursales(sucursales)
                if (prod.variante.inventario.length === 0) {
                    const inventario = resetInventario(sucursales)
                    dispatch(setProducto({
                        ...prod,
                        variante: {...prod.variante, inventario}
                    }))
                }
            } else {
                throw new Error('No se ha podido cargar los datos de la sucursal, vuelva a intentar')
            }
        } catch (e: any) {
            swalException(e)
            setError(e.message)
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
        fetchSucursales().then()
        fetchUnidadesMedida().then()
    }, []);

    if (isError) {
        return <h1>Ocurrio un error</h1>
    }

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
                                    variante: {...prod.variante, codigoProducto: e.target.value}
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
                                sucursales.length > 0 &&
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
