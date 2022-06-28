import {lazy} from 'react'
import Loadable from "../../base/components/Template/Loadable/Loadable";
import {authRoles} from "../../../auth/authRoles";

const AppClientesGestion = Loadable(lazy(() => import('./view/Clientes')));

const clientesRoutes = [
    {
        path: '/clientes/gestion',
        element: <AppClientesGestion/>,
        auth: authRoles.admin,
    }
]

export default clientesRoutes
