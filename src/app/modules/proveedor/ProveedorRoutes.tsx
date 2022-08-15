import {lazy} from 'react'
import Loadable from "../../base/components/Template/Loadable/Loadable";
import {authRoles} from "../../../auth/authRoles";

const AppProveedores = Loadable(lazy(() => import('./view/Proveedores')));

const proveedorRoutes = [{
    path: `/proveedor/gestion`,
    element: <AppProveedores/>,
    auth: authRoles.admin,
},
]

export default proveedorRoutes
