import {Button, FormControl, Grid, TextField} from "@mui/material";
import {setCliente, setCodigoCliente, setEmailCliente} from "../../slices/facturacion/factura.slice";
import {useDispatch} from "react-redux";
import React, {useState} from "react";
import {PerfilProps} from "../../../../base/models/loginModel";
import {useAppSelector} from "../../../../hooks";
import {fetchClientesList} from "../../../../base/api/cliente.api";
import DatosCliente from "./DatosCliente";
import {PersonAddAlt1Outlined} from "@mui/icons-material";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import AsyncSelect from "react-select/async";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import {swalException} from "../../../../utils/swal";
import {genReplaceEmpty} from "../../../../utils/helper";
import ClienteRegistroDialog from "../../../clientes/view/ClienteRegistroDialog";
import {ClienteProps} from "../../../clientes/interfaces/cliente";

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
    const [openNuevoCliente, setNuevoCliente] = useState(false);


    const fetchClientes = async (inputValue: string): Promise<any[]> => {
        try {
            const clientes = await fetchClientesList()
            if (clientes) return clientes
            return []
        } catch (e: any) {
            swalException(e)
            return [];
        }
    }

    return <>
        <Grid container spacing={2}>
            <Grid item xs={12} lg={12} sm={12} md={12}>
                <FormControl fullWidth>
                    <SelectInputLabel shrink>
                        Seleccione al cliente
                    </SelectInputLabel>
                    <AsyncSelect<ClienteProps>
                        cacheOptions={false}
                        defaultOptions
                        styles={reactSelectStyles}
                        menuPosition={'fixed'}
                        name="clientes"
                        placeholder={'Seleccione Cliente'}
                        loadOptions={fetchClientes}
                        isClearable={true}
                        value={genReplaceEmpty(factura.cliente, null)}
                        getOptionValue={(item) => item.codigoCliente}
                        getOptionLabel={(item) => `${item.numeroDocumento}${item.complemento || ''} - ${item.razonSocial} - ${item.tipoDocumentoIdentidad.descripcion}`}
                        onChange={(cliente: any) => {
                            dispatch(setCodigoCliente(cliente?.codigoCliente || ''));
                            dispatch(setCliente(cliente || []));
                        }}
                    />
                </FormControl>
            </Grid>

            <Grid item lg={9} xs={12} md={12}>
                <TextField
                    fullWidth
                    size={'small'}
                    id="correoElectronicoAlternativo"
                    label="Correo Electrónico Alternativo"
                    value={factura.emailCliente || ''}
                    disabled={!factura.codigoCliente}
                    onChange={(e) => dispatch(setEmailCliente(e.target.value))}
                />
            </Grid>

            <Grid item lg={3} xs={12} md={3}>
                <Button variant="outlined" fullWidth onClick={() => setNuevoCliente(true)}
                        startIcon={<PersonAddAlt1Outlined/>}>Nuevo
                    Cliente</Button>
            </Grid>
            <Grid item lg={12}>
                <DatosCliente/>
            </Grid>
        </Grid>
        <ClienteRegistroDialog
            id={'nuevoClienteDialog'}
            keepMounted
            open={openNuevoCliente}
            onClose={(value?: ClienteProps) => {
                if (value) {
                    dispatch(setCliente(value));
                    dispatch(setCodigoCliente(value.codigoCliente))
                    setNuevoCliente(false)
                } else {
                    setNuevoCliente(false)
                }
            }}
        />
    </>
}

