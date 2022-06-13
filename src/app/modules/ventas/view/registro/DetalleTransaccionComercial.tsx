import {CircularProgress, Grid, TextField} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {FC, useEffect, useState} from "react";
import {setCliente, setCodigoCliente} from "../../slices/facturacion/factura.slice";
import Autocomplete from "@mui/material/Autocomplete";
import {ClienteProps, fetchClientesList} from "../../../../base/api/cliente.api";
import {useAppSelector} from "../../../../hooks";
import {useDispatch} from "react-redux";

export const DetalleTransaccionComercial: FC = () => {
    const factura = useAppSelector(state => state.factura);
    const dispatch = useDispatch();
    const [productos, setProductos] = useState<ClienteProps[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const loading = open && productos.length === 0;

    useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        (async () => {
            if (active) {
                const clientes = await fetchClientesList()
                setClientes(clientes);
            }
        })();
        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!open) {
            setClientes([]);
        }
    }, [open]);
    return <>
        <SimpleCard title="Detalle transacción comercial">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        id="tipoCliente"
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        size={"small"}
                        defaultValue={null}
                        isOptionEqualToValue={(option, value) => option.codigoCliente === factura.codigoCliente}
                        getOptionLabel={(option) =>
                            `${option.numeroDocumento}${option.complemento || ''} - ${option.razonSocial} - ${option.tipoDocumentoIdentidad.descripcion}`}
                        options={clientes}
                        loading={loading}
                        onChange={(event, newInputValue: any) => {
                            console.log(newInputValue)
                            dispatch(setCodigoCliente(newInputValue?.codigoCliente || ''));
                            dispatch(setCliente(newInputValue));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Seleccione al cliente"
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
                <Grid item xs={12}>

                </Grid>
                <Grid item xs={12}>
                </Grid>
            </Grid>
        </SimpleCard>
    </>
}

