import { homeRoutesMap } from './modules/base/home/HomeRoutes'
import { ncdRouteMap } from './modules/notaCreditoDebito/NotaCreditoDebitoRoutesMap'
import { pedidosRouteMap } from './modules/pos/view/listado/PedidosRoutesMap'
import { reporteRoutesMap } from './modules/reporte/reporteRoutes'

export interface NavigationProps {
  name: string
  path?: string
  icon?: any
  iconText?: string
  label?: string
  type?: string
  badge?: { value: string; color: string }
  children?: Array<{
    name: string
    iconText: string
    path: string
  }>
}

export const navigations: NavigationProps[] = [
  {
    name: homeRoutesMap.home.name,
    icon: 'home',
    path: homeRoutesMap.home.path,
  },
  {
    name: 'SEGURIDAD',
    label: 'TRANSACCIONES',
    type: 'label',
  },
  {
    name: 'Ventas y Pedidos',
    icon: 'shopping_cart',
    children: [
      {
        name: 'Registrar Pedido',
        iconText: 'RP',
        path: '/pedidos/registrar',
      },
      {
        name: pedidosRouteMap.gestion.name,
        iconText: 'PG',
        path: 'pedidos/gestion',
      },
      {
        name: 'Gestión de Facturas',
        iconText: 'GEF',
        path: '/ventas/gestion',
      },
    ],
  },
  {
    name: 'Nota Crédito Debito',
    icon: 'document_scanner',
    children: [
      {
        name: ncdRouteMap.gestion.name,
        iconText: 'NCD',
        path: ncdRouteMap.gestion.path,
      },
    ],
  },
  // {
  //   name: 'Productos',
  //   icon: 'inventory_sharp',
  //   children: [
  //     {
  //       name: productosRouteMap.gestion.name,
  //       iconText: 'GP',
  //       path: productosRouteMap.gestion.path,
  //     },
  //     {
  //       name: 'Proveedores',
  //       iconText: 'PR',
  //       path: proveedorRouteMap.gestion,
  //     },
  //   ],
  // },
  {
    name: 'Clientes',
    icon: 'person_sharp',
    badge: { value: '', color: 'secondary' },
    children: [
      {
        name: 'Gestión de Clientes',
        path: '/clientes/gestion',
        iconText: 'GC',
      },
    ],
  },
  {
    name: 'Reportes',
    icon: 'assessment',
    children: [
      {
        name: reporteRoutesMap.articuloPorPuntoVenta.name,
        iconText: 'MV',
        path: reporteRoutesMap.articuloPorPuntoVenta.path,
      },
      {
        name: reporteRoutesMap.articuloPorComercio.name,
        iconText: 'MC',
        path: reporteRoutesMap.articuloPorComercio.path,
      },
    ],
  },
  /*
  {
    name: 'Reportes',
    icon: 'trending_up',

    children: [
      {
        name: 'Echarts',
        path: '/charts/echarts',
        iconText: 'E',
      },
    ],
  },
  {
    name: 'Documentación',
    icon: 'launch',
    type: 'extLink',
    path: 'https://www.youtube.com/watch?v=XPDOkFO_J1o',
  },
     */
]
