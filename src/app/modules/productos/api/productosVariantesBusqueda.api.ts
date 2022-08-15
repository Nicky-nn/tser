// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {ProductoVarianteProps} from "../interfaces/producto.interface";

const reqQuery = gql`
    query FCV_PRODUCTOS_VARIANTES_BUSQUEDA($codigoActividad: String!, $query: String) {
        fcvProductosVariantesBusqueda( codigoActividad: $codigoActividad, query:$query) {
            _id
            id
            sinProductoServicio{
                codigoActividad
                codigoProducto
                descripcionProducto
            }
            codigoProducto
            producto{
                _id
                titulo
                totalVariantes
                varianteUnica
                imagenDestacada{
                    altText
                    url
                }
            }
            titulo
            nombre
            codigoBarras
            precio
            precioComparacion
            costo
            imagen{
                altText
                url
            }
            incluirCantidad
            verificarStock
            unidadMedida{
                codigoClasificador
                descripcion
            }
            inventario{
                sucursal{
                    codigo
                    direccion
                }
                stock
            }
            peso
        }
    }
`

export const apiProductosVariantesBusqueda = async (codigoActividad: string, query: string): Promise<ProductoVarianteProps[]> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(reqQuery, {codigoActividad, query})
    return data?.fcvProductosVariantesBusqueda || [];
}