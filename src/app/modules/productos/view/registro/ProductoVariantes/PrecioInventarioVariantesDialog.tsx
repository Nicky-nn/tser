import React, {FunctionComponent, useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import {SelectInputLabel} from "../../../../../base/components/ReactSelect/SelectInputLabel";
import Select from "react-select";
import {SinUnidadMedidaProps} from "../../../../sin/interfaces/sin.interface";
import {reactSelectStyles} from "../../../../../base/components/MySelect/ReactSelect";
import {MyInputLabel} from "../../../../../base/components/MyInputs/MyInputLabel";
import InputNumber from "rc-input-number";
import {handleSelect, isEmptyValue} from "../../../../../utils/helper";
import {numberWithCommas} from "../../../../../base/components/MyInputs/NumberInput";
import {apiSinUnidadMedida} from "../../../../sin/api/sinUnidadMedida.api";
import {swalException} from "../../../../../utils/swal";
import {ProductoVarianteInputProps} from "../../../interfaces/producto.interface";
import {notError} from "../../../../../utils/notification";

interface OwnProps {
    variante: ProductoVarianteInputProps;
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: any) => void;
}

type Props = OwnProps;

const PrecioInventarioVariantesDialog: FunctionComponent<Props> = (props: Props) => {
    const {variante, onClose, open, ...other} = props
    const [unidadesMedida, setUnidadesMedida] = useState<SinUnidadMedidaProps[]>([]);
    const [data, setData] = useState<ProductoVarianteInputProps>(variante);

    const fetchUnidadesMedida = async () => {
        await apiSinUnidadMedida().then((data) => {
            setUnidadesMedida(data)
        }).catch(err => {
            swalException(err)
            return []
        })
    }
    useEffect(() => {
        setData(variante)
    }, [open]);

    const handleCancel = () => {
        onClose();
    };

    // REGISTRO Y VALIDACION DE DATOS
    const handleSubmit = async (): Promise<void> => {
        // Verificamos algunos campos
        if (data.costo > data.precio) {
            notError('El costo debe ser menor al precio')
            return
        }
        if(isEmptyValue(data.codigoProducto)) {
            notError('Debe ingresar un codigo de producto válido')
            return
        }
        onClose(data)
    }

    useEffect(() => {
        fetchUnidadesMedida().then()
    }, []);
    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: 500}}}
            maxWidth="md"
            open={open}
            {...other}
        >
            <DialogTitle>Modificar Variante "{data.titulo}"</DialogTitle>
            <DialogContent dividers>
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
                                value={data.unidadMedida}
                                onChange={async (unidadMedida: any) => {
                                    setData({...data, unidadMedida})
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
                                value={data.precio}
                                onFocus={handleSelect}
                                onChange={(precio: number) => {
                                    setData({...data, precio})
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
                                value={data.precioComparacion}
                                onFocus={handleSelect}
                                onChange={(precioComparacion: number) => {
                                    setData({...data, precioComparacion})
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
                                value={data.costo}
                                onFocus={handleSelect}
                                onChange={(costo: number) => {
                                    setData({...data, costo})
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
                                value={data.codigoProducto}
                                onChange={(e) => {
                                    setData({...data, codigoProducto: e.target.value})
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
                                value={data.codigoBarras}
                                onChange={(e) => {
                                    setData({...data, codigoBarras: e.target.value})
                                }}
                                variant="outlined"
                                size="small"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item lg={12} md={12} xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
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
                                    data.inventario.map((s, index: number) => (
                                        <tr key={s.sucursal.codigo}>
                                            <td data-label="COD">{s.sucursal.codigo}</td>
                                            <td data-label="SUCURSAL">
                                                {s.sucursal.municipio} - {s.sucursal.direccion}
                                            </td>
                                            <td data-label="CANTIDAD" style={{textAlign: 'right'}}>
                                                {
                                                    variante.incluirCantidadInventario ?
                                                        (
                                                            <FormControl fullWidth component={'div'}>
                                                                <MyInputLabel shrink>Cantidad</MyInputLabel>
                                                                <InputNumber
                                                                    min={0}
                                                                    placeholder={'0.00'}
                                                                    value={data.inventario[s.sucursal.codigo].stock}
                                                                    onFocus={handleSelect}
                                                                    onChange={(precioComparacion: number) => {
                                                                        const newArray = [...data.inventario];
                                                                        newArray[index] = {
                                                                            sucursal: s.sucursal,
                                                                            stock: precioComparacion
                                                                        }
                                                                        setData({...data, inventario: newArray})
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
            </DialogContent>
            <DialogActions>
                <Button autoFocus color={'error'} variant={'outlined'} onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    style={{marginRight: 15}} variant={'outlined'}>Guardar Cambios</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PrecioInventarioVariantesDialog;
