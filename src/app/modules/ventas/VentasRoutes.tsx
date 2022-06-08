import {lazy} from 'react'
import Loadable from "../../base/components/Template/Loadable/Loadable";
import {authRoles} from "../../../auth/authRoles";

const AppVentaRegistro = Loadable(lazy(() => import('./view/VentaRegistro')));

const ventasRoutes = [
    {
        path: '/ventas/registro',
        element: <AppVentaRegistro/>,
        auth: authRoles.admin,
    },
]

export default ventasRoutes
