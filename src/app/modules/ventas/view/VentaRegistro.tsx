import {Box, styled} from '@mui/system'
import {Grid} from "@mui/material";
import {DatosTransaccionComercial} from "./registro/DatosTransaccionComercial";
import {useContext, useEffect, useState} from "react";
import {FacturaProps, fetchFacturaParams} from "../api/factura.api";
import {selectFactura} from "../slices/facturacion/factura.slice";
import {FormikProps, useFormik} from "formik";
import {FacturaInputProps} from "../interfaces/factura";
import DatosCliente from "./registro/DatosCliente";
import {DetalleTransaccionComercial} from "./registro/DetalleTransaccionComercial";
import {useAppSelector} from "../../../hooks";
import AuthContext from "../../../base/contexts/JWTAuthContext";
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";
import SimpleCard from "../../../base/components/Template/Cards/SimpleCard";

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
    const {user} = useContext(AuthContext)
    const [clasificadores, setClasificadores] = useState<FacturaProps>({
        sinActividades: [],
        sinTipoMetodoPago: [],
        sinUnidadMedida: []
    });

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            await fetchFacturaParams().then(res => {
                setClasificadores(res)
            });
        }
        fetch().then()
    }, []);

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
                    <Grid item lg={8} md={8} xs={12}>
                        <DatosTransaccionComercial
                            actividadEconomica={clasificadores.sinActividades}
                            user={user!}
                        />
                    </Grid>
                    <Grid item lg={4} md={4} xs={12}>
                        <DatosCliente/>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <DetalleTransaccionComercial/>
                    </Grid>
                    <Grid item lg={8} md={8} xs={12}>
                        <SimpleCard title="Método de págo">
                            hola form 2
                        </SimpleCard>
                    </Grid>
                    <Grid item lg={4} md={4} xs={12}>
                        <SimpleCard title="Totales">
                            hola form 2
                        </SimpleCard>
                    </Grid>
                </Grid>
            </form>
            <Box py="12px"/>
        </Container>
    )
}

export default VentaRegistro