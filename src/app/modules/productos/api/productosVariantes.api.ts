// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {ProductosVariantesProps} from "../interfaces/producto.interface";

const reqQuery = gql`
    query PRODUCTOS_VARIANTES($codigoActividad: String, $query: String) {
        fcvProductosVariantes(codigoActividad: $codigoActividad, query: $query) {
            _id
            titulo
            descripcion
            sinProductoServicio{
                codigoActividad
                codigoProducto
                descripcionProducto
            }
            varianteUnica
            opcionesProducto{
                nombre
                valores
            }
            proveedor{
                codigo
                nombre
            }
            variantes{
                id
                codigoProducto
                titulo
                nombre
                codigoBarras
                incluirCantidad
                verificarStock
                precio
                precioComparacion
                imagen{
                    altText
                    url
                }
                unidadMedida{
                    codigoClasificador
                    descripcion
                }
                inventario {
                    sucursal{
                        codigo
                    }
                    stock
                }
            }
        }
    }
`

export const apiProductosVariantes = async (codigoActividad: string, query: string): Promise<ProductosVariantesProps[]> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    console.log('buscando')

    const data: any = await client.request(reqQuery, {codigoActividad, query})
    return data?.fcvProductosVariantes || [];
}