import { lazy } from 'react'

import { authRoles } from '../../../auth/authRoles'
import Loadable from '../../base/components/Template/Loadable/Loadable'

const AppProveedores = Loadable(lazy(() => import('./view/Proveedores')))

const proveedorRoutes = [
  {
    path: `/proveedor/gestion`,
    element: <AppProveedores />,
    auth: authRoles.admin,
  },
]

export default proveedorRoutes
