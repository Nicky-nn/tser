import {lazy} from 'react'
import Loadable from "../../base/components/Template/Loadable/Loadable";
import {authRoles} from "../../../auth/authRoles";
import {cuentaRouteMap} from "./CuentaRoutesMap";

const AppCuenta = Loadable(lazy(() => import('./view/Cuenta')));

const cuentaRoutes = [{
    path: cuentaRouteMap.cuenta, element: <AppCuenta/>, auth: authRoles.admin,
}]

export default cuentaRoutes
