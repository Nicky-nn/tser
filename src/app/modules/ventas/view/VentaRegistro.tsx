import {Box, styled} from '@mui/system'
import {Divider, Grid} from "@mui/material";
import {DatosTransaccionComercial} from "./registro/DatosTransaccionComercial";
import React from "react";
import {selectFactura} from "../slices/facturacion/factura.slice";
import {FormikProps, useFormik} from "formik";
import {FacturaInputProps} from "../interfaces/factura";
import {DetalleTransaccionComercial} from "./registro/DetalleTransaccionComercial";
import {useAppSelector} from "../../../hooks";
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";
import VentaTotales from "./registro/VentaTotales";
import MetodosPago from "./registro/MetodosPago";
import FacturaDetalleExtra from "./registro/FacturaDetalleExtra";
import DatosActividadEconomica from "./registro/DatosActividadEconomica";
import SimpleCard from "../../../base/components/Template/Cards/SimpleCard";
import useAuth from "../../../base/hooks/useAuth";

const Container = styled('div')(({theme}) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: '16px',
        },
    },
}))

const VentaRegistro = () => {
    const factura = useAppSelector(selectFactura)
    const {user} = useAuth()

    const formik: FormikProps<FacturaInputProps> = useFormik<FacturaInputProps>({
        initialValues: factura,
        onSubmit: (values) => {
            console.log(values);
        }
    });

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Ventas', path: '/ventas/registro'},
                        {name: 'Registrar Venta'},
                    ]}
                />
            </div>
            <form noValidate onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item lg={12} md={12} xs={12}>
                        <DatosActividadEconomica/>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <FacturaDetalleExtra/>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <DetalleTransaccionComercial/>
                    </Grid>
                    <Grid item lg={7} md={12} xs={12}>
                        <SimpleCard title={'Cliente / Método de págo'}>
                            <DatosTransaccionComercial user={user!}/>
                            <Divider/>
                            <MetodosPago/>
                        </SimpleCard>
                    </Grid>
                    <Grid item lg={5} md={6} xs={12}>
                        <VentaTotales/>
                    </Grid>
                </Grid>
            </form>
            <Box py="12px"/>
        </Container>
    )
}

export default VentaRegistro