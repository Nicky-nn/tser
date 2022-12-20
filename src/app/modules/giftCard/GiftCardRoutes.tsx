import { lazy } from 'react';

import { authRoles } from '../../../auth/authRoles';
import Loadable from '../../base/components/Template/Loadable/Loadable';
import { giftCardRouteMap } from './GiftCardRoutesMap';

const AppGiftCardGestion = Loadable(lazy(() => import('./view/listado/GiftCards')));
const AppGiftCardNuevo = Loadable(lazy(() => import('./view/registro/GiftCardRegistro')));
const AppGiftCardActualizar = Loadable(
  lazy(() => import('./view/actualizar/GiftCardActualizar')),
);
const AppGiftCardClientes = Loadable(
  lazy(() => import('./view/clientes/GiftCardClientes')),
);

const giftCardRoutes = [
  {
    path: giftCardRouteMap.gestion.path,
    element: <AppGiftCardGestion />,
    auth: authRoles.admin,
  },
  {
    path: giftCardRouteMap.nuevo.path,
    element: <AppGiftCardNuevo />,
    auth: authRoles.admin,
  },
  {
    path: `${giftCardRouteMap.modificar.path}/:id`,
    element: <AppGiftCardActualizar />,
    auth: authRoles.admin,
  },
  {
    path: giftCardRouteMap.clientes.path,
    element: <AppGiftCardClientes />,
    auth: authRoles.admin,
  },
];

export default giftCardRoutes;
