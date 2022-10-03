import { lazy } from 'react';

import { authRoles } from '../../../auth/authRoles';
import Loadable from '../../base/components/Template/Loadable/Loadable';

const AppVentaRegistro = Loadable(lazy(() => import('./view/NcdRegistroRegistro')));
const AppVentaGestion = Loadable(lazy(() => import('./view/NcdGestion')));

const notaCreditoDebitoRouter = [
  {
    path: '/ventas/registro',
    element: <AppVentaRegistro />,
    auth: authRoles.admin,
  },
  {
    path: '/ventas/gestion',
    element: <AppVentaGestion />,
    auth: authRoles.admin,
  },
];

export default notaCreditoDebitoRouter;
