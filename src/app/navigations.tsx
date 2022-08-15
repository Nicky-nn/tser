import {proveedorRouteMap} from "./modules/proveedor/ProveedorRoutesMap";
import {productosRouteMap} from "./modules/productos/ProductosRoutesMap";

export interface NavigationProps {
    name: string;
    path?: string;
    icon?: any;
    iconText?: string,
    label?: string;
    type?: string;
    badge?: { value: string, color: string };
    children?: Array<{
        name: string,
        iconText: string,
        path: string,
    }>
}

export const navigations: NavigationProps[] = [
    {
        name: 'Página Principal',
        path: '/dashboard/default',
        icon: 'dashboard',
    },
    {
        name: 'SEGURIDAD',
        label: 'TRANSACCIONES',
        type: 'label',
    },
    {
        name: 'Ventas',
        icon: 'shopping_cart',
        children: [
            {
                name: 'Registrar Venta',
                iconText: 'VE',
                path: '/ventas/registro',
            },
            {
                name: 'Gestión de Ventas',
                iconText: 'VEGE',
                path: '/ventas/gestion',
            }
        ]
    },
    {
        name: 'Productos',
        icon: 'inventory_sharp',
        children: [
            {
                name: 'Gestión de Productos',
                iconText: 'GP',
                path: productosRouteMap.gestion,
            },
            {
                name: 'Proveedores',
                iconText: 'PR',
                path: proveedorRouteMap.gestion,
            }
        ],
    },
    {
        name: 'Clientes',
        icon: 'person_sharp',
        badge: {value: '', color: 'secondary'},
        children: [
            {
                name: 'Gestión de clientes',
                path: '/clientes/gestion',
                iconText: 'GC',
            }
        ],
    },
    {
        name: 'Reportes',
        icon: 'trending_up',

        children: [
            {
                name: 'Echarts',
                path: '/charts/echarts',
                iconText: 'E',
            },
        ],
    },
    {
        name: 'Documentación',
        icon: 'launch',
        type: 'extLink',
        path: 'http://demos.ui-lib.com/matx-react-doc/',
    },
]
