// pedidosRoutes.js
import React, { lazy } from 'react'

import { authRoles } from '../../../auth/authRoles'
import Loadable from '../../base/components/Template/Loadable/Loadable'

const AppPedidoRegistro = Loadable(lazy(() => import('./view/PedidoRegistro')))
const AppPedidosGestion = Loadable(lazy(() => import('./view/Pedidos')))
// const AppPedidoActualizar = Loadable(lazy(() => import('./view/PedidoActualizar')))
const pedidosRoutes = [
  {
    path: '/pedidos/registrar',
    element: <AppPedidoRegistro />, // Usa el componente PedidoGestion directamente
    auth: authRoles.admin,
  },
  {
    path: '/pedidos/gestion',
    element: <AppPedidosGestion />, // Usa el componente PedidoRegistro directamente
    auth: authRoles.admin,
  },
  // {
  //   path: '/pedidos/modificar/',
  //   element: <AppPedidoActualizar />, // Usa el componente PedidoActualizar directamente
  //   auth: authRoles.admin,
  // },
]

export default pedidosRoutes
