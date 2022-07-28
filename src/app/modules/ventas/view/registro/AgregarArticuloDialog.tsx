import React, {FunctionComponent, useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    TextField
} from "@mui/material";
import InputNumber from "rc-input-number";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import {toast} from "react-toastify";
import {genRandomString, genReplaceEmpty, handleFocus, isEmptyValue} from "../../../../utils/helper";
import {apiProductoServicioUnidadMedida} from "../../../productos/api/productoServicioUnidadMedida.api";
import AlertError from "../../../../base/components/Alert/AlertError";
import {SinProductoServicioProps, SinUnidadMedidaProps} from "../../../sin/interfaces/sin.interface";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import Select from "react-select";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import {
    ProductosVariantesProps,
    ProductoVarianteInputTempProps
} from "../../../productos/interfaces/producto.interface";
import useAuth from "../../../../base/hooks/useAuth";

interface OwnProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: any) => void;
    codigoActividad: string
}

type Props = OwnProps;


const AgregarArticuloDialog: FunctionComponent<Props> = (props: Props) => {
    const {onClose, codigoActividad, open, ...other} = props;
    const {user} = useAuth()
    const initialValues = {
        id: genRandomString(5),
        codigoProducto: genRandomString(10),
        nombre: '',
        precio: 0,
        titulo: '',
        inventario: [{
            sucursal: user.sucursal,
            stock: 0
        }],
        costo: 0,
        sinProductoServicio: {} as SinProductoServicioProps,
        unidadMedida: {} as SinUnidadMedidaProps,
        precioComparacion: 0,
        disponibleParaVenta: false,
        codigoBarras: null
    }
    const [inputForm, setInputForm] = useState<ProductoVarianteInputTempProps>(initialValues);
    const [unidadesMedida, setUnidadesMedida] = useState<SinUnidadMedidaProps[]>([]);
    const [productosServicios, setProductosServicios] = useState<SinProductoServicioProps[]>([]);

    const [isError, setIsError] = useState(null);

    const handleCancel = () => {
        onClose();
    };


    const handleOk = () => {
        let aux = true;
        if (inputForm.nombre.trim().length === 0) {
            toast('Debe ingresar nombre del producto', {type: "error"})
            aux = false
        }
        if (inputForm.precio === 0) {
            toast('Precio debe ser mayor a 0', {type: "error"})
            aux = false
        }
        if (isEmptyValue(inputForm.unidadMedida)) {
            toast('Seleccione unidad de medida', {type: "error"})
            aux = false
        }
        if (isEmptyValue(inputForm.sinProductoServicio)) {
            toast('Seleccione producto para homologación', {type: "error"})
            aux = false
        }
        if (aux) {
            const nuevoDetalle: ProductosVariantesProps = {
                usucre: user.nombres,
                _id: inputForm.id,
                sinProductoServicio: inputForm.sinProductoServicio,
                titulo: inputForm.titulo,
                descripcion: inputForm.nombre,
                descripcionHtml: '<p></p>',
                tipoProducto: null,
                totalVariantes: 1,
                varianteUnica: true,
                incluirCantidad: false,
                verificarStock: false,
                proveedor: null,
                opcionesProducto: [],
                inventario: inputForm.inventario,
                variantes: {
                    id: inputForm.id,
                    codigoProducto: inputForm.codigoProducto,
                    titulo: inputForm.titulo,
                    nombre: inputForm.nombre,
                    disponibleParaVenta: inputForm.disponibleParaVenta,
                    codigoBarras: null,
                    precio: inputForm.precio,
                    costo: inputForm.costo,
                    precioComparacion: inputForm.precioComparacion!,
                    incluirStock: false,
                    inventario: inputForm.inventario,
                    peso: 0,
                    unidadMedida: inputForm.unidadMedida!
                }
            }
            onClose(nuevoDetalle)
        }
    };


    // Obtenemos los datos del producto homologado y unidades de medida
    const fetchProductosServiciosUnidadesMedida = async (codigoActividad: string) => {
        try {
            const resp = await apiProductoServicioUnidadMedida(codigoActividad)
            setUnidadesMedida(resp.sinUnidadMedida)
            setProductosServicios(resp.sinProductoServicioPorActividad)
            console.log(resp)
        } catch (e: any) {
            setIsError(e.message)
        }
    }
    useEffect(() => {
        fetchProductosServiciosUnidadesMedida(codigoActividad).then()
    }, [codigoActividad]);

    useEffect(() => {
        if (open) {
            setInputForm(initialValues)
        }
    }, [open]);

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
                    {!isError ? (
                        <Grid container spacing={2.5}>
                            <Grid item lg={12} md={12} xs={12}>
                                <FormControl fullWidth component={'div'}>
                                    <SelectInputLabel shrink>
                                        Tipo de Producto Homologado
                                    </SelectInputLabel>
                                    <Select<SinProductoServicioProps>
                                        styles={reactSelectStyles}
                                        menuPosition={'fixed'}
                                        name="productoServicio"
                                        placeholder={'Seleccione producto para homologación'}
                                        value={genReplaceEmpty(inputForm.sinProductoServicio, null)}
                                        onChange={(resp) => {
                                            setInputForm({
                                                ...inputForm,
                                                sinProductoServicio: resp || {} as SinProductoServicioProps
                                            })
                                        }}
                                        options={productosServicios}
                                        getOptionValue={(ps) => ps.codigoProducto}
                                        getOptionLabel={(ps) => `${ps.codigoProducto} - ${ps.descripcionProducto}`}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item lg={12} md={12} xs={12}>
                                <FormControl fullWidth component={'div'}>
                                    <SelectInputLabel shrink>
                                        Unidad Medida
                                    </SelectInputLabel>
                                    <Select<SinUnidadMedidaProps>
                                        styles={reactSelectStyles}
                                        menuPosition={'fixed'}
                                        name="unidadMedida"
                                        placeholder={'Seleccione la unidad de medida'}
                                        value={genReplaceEmpty(inputForm.unidadMedida, null)}
                                        onChange={(resp) => {
                                            setInputForm({
                                                ...inputForm,
                                                unidadMedida: resp || {} as SinUnidadMedidaProps
                                            })
                                        }}
                                        options={unidadesMedida}
                                        getOptionValue={(ps) => ps.codigoClasificador}
                                        getOptionLabel={(ps) => `${ps.codigoClasificador} - ${ps.descripcion}`}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    id="nombre"
                                    label="Nombre / Descripción Producto"
                                    multiline
                                    minRows={3}
                                    maxRows={6}
                                    size={'small'}
                                    fullWidth
                                    value={inputForm.nombre}
                                    onChange={(e) => {
                                        setInputForm({
                                            ...inputForm,
                                            nombre: e.target.value,
                                            titulo: e.target.value
                                        })
                                    }}
                                />
                            </Grid>

                            <Grid item lg={12} md={12} xs={12}>
                                <InputLabel>
                                    Precio
                                </InputLabel>
                                <InputNumber
                                    min={0}
                                    value={inputForm.precio}
                                    onFocus={handleFocus}
                                    onChange={(precio: number) => setInputForm({...inputForm, precio})}
                                    formatter={numberWithCommas}
                                    style={{width: '100%'}}
                                />
                            </Grid>
                        </Grid>
                    ) : (<AlertError mensaje={isError}/>)}

                </DialogContent>
                <DialogActions sx={{mb: 1}}>
                    <Button variant={'outlined'} color={'error'} autoFocus onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button variant={'outlined'} onClick={handleOk}
                            style={{marginRight: 18}}
                    >Registrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AgregarArticuloDialog;
