import {Navigate} from 'react-router-dom'
import AuthGuard from "../../auth/AuthGuard";
import MatxLayout from "../base/components/Template/MatxLayout/MatxLayout";
import dashboardRoutes from "../base/view/dashboard/DashboardRoutes";
import ventasRoutes from "../modules/ventas/VentasRoutes";
import sessionRoutes from "../base/view/sessions/SessionRoutes";
import NotFound from "../base/view/sessions/NotFound";
import productosRoutes from "../modules/productos/ProductosRoutes";
import clientesRoutes from "../modules/clientes/ClientesRoutes";
import cuentaRoutes from "../modules/cuenta/CuentaRoutes";

export const appRoutes = [
    {
        element: (
            <AuthGuard>
                <MatxLayout/>
            </AuthGuard>
        ),
        children: [
            ...dashboardRoutes,
            ...ventasRoutes,
            ...productosRoutes,
            ...clientesRoutes,
            ...cuentaRoutes
        ],
    },
    ...sessionRoutes,
    {path: '/', element: <Navigate to="dashboard/default"/>},
    {path: '*', element: <NotFound/>},
]
