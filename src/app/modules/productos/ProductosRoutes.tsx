import {lazy} from 'react'
import Loadable from "../../base/components/Template/Loadable/Loadable";
import {authRoles} from "../../../auth/authRoles";

const AppProductosGestion = Loadable(lazy(() => import('./view/Productos')));
const AppProductoNuevo = Loadable(lazy(() => import('./view/ProductoRegistro')));

const productosRoutes = [
    {
        path: '/productos/gestion',
        element: <AppProductosGestion/>,
        auth: authRoles.admin,
    }, {
        path: '/productos/nuevo',
        element: <AppProductoNuevo/>,
        auth: authRoles.admin,
    },
]

export default productosRoutes
