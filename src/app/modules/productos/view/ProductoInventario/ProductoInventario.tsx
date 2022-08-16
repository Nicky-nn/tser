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
import {ProductoInputProps} from "../../interfaces/producto.interface";
import {Controller, useFieldArray, UseFormReturn} from "react-hook-form";

interface OwnProps {
    form: UseFormReturn<ProductoInputProps>
}

type Props = OwnProps;

const ProductoInventario: FunctionComponent<Props> = (props) => {
    const {
        form: {
            control,
            setValue,
            getValues,
            watch,
            formState: {errors}
        }
    } = props
    const {replace} = useFieldArray({
        control,
        name: "variantes", // unique name for your Field Array
    });
    const [varianteWatch, variantesWatch] = watch(['variante', 'variantes']);

    const crearInventario = (data: SucursalProps[]): Array<any> => {
        return sortBy(data, 'codigo').map(sucursal => ({
            sucursal,
            stock: genReplaceEmpty(varianteWatch.inventario.find(inv => inv.sucursal.codigo == sucursal.codigo)?.stock, 0)
        }))
    }

    const {data: sucursales} = useQuery<SucursalProps[], Error>(['sucursales'], async () => {
        const data = await apiSucursales()
        if (data.length > 0) {
            if (getValues('variante.inventario').length === 0) {
                const inventario = crearInventario(data)
                setValue('variante.inventario', inventario)
            }
        }
        return data || []
    }, {keepPreviousData: true})

    return (
        <SimpleCard title={'INVENTARIO'}>
            <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
                <Grid item lg={4} md={4} xs={12}>
                    <Controller
                        control={control}
                        name={'variante.codigoProducto'}
                        render={({field}) => (
                            <FormControl fullWidth
                                         error={Boolean(errors.variante?.codigoProducto)}
                            >
                                <TextField
                                    {...field}
                                    label="SKU (Código de producto)"
                                    name={'variante.codigoProducto'}
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e.target.value)
                                    }}
                                    onBlur={(e) => {
                                        if (variantesWatch.length > 0) {
                                            replace(variantesWatch.map((vs, index) => ({
                                                ...vs,
                                                codigoProducto: !isEmptyValue(e.target.value) ? `${e.target.value}-${index + 1}` : e.target.value
                                            })))
                                        }
                                    }}
                                    variant="outlined"
                                    size="small"
                                />
                                <FormHelperText>{errors.variante?.codigoProducto?.message}</FormHelperText>
                            </FormControl>
                        )}/>

                </Grid>

                <Grid item lg={8} md={8} xs={12}>
                    <Controller
                        control={control}
                        name={'variante.codigoBarras'}
                        render={({field}) => (
                            <FormControl fullWidth>
                                <TextField
                                    {...field}
                                    label="Código de Barras"
                                    value={field.value || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        field.onChange(e.target.value)
                                    }}
                                    onBlur={(e) => {
                                        if (variantesWatch.length > 0) {
                                            replace(variantesWatch.map((vs, index) => ({
                                                ...vs,
                                                codigoBarras: !isEmptyValue(e.target.value) ? `${e.target.value}-${index + 1}` : e.target.value
                                            })))
                                        }
                                    }}
                                    variant="outlined"
                                    size="small"
                                />
                            </FormControl>
                        )}
                    />

                </Grid>

                <Grid item lg={8} md={12} xs={12}>
                    <Controller
                        control={control}
                        name={'variante.incluirCantidad'}
                        render={({field}) => (
                            <FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            {...field}
                                            checked={field.value}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                field.onChange(e.target.checked)
                                                // Actulizamos las variantes de los stocks
                                                replace(variantesWatch.map(v => ({
                                                    ...v,
                                                    incluirCantidad: e.target.checked
                                                })))
                                            }}
                                        />
                                    }
                                    label="¿Incluir cantidad al inventario?"/>
                            </FormControl>
                        )}
                    />

                    {
                        varianteWatch.incluirCantidad && (
                            <>
                                <br/>
                                <Controller
                                    control={control}
                                    name={'variante.verificarStock'}
                                    render={({field}) => (
                                        <FormControl>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        {...field}
                                                        checked={!field.value}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            field.onChange(!e.target.checked)
                                                            // Actulizamos las variantes de los stocks
                                                            replace(variantesWatch.map(v => ({
                                                                ...v,
                                                                verificarStock: !e.target.checked
                                                            })))
                                                        }}
                                                    />
                                                }
                                                label="¿Continuar venta aun si el item este agotado?"/>
                                        </FormControl>
                                    )}
                                />
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
                                                varianteWatch.incluirCantidad ?
                                                    (

                                                        <FormControl fullWidth component={'div'}>
                                                            <MyInputLabel shrink>Cantidad</MyInputLabel>
                                                            <InputNumber
                                                                min={0}
                                                                placeholder={'0.00'}
                                                                value={genReplaceEmpty(varianteWatch.inventario.find(inv => inv.sucursal.codigo === s.codigo)?.stock, 0)}
                                                                onFocus={handleSelect}
                                                                onChange={(stock: number) => {
                                                                    setValue('variante.inventario', varianteWatch.inventario.map(item => {
                                                                        return item.sucursal.codigo === s.codigo ? {
                                                                            ...item,
                                                                            stock
                                                                        } : item
                                                                    }))
                                                                }}
                                                                onBlur={(eventStock) => {
                                                                    if (variantesWatch.length > 0) {
                                                                        // Actualizamos todos los stock de las variantes, en caso tuviera
                                                                        replace(variantesWatch.map(item => ({
                                                                            ...item,
                                                                            inventario: item.inventario.map(vi => ({
                                                                                ...vi,
                                                                                stock: parseFloat(eventStock.target.value)
                                                                            }))
                                                                        })))
                                                                    }
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