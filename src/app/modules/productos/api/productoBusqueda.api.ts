// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {ClasificadorProps, SinActividadesProps} from "../../../interfaces";
import {AccessToken} from "../../../base/models/paramsModel";
import {ProductoProps, ProductoVarianteProps} from "./producto.api";

export interface FacturaProps {
    sinTipoMetodoPago: ClasificadorProps[],
    sinUnidadMedida: ClasificadorProps[],
    sinActividades: SinActividadesProps[],
}


const productoQuery = (query: string) => gql`
    query PRODUCTOS_BUSQUEDA {
        fcvProductoBusqueda(query: "${query}") {
            codigoProducto
            titulo
            nombre
            codigoBarras
            precio
            precioComparacion
            inventario{
                stock
            }
            unidadMedida{
                codigoClasificador
                descripcion
            }
            producto{
                _id
                titulo
                rangoPrecios{
                    precioVarianteMaximo
                    precioVarianteMinimo
                }
                sinProductoServicio{
                    codigoActividad
                    codigoProducto
                }
                tipoProducto
                totalVariantes
                seguimientoInventario
                imagenDestacada{
                    altText
                    url
                }
            }
        }
    }
`

export const fetchProductoBusqueda = async (query: string): Promise<ProductoVarianteProps[]> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(productoQuery(query))
    return data?.fcvProductoBusqueda || [];
}