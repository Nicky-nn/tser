import {lazy} from 'react'
import Loadable from "../../components/Template/Loadable/Loadable";
import {authRoles} from "../../../../auth/authRoles";

const Analytics = Loadable(lazy(() => import('./Analytics')))

const dashboardRoutes = [
    {
        path: '/dashboard/default',
        element: <Analytics/>,
        auth: authRoles.admin,
    },
]

export default dashboardRoutes
