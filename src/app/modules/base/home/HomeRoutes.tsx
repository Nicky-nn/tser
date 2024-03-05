import { lazy } from 'react'

import { authRoles } from '../../../../auth/authRoles'
import Loadable from '../../../base/components/Template/Loadable/Loadable'

const Home = Loadable(lazy(() => import('./Home')))

export const homeRoutesMap = {
  home: {
    path: '/home',
    name: 'Página Principal',
  },
}

/**
 * Estructura de ruta para cargar la página principal
 */
const homeRoutes = [
  {
    path: homeRoutesMap.home.path,
    element: <Home />,
    auth: authRoles.admin,
  },
]

export default homeRoutes
