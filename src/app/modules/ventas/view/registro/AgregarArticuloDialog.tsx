import React, {FunctionComponent, useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputLabel, TextField} from "@mui/material";
import InputNumber from "rc-input-number";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import {toast} from "react-toastify";
import {nanoid} from "nanoid";

interface OwnProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: any) => void;
}

type Props = OwnProps;

const AgregarArticuloDialog: FunctionComponent<Props> = (props: Props) => {
    const {onClose, open, ...other} = props;
    const initalValues = {
        nombre: '',
        precio: 0,
        cantidad: 1
    };
    const [value, setValue] = useState(initalValues);
    useEffect(() => {
        if (open) {
            setValue(initalValues)
        }

    }, [open]);

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        let aux = true;
        if (value.nombre.trim().length === 0) {
            toast('Debe ingresar nombre del producto', {type: "error"})
            aux = false
        }
        if (value.precio === 0) {
            toast('Precio debe ser mayor a 0', {type: "error"})
            aux = false
        }
        if (value.cantidad === 0) {
            toast('Cantidad minima es 1', {type: "error"})
            aux = false
        }
        if (aux) {
            const nuevoProducto = {
                codigoProducto: nanoid(5),
                titulo: value.nombre,
                nombre: value.nombre,
                precio: value.precio,
                inputCantidad: value.cantidad,
                inputPrecio: value.precio,
                inputDescuento: 0,
                inventario: [],
                unidadMedida: {
                    codigoClasificador: "57",
                    descripcion: "Unidad (Bienes)"
                },
                producto: {
                    titulo: value.nombre,
                    sinProductoServicio: {
                        codigoActividad: "620000",
                        codigoProducto: "83131"
                    }
                },
                seguimientoInventario: false
            }
            onClose(nuevoProducto)
        }
    };

    return (
        <>
            <Dialog
                sx={{'& .MuiDialog-paper': {width: '80%', maxHeight: 435}}}
                maxWidth="sm"
                open={open}
                {...other}
            >
                <DialogTitle>Agregar Producto Personalizado</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{mt: 2}}>
                            <TextField
                                id="nombre"
                                label="Nombre Producto"
                                multiline
                                maxRows={4}
                                size={'small'}
                                fullWidth
                                sx={{mb: 2}}
                                value={value.nombre}
                                onChange={(e) => {
                                    setValue({...value, nombre: e.target.value})
                                }}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                            <InputLabel>
                                Precio
                            </InputLabel>
                            <InputNumber
                                min={0}
                                value={value.precio}
                                onChange={(e: number) => setValue({...value, precio: e})}
                                formatter={numberWithCommas}
                                style={{width: '100%'}}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                            <InputLabel>
                                Cantidad
                            </InputLabel>
                            <InputNumber
                                min={1}
                                value={value.cantidad}
                                onChange={(e: number) => setValue({...value, cantidad: e})}
                                formatter={numberWithCommas}
                                style={{width: '100%'}}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button onClick={handleOk} style={{marginRight: 15}}>Registrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AgregarArticuloDialog;
