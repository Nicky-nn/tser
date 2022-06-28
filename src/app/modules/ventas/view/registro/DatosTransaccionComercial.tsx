import {Button, CircularProgress, Grid, TextField} from "@mui/material";
import {setCliente, setCodigoCliente, setEmailCliente} from "../../slices/facturacion/factura.slice";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {PerfilProps} from "../../../../base/models/loginModel";
import {useAppSelector} from "../../../../hooks";
import {ClienteProps, fetchClientesList} from "../../../../base/api/cliente.api";
import DatosCliente from "./DatosCliente";
import {PersonAddAlt1Outlined} from "@mui/icons-material";
import NuevoClienteDialog from "./NuevoClienteDialog";

interface FilmOptionType {
    codigoCaeb: string;
    title: string;
    year: number;
}

interface DatosTransaccionComercialProps {
    user: PerfilProps;
}

export const DatosTransaccionComercial = ({user}: DatosTransaccionComercialProps) => {
    const factura = useAppSelector(state => state.factura);
    const dispatch = useDispatch();
    const [clientes, setClientes] = useState<ClienteProps[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [openNuevoCliente, setNuevoCliente] = useState(false);
    const loading = open && clientes.length === 0;

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
        <Grid container spacing={1}>
            <Grid item lg={9} xs={12} md={12}>
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
                    isOptionEqualToValue={(option, value) => option.codigoCliente === factura.codigoCliente}
                    getOptionLabel={(option) =>
                        `${option.numeroDocumento}${option.complemento || ''} - ${option.razonSocial} - ${option.tipoDocumentoIdentidad.descripcion}`}
                    options={clientes}
                    loading={loading}
                    onChange={(event, newInputValue: any) => {
                        dispatch(setCodigoCliente(newInputValue?.codigoCliente || ''));
                        dispatch(setCliente(newInputValue || []));
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

                <TextField
                    fullWidth
                    size={'small'}
                    id="outlined-required"
                    label="Correo Electrónico Alternativo"
                    value={factura.emailCliente || ''}
                    disabled={!factura.codigoCliente}
                    onChange={(e) => dispatch(setEmailCliente(e.target.value))}
                />
            </Grid>
            <Grid item lg={3} xs={12} md={3}>
                <Button variant="outlined" onClick={() => setNuevoCliente(true)} startIcon={<PersonAddAlt1Outlined/>}>Nuevo
                    Cliente</Button>
            </Grid>
            <Grid item lg={12}>
                <DatosCliente/>
            </Grid>
        </Grid>
        <NuevoClienteDialog
            id={'nuevoClienteDialog'}
            keepMounted
            open={openNuevoCliente}
            onClose={(e) => {
                if (e) {
                    dispatch(setCliente(e));
                    dispatch(setCodigoCliente(e.codigoCliente))
                    setNuevoCliente(false)
                } else {
                    setNuevoCliente(false)
                }
            }}
        />
    </>
}

