import { ImportExport, Inventory, ReceiptLong } from '@mui/icons-material'
import { Box, Button, Grid } from '@mui/material'
import { useState } from 'react'

import { SimpleItem } from '../../../base/components/Container/SimpleItem'
import SimpleRowMenu from '../../../base/components/Container/SimpleRow'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import PedidosListado from './listado/PedidosListado'
import PedidosReporteExportarDialog from './listado/PedidosReporteExportarDialog'
import PedidosReporteVentaArticuloDialog from './listado/PedidosReporteVentaArticulos'
import PedidosReporteVentaComercioDialog from './listado/PedidosReporteVentaComercio'
import PedidosReporteVentaSimpleDialog from './listado/PedidosReporteVentaSimple'
import { pedidosRouteMap } from './listado/PedidosRoutesMap'
import PedidosVsVentasReporteExportarDialog from './listado/PedidosVsVentasReporteExportarDialog'

/**
 * @description componente principal para la gestión de productos
 * @constructor
 */
const Productos = () => {
  const [openExport, setOpenExport] = useState(false)
  const [openExportVentas, setOpenExportVentas] = useState(false)
  const [openExportVentasSimple, setOpenExportVentasSimple] = useState(false)
  const [openExportVentasArticulos, setOpenExportVentasArticulos] = useState(false)
  const [openExportVentasComercio, setOpenExportVentasComercio] = useState(false)

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
            startIcon={<Inventory />}
            onClick={() => setOpenExportVentasArticulos(true)}
            variant={'outlined'}
          >
            REPORTE VENTAS ARTICULOS
          </Button>
        </SimpleItem>
        <SimpleItem>
          <Button
            size={'small'}
            startIcon={<ReceiptLong />}
            onClick={() => setOpenExportVentasComercio(true)}
            variant={'outlined'}
          >
            REPORTE DE VENTAS ARTICULOS COMERCIO
          </Button>
        </SimpleItem>
        <SimpleItem>
          <Button
            size={'small'}
            startIcon={<ImportExport />}
            onClick={() => setOpenExportVentasSimple(true)}
            variant={'contained'}
          >
            REPORTE DE VENTAS RESUMEN
          </Button>
        </SimpleItem>
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
      <PedidosReporteVentaSimpleDialog
        id={'pedidosReporteVentaSimpleDialog'}
        keepMounted={true}
        open={openExportVentasSimple}
        onClose={() => {
          setOpenExportVentasSimple(false)
        }}
      />
      <PedidosReporteVentaArticuloDialog
        id={'pedidosReporteVentaArticuloDialog'}
        keepMounted={true}
        open={openExportVentasArticulos}
        onClose={() => {
          setOpenExportVentasArticulos(false)
        }}
      />
      <PedidosReporteVentaComercioDialog
        id={'pedidosReporteVentaComercioDialog'}
        keepMounted={true}
        open={openExportVentasComercio}
        onClose={() => {
          setOpenExportVentasComercio(false)
        }}
      />
    </div>
  )
}

export default Productos
