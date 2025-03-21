import { Navigate } from 'react-router-dom'

import AuthGuard from '../../auth/AuthGuard'
import MatxLayout from '../base/components/Template/MatxLayout/MatxLayout'
import cuentaRoutes from '../modules/base/cuenta/CuentaRoutes'
import homeRoutes, { homeRoutesMap } from '../modules/base/home/HomeRoutes'
import NotFound from '../modules/base/sessions/NotFound'
import sessionRoutes from '../modules/base/sessions/SessionRoutes'
import clientesRoutes from '../modules/clientes/ClientesRoutes'
import notaCreditoDebitoRoutes from '../modules/notaCreditoDebito/NotaCreditoDebitoRoutes'
import pedidosRoutes from '../modules/pos/PosRoutes'
import productosRoutes from '../modules/productos/ProductosRoutes'
import proveedorRoutes from '../modules/proveedor/ProveedorRoutes'
import reporteRoutes from '../modules/reporte/reporteRoutes'
import ventasRoutes from '../modules/ventas/VentasRoutes'

export const appRoutes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...homeRoutes,
      ...ventasRoutes,
      ...productosRoutes,
      ...clientesRoutes,
      ...cuentaRoutes,
      ...proveedorRoutes,
      ...notaCreditoDebitoRoutes,
      ...pedidosRoutes,
      ...reporteRoutes,
    ],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to={homeRoutesMap.home.path} /> },
  { path: '*', element: <NotFound /> },
]
