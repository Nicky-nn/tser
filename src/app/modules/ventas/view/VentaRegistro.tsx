import { yupResolver } from '@hookform/resolvers/yup'
import { Person } from '@mui/icons-material'
import { Box, Grid } from '@mui/material'
import { useForm } from 'react-hook-form'

import AlertLoading from '../../../base/components/Alert/AlertLoading'
import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import SimpleCard from '../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../base/hooks/useAuth'
import usePlantillaDetalleExtra from '../../base/detalleExtra/hook/usePlantillaDetalleExtra'
import { FacturaInitialValues, FacturaInputProps } from '../interfaces/factura'
import { VentaRegistroValidator } from '../validator/ventaRegistroValidator'
import DatosActividadEconomica from './registro/DatosActividadEconomica'
import { DatosTransaccionComercial } from './registro/DatosTransaccionComercial'
import { DetalleTransaccionComercial } from './registro/DetalleTransaccionComercial'
import FacturaDetalleExtra from './registro/FacturaDetalleExtra'
import VentaTotales from './registro/VentaTotales'

const VentaRegistro = () => {
  const { user } = useAuth()

  const form = useForm<FacturaInputProps>({
    defaultValues: {
      ...FacturaInitialValues,
    },
    resolver: yupResolver<any>(VentaRegistroValidator),
  })

  const { pdeLoading, plantillaDetalleExtra } = usePlantillaDetalleExtra()

  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Ventas', path: '/ventas/registro' },
            { name: 'Registrar Venta' },
          ]}
        />
      </div>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xs={12}>
            <DatosActividadEconomica form={form} />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            {pdeLoading ? (
              <AlertLoading mensaje={'Cargando...'} />
            ) : (
              <FacturaDetalleExtra form={form} detalleExtra={plantillaDetalleExtra} />
            )}
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <DetalleTransaccionComercial form={form} />
          </Grid>
          <Grid item lg={6} md={12} xs={12}>
            <SimpleCard title={'Cliente'} childIcon={<Person />}>
              <DatosTransaccionComercial form={form} user={user!} />
            </SimpleCard>
          </Grid>
          <Grid item lg={6} md={12} xs={12}>
            <VentaTotales form={form} />
          </Grid>
        </Grid>
      </form>
      <Box py="12px" />
    </SimpleContainer>
  )
}

export default VentaRegistro
