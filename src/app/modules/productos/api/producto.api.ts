// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {SinUnidadMedidaProps} from "../../sin/interfaces/sin.interface";
import {ImagenProps, ProductoPrecioRangoProps, SinProductoServicioProps} from "../interfaces/producto.interface";

export interface ProductoVarianteProps {
    codigoProducto: string // identificador o codigo unico
    titulo: string // nombre propio
    nombre: string // nombre producto + titulo
    disponibleParaVenta: boolean
    codigoBarras: string | null
    precio: number
    precioComparacion: number
    imagen?: ImagenProps
    cantidadVendible: number
    peso: number
    unidadMedida: SinUnidadMedidaProps
}

export interface ProductoProps {
    sinProductoServicio: SinProductoServicioProps
    titulo: string
    descripcion: string
    descripcionHtml: string
    rangoPrecios: ProductoPrecioRangoProps
    tipoProducto: string | null
    totalVariantes: number
    seguimientoInventario: boolean
    imagenDestacada?: ImagenProps // url de la imagen
    varianteUnica: boolean // si solo tienen una sola variante
    proveedor: string | null // nombre del proveedor si vale el caso
    variante: ProductoVarianteProps[]
    usucre: string
    createdAt?: Date
    usumod?: string
    updatedAt?: Date
    estado?: string
}


const query = gql`
    query FCV_PARAMETROS {
        sinTipoMetodoPago {
            codigoClasificador
            descripcion
        }
        sinUnidadMedida {
            codigoClasificador
            descripcion
        }
        sinActividades{
            codigoCaeb
            descripcion
            tipoActividad
        }
    }
`

export const fetchProductoListado = async (): Promise<ProductoProps> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query)
    return data;
}