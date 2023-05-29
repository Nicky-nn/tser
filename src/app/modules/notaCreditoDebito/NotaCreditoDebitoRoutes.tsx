import { lazy } from 'react'

import { authRoles } from '../../../auth/authRoles'
import Loadable from '../../base/components/Template/Loadable/Loadable'
import { ncdRouteMap } from './NotaCreditoDebitoRoutesMap'

const AppNcdGestion = Loadable(lazy(() => import('./view/NcdGestion')))
const AppNcdRegistro = Loadable(lazy(() => import('./view/NcdRegistro')))

const notaCreditoDebitoRoutes = [
  {
    path: ncdRouteMap.gestion.path,
    element: <AppNcdGestion />,
    auth: authRoles.admin,
  },
  {
    path: ncdRouteMap.nuevo.path,
    element: <AppNcdRegistro />,
    auth: authRoles.admin,
  },
]

export default notaCreditoDebitoRoutes
