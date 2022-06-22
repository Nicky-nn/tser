import {
    Avatar,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Typography
} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {FC, Fragment, useEffect, useState} from "react";
import {useAppSelector} from "../../../../hooks";
import {useDispatch} from "react-redux";
import {ProductoVarianteProps} from "../../../productos/api/producto.api";
import {fetchProductoBusqueda} from "../../../productos/api/productoBusqueda.api";
import Autocomplete from "@mui/material/Autocomplete";
import {
    setDeleteItem,
    setDetalleFactura,
    setFacturaMontoPagar,
    setItemModificado
} from "../../slices/facturacion/factura.slice";
import {Delete, TextIncrease} from "@mui/icons-material";
import {toast} from "react-toastify";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import InputNumber from 'rc-input-number';
import {FacturaDetalleProps} from "../../interfaces/factura";

const data: any = []


export const DetalleTransaccionComercial: FC = () => {
    const factura = useAppSelector(state => state.factura);
    const dispatch = useDispatch();
    const [open, setOpen] = useState<boolean>(false);
    const [productos, setProductos] = useState<ProductoVarianteProps[]>([]);
    const loading = open && productos.length === 0;
    const handleFocus = (event: any) => event.target.select();

    useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        (async () => {
            if (active) {
                const resp = await fetchProductoBusqueda('manga')
                setProductos(resp);
            }
        })();
        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!open) {
            setProductos([]);
        }
    }, [open]);

    const handleChange = async (event: any, newInput: any) => {
        if(newInput){
            // Verificamos si ya existe el producto
            const producto = factura.detalle.find(d => d.codigoProducto === newInput.codigoProducto);
            if (!producto) {
                dispatch(setDetalleFactura(newInput));
                dispatch(setFacturaMontoPagar())
            } else {
                toast.warn('El producto ya se adicionó')
            }
        }
    }

    const handlePrecioChange = async (item: any, value: number) => {
        if (value) {
            if (value >= 0 && value >= item.inputDescuento) {
                dispatch(setItemModificado({...item, inputPrecio: value}));
                dispatch(setFacturaMontoPagar())
            } else {
                toast.warn('El precio no puede ser menor al descuento')
            }
        }
    }
    const handleCantidadChange = async (item: any, value: number) => {
        if (value) {
            if (value >= 0) {
                dispatch(setItemModificado({...item, inputCantidad: value}));
                dispatch(setFacturaMontoPagar())
            }
        }
    }
    const handleDescuentoChange = async (item: any, inputDescuento: number) => {
        if (inputDescuento >= 0) {
            if (inputDescuento <= item.inputPrecio) {
                dispatch(setItemModificado({...item, inputDescuento}));
                dispatch(setFacturaMontoPagar())
            } else {
                toast.warn('El descuento no puede ser mayor al precio')
            }
        }
    }
    const handleDelete = (item: FacturaDetalleProps) => {
        if(item){
            dispatch(setDeleteItem(item));
            dispatch(setFacturaMontoPagar())
        }
    }
    return <>
        <SimpleCard title="Detalle transacción comercial">
            <Grid container spacing={0}>
                <Grid item xs={12} md={10}>
                    <Autocomplete
                        id="productos"
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        size={"small"}
                        defaultValue={null}
                        getOptionLabel={(option) => `${option.nombre}`}
                        options={productos}
                        loading={loading}
                        onChange={handleChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar producto..."
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        sx={{
                            marginBottom: '20px',
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                    <Button variant="outlined">Explorar Productos</Button>
                </Grid>
                <Grid item xs={12}>
                    <div className="responsive-table" style={{marginTop: 20}}>
                        <table>
                            <thead>
                            <tr>
                                <th scope="col" style={{width: 400}}>Producto</th>
                                <th scope="col" style={{width: 160}}>Cantidad</th>
                                <th scope="col" style={{width: 160}}>Precio</th>
                                <th scope="col" style={{width: 160}}>Descuento</th>
                                <th scope="col" style={{width: 150}}>SUB-Total</th>
                                <th scope="col" style={{width: 100}}>Opciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                factura.detalle.map((item, index) => {
                                    return <tr key={item.codigoProducto}>
                                        <td data-label="Producto">
                                            <List dense={true}
                                                  sx={{
                                                      width: '400%',
                                                      maxWidth: 360,
                                                      bgcolor: 'background.paper',
                                                      padding: 0
                                                  }}>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg"/>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={<Typography
                                                            variant="subtitle2">{item?.nombre || ''}</Typography>}
                                                        secondary={
                                                            <Fragment>
                                                                <Typography
                                                                    sx={{display: 'inline'}}
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                >
                                                                    {`Código: ${item.codigoProducto}`}
                                                                </Typography> <br/>
                                                                {`${item.unidadMedida.descripcion}`} <br/>
                                                                {`${item.detalleExtra}`}
                                                            </Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                        </td>
                                        <td data-label="CANTIDAD">
                                            <InputNumber
                                                min={1}
                                                max={100}
                                                value={item.inputCantidad}
                                                onFocus={handleFocus}
                                                onChange={(e: number) => handleCantidadChange(item, e)}
                                                formatter={numberWithCommas}
                                            />
                                        </td>
                                        <td data-label="PRECIO">
                                            <InputNumber
                                                min={0}
                                                value={item.inputPrecio}
                                                onFocus={handleFocus}
                                                onChange={(e: number) => handlePrecioChange(item, e)}
                                                formatter={numberWithCommas}
                                            />
                                        </td>
                                        <td data-label="DESCUENTO">
                                            <InputNumber
                                                min={0}
                                                max={item.inputPrecio - 0.1}
                                                value={item.inputDescuento}
                                                onFocus={handleFocus}
                                                onChange={(e: number) => handleDescuentoChange(item, e)}
                                                formatter={numberWithCommas}
                                            />
                                        </td>
                                        <td data-label="SUB-TOTAL" style={{textAlign: 'right', backgroundColor: '#fafafa'}}>
                                            <Typography variant="subtitle1" gutterBottom component="div">
                                                <strong>{numberWithCommas((item.inputCantidad * item.inputPrecio - item.inputDescuento), {})}</strong>
                                            </Typography>
                                        </td>
                                        <td data-label="OPCIONES" style={{textAlign: 'right'}}>
                                            <IconButton onClick={() => handleDelete(item)}>
                                                <Delete color="warning"/>
                                            </IconButton>
                                            <IconButton onClick={() => {
                                                alert('Aumentar');
                                            }}>
                                                <TextIncrease color="primary"/>
                                            </IconButton>
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </Grid>
            </Grid>
        </SimpleCard>
    </>
}

