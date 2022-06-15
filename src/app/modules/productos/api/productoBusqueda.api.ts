// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {ClasificadorProps, SinActividadesProps} from "../../../interfaces";
import {AccessToken} from "../../../base/models/paramsModel";
import {ProductoProps} from "./producto.api";

export interface FacturaProps {
    sinTipoMetodoPago: ClasificadorProps[],
    sinUnidadMedida: ClasificadorProps[],
    sinActividades: SinActividadesProps[],
}


const productoQuery = (query: string) => gql`
    query PRODUCTOS_BUSQUEDA {
        fcvProductoBusqueda(query: "${query}") {
            titulo
            descripcion
            seguimientoInventario
            rangoPrecios {
                precioVarianteMaximo
                precioVarianteMinimo
            }
            variante{
                codigoProducto
                titulo
                nombre
                disponibleParaVenta
                codigoBarras
                precio
                precioComparacion
                imagen{
                    altText
                    url
                }
                cantidadVendible
                unidadMedida{
                    codigoClasificador
                    descripcion
                }
            }
        }
    }
`

export const fetchProductoBusqueda = async (query: string): Promise<ProductoProps[]> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(productoQuery(query))
    return data?.fcvProductoBusqueda || [];
}