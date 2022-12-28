import { lazy } from 'react'

import { authRoles } from '../../../auth/authRoles'
import Loadable from '../../base/components/Template/Loadable/Loadable'

const AppClientesGestion = Loadable(lazy(() => import('./view/Clientes')))

const clientesRoutes = [
  {
    path: '/clientes/gestion',
    element: <AppClientesGestion />,
    auth: authRoles.admin,
  },
]

export default clientesRoutes
