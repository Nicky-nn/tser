import { lazy } from 'react'

import { authRoles } from '../../../auth/authRoles'

const VentasArticuloPuntoVentaApp = lazy(() => import('./view/VentasArticuloPuntoVenta'))
const VentasArticuloComercioApp = lazy(() => import('./view/VentasArticuloComercio'))

/**
 * Mapa de rutas
 */
export const reporteRoutesMap = {
  articuloPorPuntoVenta: {
    path: '/reporte/ventas-articulo-punto-venta',
    name: 'Ventas de Artículos por Punto de Venta',
  },
  articuloPorComercio: {
    path: '/reporte/ventas-articulo-comercio',
    name: 'Ventas de Artículos por Comercio',
  },
}

/**
 * Estructura de ruta para cargar la página principal
 */
const reporteRoutes = [
  {
    path: reporteRoutesMap.articuloPorPuntoVenta.path,
    element: <VentasArticuloPuntoVentaApp />,
    auth: authRoles.admin,
  },
  {
    path: reporteRoutesMap.articuloPorComercio.path,
    element: <VentasArticuloComercioApp />,
    auth: authRoles.admin,
  },
]

export default reporteRoutes
