import {Box} from '@mui/system'
import {Divider, Grid} from "@mui/material";
import {DatosTransaccionComercial} from "./registro/DatosTransaccionComercial";
import {DetalleTransaccionComercial} from "./registro/DetalleTransaccionComercial";
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";
import VentaTotales from "./registro/VentaTotales";
import MetodosPago from "./registro/MetodosPago";
import FacturaDetalleExtra from "./registro/FacturaDetalleExtra";
import DatosActividadEconomica from "./registro/DatosActividadEconomica";
import SimpleCard from "../../../base/components/Template/Cards/SimpleCard";
import useAuth from "../../../base/hooks/useAuth";
import SimpleContainer from "../../../base/components/Container/SimpleContainer";
import {useForm} from "react-hook-form";
import {FacturaInitialValues, FacturaInputProps} from "../interfaces/factura";
import {yupResolver} from "@hookform/resolvers/yup";
import {VentaRegistroValidator} from "../validator/ventaRegistroValidator";

const VentaRegistro = () => {
    const {user} = useAuth()

    const form = useForm<FacturaInputProps>({
        defaultValues: {...FacturaInitialValues, actividadEconomica: user.actividadEconomica},
        resolver: yupResolver(VentaRegistroValidator),
    });

    return (
        <SimpleContainer>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Ventas', path: '/ventas/registro'},
                        {name: 'Registrar Venta'},
                    ]}
                />
            </div>
            <form noValidate>
                <Grid container spacing={2}>
                    <Grid item lg={12} md={12} xs={12}>
                        <DatosActividadEconomica form={form}/>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <FacturaDetalleExtra form={form}/>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <DetalleTransaccionComercial form={form}/>
                    </Grid>
                    <Grid item lg={7} md={12} xs={12}>
                        <SimpleCard title={'Cliente / Método de págo'}>
                            <DatosTransaccionComercial form={form} user={user!}/>
                            <Divider/>
                            <MetodosPago form={form}/>
                        </SimpleCard>
                    </Grid>
                    <Grid item lg={5} md={6} xs={12}>
                        <VentaTotales form={form}/>
                    </Grid>
                </Grid>
            </form>
            <Box py="12px"/>
        </SimpleContainer>
    )
}

export default VentaRegistro