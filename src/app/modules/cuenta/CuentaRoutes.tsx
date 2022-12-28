import { lazy } from 'react'

import { authRoles } from '../../../auth/authRoles'
import Loadable from '../../base/components/Template/Loadable/Loadable'
import { cuentaRouteMap } from './CuentaRoutesMap'

const AppCuenta = Loadable(lazy(() => import('./view/Cuenta')))

const cuentaRoutes = [
  {
    path: cuentaRouteMap.cuenta,
    element: <AppCuenta />,
    auth: authRoles.admin,
  },
]

export default cuentaRoutes
