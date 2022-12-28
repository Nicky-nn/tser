import { lazy } from 'react'

import { authRoles } from '../../../auth/authRoles'
import Loadable from '../../base/components/Template/Loadable/Loadable'

const AppVentaRegistro = Loadable(lazy(() => import('./view/VentaRegistro')))
const AppVentaGestion = Loadable(lazy(() => import('./view/VentaGestion')))

const ventasRoutes = [
  {
    path: '/ventas/registro',
    element: <AppVentaRegistro />,
    auth: authRoles.admin,
  },
  {
    path: '/ventas/gestion',
    element: <AppVentaGestion />,
    auth: authRoles.admin,
  },
]

export default ventasRoutes
