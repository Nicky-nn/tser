import React, {FunctionComponent, useState} from 'react';
import SimpleContainer from "../../../base/components/Container/SimpleContainer";
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";
import {Button, Grid, Stack} from "@mui/material";
import {PersonAddAltSharp} from "@mui/icons-material";
import {Box} from "@mui/system";
import ClientesListado from "./Listado/ClientesListado";
import {ClienteProps} from "../interfaces/cliente";
import ClienteRegistroDialog from "./ClienteRegistroDialog";
import {notDanger} from "../../../utils/notification";

interface OwnProps {
}

type Props = OwnProps;

const Clientes: FunctionComponent<Props> = (props) => {
    const [open, setOpen] = useState(false);
    return (
        <SimpleContainer>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Clientes', path: '/clientes/gestion'},
                        {name: 'Gestión de clientes'},
                    ]}
                />
            </div>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} justifyContent="right" sx={{marginBottom: 3}}>
                <Button size={'small'} variant="contained"
                        onClick={() => setOpen(true)}
                        startIcon={<PersonAddAltSharp/>} color={'primary'}
                > Nuevo Cliente
                </Button>
                <Button
                    size={'small'}
                    variant="contained"
                    onClick={() => notDanger('Opcion aun no disponible')}
                    color={'primary'}
                >Nuevo Cliente Extranjero</Button>
            </Stack>
            <form noValidate>
                <Grid container spacing={2}>
                    <Grid item lg={12} md={12} xs={12}>
                        <ClientesListado/>
                    </Grid>
                </Grid>
            </form>
            <Box py="12px"/>
            <ClienteRegistroDialog
                id={'clienteRegistroDialog'}
                keepMounted
                open={open}
                onClose={(value?: ClienteProps) => {
                    if (value) {
                        console.log(value)
                    }
                    setOpen(false)
                }}
            />
        </SimpleContainer>
    );
};

export default Clientes;
