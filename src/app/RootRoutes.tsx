import {Navigate} from "react-router-dom";
import dashboardRoutes from "./base/view/dashboard/DashboardRoutes";

interface RouteProps {
    path: string;
    component: () => JSX.Element;
    exact?: boolean;
}


const redirectRoute: RouteProps[] = [
    {
        path: '/',
        exact: true,
        component: () => <Navigate to="/dashboard/default"/>,
    },
]

const errorRoute = [
    {
        component: () => <Navigate to="/session/404"/>,
    },
]

const routes = [
    ...dashboardRoutes,
    ...redirectRoute,
    ...errorRoute,
]

export default routes
