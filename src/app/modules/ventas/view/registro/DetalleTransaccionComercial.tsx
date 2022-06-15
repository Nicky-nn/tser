import {Button, CircularProgress, Grid, TextField} from "@mui/material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {FC, useEffect, useState} from "react";
import {useAppSelector} from "../../../../hooks";
import {useDispatch} from "react-redux";
import {ProductoProps} from "../../../productos/api/producto.api";
import {fetchProductoBusqueda} from "../../../productos/api/productoBusqueda.api";
import Autocomplete from "@mui/material/Autocomplete";

const data: any = []

export const DetalleTransaccionComercial: FC = () => {
    const factura = useAppSelector(state => state.factura);
    const dispatch = useDispatch();
    const [open, setOpen] = useState<boolean>(false);
    const [productos, setProductos] = useState<ProductoProps[]>([]);
    const loading = open && productos.length === 0;

    useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        (async () => {
            if (active) {
                const resp = await fetchProductoBusqueda('manga')
                console.log(resp)
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
        console.log(newInput)
    }
    return <>
        <SimpleCard title="Detalle transacción comercial">
            <Grid container spacing={2}>
                <Grid item xs={10}>
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
                        isOptionEqualToValue={(option, value) => option.estado === factura.codigoCliente}
                        getOptionLabel={(option) => `${option.descripcion}`}
                        options={productos}
                        loading={loading}
                        onChange={(event, newInputValue: any) => {
                            console.log(newInputValue)
                            // dispatch(setCodigoCliente(newInputValue?.codigoCliente || ''));
                            // dispatch(setCliente(newInputValue));
                        }}
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
                <Grid item xs={2}>
                    <Button variant="outlined">Explorar Productos</Button>
                </Grid>
                <Grid item xs={12}>
                    fasdfsa
                </Grid>
            </Grid>
        </SimpleCard>
    </>
}

