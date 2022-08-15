import {Box} from '@mui/system'
import {Button, Grid, Stack} from "@mui/material";
import React, {useContext, useState} from "react";
import AuthContext from "../../../base/contexts/JWTAuthContext";
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";
import SimpleContainer from "../../../base/components/Container/SimpleContainer";
import {Newspaper} from "@mui/icons-material";
import ProveedorListado from "../components/ProveedorListado";
import {productosRouteMap} from "../../productos/ProductosRoutesMap";
import {ProveedorProps} from "../interfaces/proveedor.interface";
import ProveedorRegistroDialog from "./ProveedorRegistroDialog";


const Proveedores = () => {
    const {user} = useContext(AuthContext)
    // in this case *props are stored in the state of parent component
    const [openNuevoProveedor, setOpenNuevoProveedor] = useState<boolean>(false);

    return (
        <>
            <SimpleContainer>
                <div className="breadcrumb">
                    <Breadcrumb
                        routeSegments={[
                            {name: 'Productos', path: productosRouteMap.gestion},
                            {name: 'Proveedores'},
                        ]}
                    />
                </div>
                <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} justifyContent="right" sx={{marginBottom: 3}}>
                    <Button size={'small'} variant="contained" onClick={() => setOpenNuevoProveedor(true)}
                            startIcon={<Newspaper/>} color={'success'}
                    > Nuevo Proveedor</Button>
                </Stack>
                <Grid container spacing={2}>
                    <Grid item lg={12} md={12} xs={12}>
                        <ProveedorListado/>
                    </Grid>
                </Grid>
                <Box py="12px"/>
            </SimpleContainer>

            <ProveedorRegistroDialog
                id={'proveedorRegistroDialog'}
                keepMounted={false}
                open={openNuevoProveedor}
                onClose={(value?: ProveedorProps) => {
                    if (value) {
                        // refetch().then()
                    }
                    setOpenNuevoProveedor(false)
                }}
            />
        </>

    )
}

export default Proveedores