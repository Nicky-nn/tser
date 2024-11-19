import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import { authRoles } from '../../../auth/authRoles'
import Loadable from '../../base/components/Template/Loadable/Loadable'
import useAuth from '../../base/hooks/useAuth'
import { ncdRouteMap } from './NotaCreditoDebitoRoutesMap'

// Componente wrapper para validar acceso SIAT
// @ts-ignore
const SiatProtectedRoute = ({ children }) => {
  const {
    user: { integracionSiat },
  } = useAuth()

  if (!integracionSiat) {
    // Redirige a la página de acceso denegado
    return <Navigate to="/acceso-denegado" />
  }

  return children
}

const AppNcdGestion = Loadable(lazy(() => import('./view/NcdGestion')))
const AppNcdRegistro = Loadable(lazy(() => import('./view/NcdRegistro')))

const notaCreditoDebitoRoutes = [
  {
    path: ncdRouteMap.gestion.path,
    element: (
      <SiatProtectedRoute>
        <AppNcdGestion />
      </SiatProtectedRoute>
    ),
    auth: authRoles.admin,
  },
  {
    path: ncdRouteMap.nuevo.path,
    element: (
      <SiatProtectedRoute>
        <AppNcdRegistro />
      </SiatProtectedRoute>
    ),
    auth: authRoles.admin,
  },
]

export default notaCreditoDebitoRoutes
