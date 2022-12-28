import { lazy } from 'react'

import { authRoles } from '../../../auth/authRoles'
import Loadable from '../../base/components/Template/Loadable/Loadable'
import { productosRouteMap } from './ProductosRoutesMap'

const AppProductosGestion = Loadable(lazy(() => import('./view/Productos')))
const AppProductoNuevo = Loadable(lazy(() => import('./view/ProductoRegistro')))
const AppProductoActualizar = Loadable(lazy(() => import('./view/ProductoActualizar')))

const productosRoutes = [
  {
    path: productosRouteMap.gestion,
    element: <AppProductosGestion />,
    auth: authRoles.admin,
  },
  {
    path: productosRouteMap.nuevo,
    element: <AppProductoNuevo />,
    auth: authRoles.admin,
  },
  {
    path: `${productosRouteMap.modificar}/:id`,
    element: <AppProductoActualizar />,
    auth: authRoles.admin,
  },
]

export default productosRoutes
