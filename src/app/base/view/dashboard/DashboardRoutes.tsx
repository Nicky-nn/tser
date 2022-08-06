import {lazy} from 'react'
import Loadable from "../../components/Template/Loadable/Loadable";
import {authRoles} from "../../../../auth/authRoles";
import Account from "../account/Account";

const Analytics = Loadable(lazy(() => import('./Analytics')))

const dashboardRoutes = [
    {
        path: '/dashboard/default',
        element: <Analytics/>,
        auth: authRoles.admin,
    }, {
        path: '/account',
        element: <Account/>,
        auth: authRoles.admin,
    },
]

export default dashboardRoutes
