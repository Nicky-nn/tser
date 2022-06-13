import {CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField} from "@mui/material";
import styled from "@emotion/styled";
import {object, string} from "yup";
import {
    setActividadEconomica,
    setCliente,
    setCodigoCliente,
    setEmailCliente
} from "../../slices/facturacion/factura.slice";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {SinActividadesProps} from "../../../../interfaces";
import {PerfilProps} from "../../../../base/models/loginModel";
import {useAppSelector} from "../../../../hooks";
import {ClienteProps, fetchClientesList} from "../../../../base/api/cliente.api";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";

interface FilmOptionType {
    codigoCaeb: string;
    title: string;
    year: number;
}

const top100Films: FilmOptionType[] = [
    {codigoCaeb: "19200", title: 'The Shawshank Redemption', year: 1994},
    {codigoCaeb: "19201", title: 'The Godfather', year: 1972},
    {codigoCaeb: "19202", title: 'The Godfather: Part II', year: 1974},
    {codigoCaeb: "19203", title: 'The Dark Knight', year: 2008},
    {codigoCaeb: "19204", title: '12 Angry Men', year: 1957},
    {codigoCaeb: "19205", title: "Schindler's List", year: 1993},
    {codigoCaeb: "19206", title: 'Pulp Fiction', year: 1994},
];

const Item = styled(Paper)(({theme}: any) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
})) as typeof Paper;


const validationSchema = object({
    actividadEconomica: string().required('el campo es requerido')
});

interface DatosTransaccionComercialProps {
    actividadEconomica: SinActividadesProps[];
    user: PerfilProps;
}

export const DatosTransaccionComercial = ({actividadEconomica, user}: DatosTransaccionComercialProps) => {
    const factura = useAppSelector(state => state.factura);
    const dispatch = useDispatch();
    const [clientes, setClientes] = useState<ClienteProps[]>([]);
    const [open, setOpen] = useState<boolean>(false);
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
        <SimpleCard title="Datos de la transacción comercial">
            <Grid container spacing={2}>
                <Grid item xs={12} py={1}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Actividad Económica</InputLabel>
                        <Select
                            label="Actividad Económica"
                            value={factura.actividadEconomica}
                            defaultValue={factura.actividadEconomica}
                            onChange={(e) => dispatch(setActividadEconomica(e.target.value))}
                            size={'small'}
                        >
                            {
                                actividadEconomica.map(ae => (
                                    <MenuItem key={ae.codigoCaeb} value={ae.codigoCaeb}>
                                        {ae.tipoActividad} - {ae.descripcion}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} py={2}>
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
            </Grid>
        </SimpleCard>
    </>
}

