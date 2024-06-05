import { ImportExport } from '@mui/icons-material'
import { Box, Button, Grid } from '@mui/material'
import { useState } from 'react'

import { SimpleItem } from '../../../base/components/Container/SimpleItem'
import SimpleRowMenu from '../../../base/components/Container/SimpleRow'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import PedidosListado from './listado/PedidosListado'
import PedidosReporteExportarDialog from './listado/PedidosReporteExportarDialog'
import { pedidosRouteMap } from './listado/PedidosRoutesMap'
import PedidosVsVentasReporteExportarDialog from './listado/PedidosVsVentasReporteExportarDialog'

/**
 * @description componente principal para la gestión de productos
 * @constructor
 */
const Productos = () => {
  const [openExport, setOpenExport] = useState(false)
  const [openExportVentas, setOpenExportVentas] = useState(false)

  return (
    <div
      style={{
        padding: '40px',
      }}
    >
      <Breadcrumb routeSegments={[pedidosRouteMap.gestion]} />
      <SimpleRowMenu>
        <SimpleItem>
          <Button
            size={'small'}
            startIcon={<ImportExport />}
            onClick={() => setOpenExport(true)}
            variant={'contained'}
          >
            REPORTE DE PEDIDOS
          </Button>
        </SimpleItem>
        <SimpleItem>
          <Button
            size={'small'}
            startIcon={<ImportExport />}
            onClick={() => setOpenExportVentas(true)}
            variant={'contained'}
          >
            REPORTE DE PEDIDOS Vs VENTAS
          </Button>
        </SimpleItem>
      </SimpleRowMenu>

      <Grid container spacing={2}>
        <Grid item lg={12} md={12} xs={12}>
          <PedidosListado />
        </Grid>
      </Grid>
      <Box py="12px" />
      <PedidosReporteExportarDialog
        id={'pedidosReporteExportarDialog'}
        keepMounted={true}
        open={openExport}
        onClose={() => {
          setOpenExport(false)
        }}
      />
      <PedidosVsVentasReporteExportarDialog
        id={'pedidosVsVentasReporteExportarDialog'}
        keepMounted={true}
        open={openExportVentas}
        onClose={() => {
          setOpenExportVentas(false)
        }}
      />
    </div>
  )
}

export default Productos
