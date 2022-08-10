// noinspection DuplicatedCode

import React, {ChangeEvent, FunctionComponent} from 'react';
import {Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, TextField, Typography} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import InputNumber from "rc-input-number";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import {genReplaceEmpty, handleSelect, isEmptyValue} from "../../../../utils/helper";
import {MyInputLabel} from "../../../../base/components/MyInputs/MyInputLabel";
import {apiSucursales} from "../../../sucursal/api/sucursales.api";
import {SucursalProps} from "../../../sucursal/interfaces/sucursal";
import {sortBy} from "lodash";
import {useQuery} from "@tanstack/react-query";
import {FormikProps} from "formik";
import {prodMap, ProductoInputProps} from "../../interfaces/producto.interface";

interface OwnProps {
    formik: FormikProps<ProductoInputProps>
}

type Props = OwnProps;

const ProductoInventario: FunctionComponent<Props> = (props) => {
    const {formik} = props;
    const {values, setFieldValue} = formik

    const crearInventario = (data: SucursalProps[]): Array<any> => {
        return sortBy(data, 'codigo').map(sucursal => ({
            sucursal,
            stock: genReplaceEmpty(values.variante.inventario.find(inv => inv.sucursal.codigo == sucursal.codigo)?.stock, 0)
        }))
    }

    const {data: sucursales} = useQuery<SucursalProps[], Error>(['sucursales'], async () => {
        const data = await apiSucursales()
        if (data.length > 0) {
            if (values.variante.inventario.length === 0) {
                const inventario = crearInventario(data)
                setFieldValue(prodMap.variante, {...values.variante, inventario})
            }
        }
        return data || []
    }, {keepPreviousData: true})

    return (
        <SimpleCard title={'INVENTARIO'}>
            <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
                <Grid item lg={4} md={4} xs={12}>
                    <FormControl fullWidth
                                 error={Boolean(formik.errors.variante?.codigoProducto)}
                    >
                        <TextField
                            label="SKU (Código de producto)"
                            name={'variante.codigoProducto'}
                            value={values.variante.codigoProducto}
                            onChange={(e) => {
                                setFieldValue(prodMap.variante, {
                                    ...values.variante,
                                    codigoProducto: e.target.value
                                })
                                setFieldValue(prodMap.variantes, values.variantes.map((vs, index) => ({
                                    ...vs,
                                    codigoProducto: !isEmptyValue(e.target.value) ? `${e.target.value}-${index + 1}` : e.target.value
                                })))
                            }}
                            variant="outlined"
                            size="small"
                        />
                        <FormHelperText>{formik.errors.variante?.codigoProducto}</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item lg={8} md={8} xs={12}>
                    <FormControl fullWidth>
                        <TextField
                            label="Código de Barras"
                            name={'variante.codigoBarras'}
                            value={values.variante.codigoBarras || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                setFieldValue(prodMap.variante, {
                                    ...values.variante,
                                    codigoBarras: e.target.value
                                })
                                setFieldValue(prodMap.variantes, values.variantes.map((vs, index) => ({
                                    ...vs,
                                    codigoBarras: !isEmptyValue(e.target.value) ? `${e.target.value}-${index + 1}` : e.target.value
                                })))
                                /*
                                dispatch(setProducto({
                                    ...prod,
                                    variante: {...prod.variante, codigoBarras: e.target.value},
                                    variantes: prod.variantes.map((vs, index) => ({
                                        ...vs,
                                        codigoBarras: !isEmptyValue(e.target.value) ? `${e.target.value}-${index + 1}` : e.target.value || ''
                                    }))
                                }))
                                */
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
                                    name={'variante.incluirCantidad'}
                                    checked={values.variante.incluirCantidad}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setFieldValue(prodMap.variante, {
                                            ...values.variante,
                                            incluirCantidad: e.target.checked
                                        })
                                        setFieldValue(prodMap.variantes, values.variantes.map((vs, index) => ({
                                            ...vs,
                                            incluirCantidad: e.target.checked
                                        })))
                                        /*
                                        dispatch(setProducto({
                                            ...prod,
                                            variante: {...prod.variante, incluirCantidad: e.target.checked},
                                            variantes: prod.variantes.map(pvs => ({
                                                ...pvs,
                                                incluirCantidad: e.target.checked
                                            }))
                                        }))
                                         */
                                    }}
                                />
                            }
                            label="¿Incluir cantidad al inventario?"/>
                    </FormControl>
                    {
                        values.variante.incluirCantidad && (
                            <>
                                <br/>
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!values.variante.verificarStock}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue(prodMap.variante, {
                                                        ...values.variante,
                                                        verificarStock: !e.target.checked
                                                    })
                                                    setFieldValue(prodMap.variantes, values.variantes.map((vs, index) => ({
                                                        ...vs,
                                                        verificarStock: !e.target.checked
                                                    })))
                                                    /*
                                                    dispatch(setProducto({
                                                        ...prod,
                                                        variante: {...prod.variante, verificarStock: !e.target.checked},
                                                        variantes: prod.variantes.map(vs => ({
                                                            ...vs,
                                                            verificarStock: !e.target.checked
                                                        }))
                                                    }))
                                                     */
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
                                                values.variante.incluirCantidad ?
                                                    (
                                                        <FormControl fullWidth component={'div'}>
                                                            <MyInputLabel shrink>Cantidad</MyInputLabel>
                                                            <InputNumber
                                                                min={0}
                                                                placeholder={'0.00'}
                                                                value={genReplaceEmpty(values.variante.inventario.find(inv => inv.sucursal.codigo === s.codigo)?.stock, 0)}
                                                                onFocus={handleSelect}
                                                                onChange={(stock: number) => {
                                                                    setFieldValue(prodMap.variante, {
                                                                        ...values.variante,
                                                                        inventario: values.variante.inventario.map(pvi => {
                                                                            return pvi.sucursal.codigo === s.codigo ? {
                                                                                ...pvi,
                                                                                stock
                                                                            } : pvi
                                                                        })
                                                                    })
                                                                    setFieldValue(prodMap.variantes, values.variantes.map(pvs => {
                                                                        return {
                                                                            ...pvs,
                                                                            inventario: pvs.inventario.map(pvsi => ({
                                                                                ...pvsi,
                                                                                stock
                                                                            }))
                                                                        }
                                                                    }))
                                                                    /*
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
                                                                     */
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
