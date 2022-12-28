import { lazy } from 'react'

import { authRoles } from '../../../../auth/authRoles'
import Loadable from '../../components/Template/Loadable/Loadable'

const Analytics = Loadable(lazy(() => import('./Analytics')))

const dashboardRoutes = [
  {
    path: '/dashboard/default',
    element: <Analytics />,
    auth: authRoles.admin,
  },
]

export default dashboardRoutes
