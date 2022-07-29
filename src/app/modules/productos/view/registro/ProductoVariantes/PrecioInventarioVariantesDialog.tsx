import React, {ChangeEvent, FunctionComponent, useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
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
import {genReplaceEmpty, handleSelect, isEmptyValue} from "../../../../../utils/helper";
import {numberWithCommas} from "../../../../../base/components/MyInputs/NumberInput";
import {apiSinUnidadMedida} from "../../../../sin/api/sinUnidadMedida.api";
import {swalException} from "../../../../../utils/swal";
import {ProductoVarianteInputProps} from "../../../interfaces/producto.interface";
import {notError} from "../../../../../utils/notification";
import {apiSucursales} from "../../../../sucursal/api/sucursales.api";
import {SucursalProps} from "../../../../sucursal/interfaces/sucursal";
import SimpleCard from "../../../../../base/components/Template/Cards/SimpleCard";

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
    const [sucursales, setSucursales] = useState<SucursalProps[]>([]);
    const [data, setData] = useState<ProductoVarianteInputProps>(variante);
    const [inputError, setInputError] = useState<any>({});

    const fetchUnidadesMedida = async () => {
        await apiSinUnidadMedida().then((data) => {
            setUnidadesMedida(data)
        }).catch(err => {
            swalException(err)
            return []
        })
    }

    const fetchSucursales = async () => {
        try {
            const sucursales = await apiSucursales()
            if (sucursales.length > 0) {
                setSucursales(sucursales)
            } else {
                throw new Error('No se ha podido cargar los datos de la sucursal, vuelva a intentar')
            }
        } catch (e: any) {
            swalException(e)
        }
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
        if (isEmptyValue(data.codigoProducto)) {
            notError('Debe ingresar un codigo de producto válido')
            return
        }
        onClose(data)
    }

    useEffect(() => {
        fetchSucursales().then()
        fetchUnidadesMedida().then()
    }, []);
    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: 850}}}
            maxWidth="md"
            open={open}
            {...other}
        >
            <DialogTitle>Modificar Variante "{data.titulo}"</DialogTitle>
            <DialogContent dividers>
                <Grid container rowSpacing={2}>
                    <Grid item>
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
                            </Grid>
                        </SimpleCard>
                    </Grid>

                    <Grid item>
                        <SimpleCard title={'INVENTARIO'}>
                            <Grid container columnSpacing={3} rowSpacing={{xs: 2, sm: 2, md: 0, lg: 0}}>
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
                                            value={data.codigoBarras || ''}
                                            onChange={(e) => {
                                                setData({...data, codigoBarras: e.target.value})
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={8} md={8} xs={12}>
                                    <FormControl>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={data.incluirCantidad}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        setData({...data, incluirCantidad: e.target.checked})
                                                    }}
                                                />
                                            }
                                            label="¿Incluir cantidad al inventario?"/>
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
                                                sucursales.length > 0 &&
                                                sucursales.map((s, index: number) => (
                                                    <tr key={s.codigo}>
                                                        <td data-label="COD">{s.codigo}</td>
                                                        <td data-label="SUCURSAL">
                                                            {s.municipio} - {s.direccion}
                                                        </td>
                                                        <td data-label="CANTIDAD" style={{textAlign: 'right'}}>
                                                            {
                                                                data.incluirCantidad ?
                                                                    (
                                                                        <FormControl
                                                                            error={genReplaceEmpty(data.inventario[s.codigo]?.stock, 0) < 1}
                                                                            fullWidth component={'div'}>
                                                                            <MyInputLabel shrink>Cantidad</MyInputLabel>
                                                                            <InputNumber
                                                                                min={0}
                                                                                style={{color: 'red'}}
                                                                                placeholder={'0.00'}
                                                                                value={genReplaceEmpty(data.inventario[s.codigo]?.stock, 0)}
                                                                                onFocus={handleSelect}
                                                                                onChange={(precioComparacion: number) => {
                                                                                    const newArray = [...data.inventario];
                                                                                    newArray[index] = {
                                                                                        sucursal: s,
                                                                                        stock: precioComparacion
                                                                                    }
                                                                                    setData({
                                                                                        ...data,
                                                                                        inventario: newArray
                                                                                    })
                                                                                }}
                                                                                formatter={numberWithCommas}
                                                                            />
                                                                            <FormHelperText id="component-error-text">Valor
                                                                                mayor a 0</FormHelperText>
                                                                        </FormControl>
                                                                    )
                                                                    : (
                                                                        <Typography variant="subtitle2">No
                                                                            medido</Typography>
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
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button autoFocus color={'error'} variant={'contained'} onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    style={{marginRight: 25}} variant={'contained'}>Guardar Cambios</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PrecioInventarioVariantesDialog;
