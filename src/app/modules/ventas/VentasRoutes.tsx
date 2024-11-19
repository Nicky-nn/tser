import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import { authRoles } from '../../../auth/authRoles'
import Loadable from '../../base/components/Template/Loadable/Loadable'
import useAuth from '../../base/hooks/useAuth'

// Componente wrapper para validar acceso SIAT
// @ts-ignore
const SiatProtectedRoute = ({ children }) => {
  const {
    user: { integracionSiat },
  } = useAuth()

  if (!integracionSiat) {
    // Puedes redirigir a una página de error o donde prefieras
    return <Navigate to="/acceso-denegado" />
  }

  return children
}

const AppVentaRegistro = Loadable(lazy(() => import('./view/VentaRegistro')))
const AppVentaGestion = Loadable(lazy(() => import('./view/VentaGestion')))

const ventasRoutes = [
  {
    path: '/ventas/registro',
    element: (
      <SiatProtectedRoute>
        <AppVentaRegistro />
      </SiatProtectedRoute>
    ),
    auth: authRoles.admin,
  },
  {
    path: '/ventas/gestion',
    element: (
      <SiatProtectedRoute>
        <AppVentaGestion />
      </SiatProtectedRoute>
    ),
    auth: authRoles.admin,
  },
]

export default ventasRoutes
