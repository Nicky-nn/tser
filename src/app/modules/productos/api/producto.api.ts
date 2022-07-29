// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {ProductoProps} from "../interfaces/producto.interface";
import {PageInfoProps, PageProps} from "../../../interfaces";

/**
 * Respuesta de productos
 */
export interface ApiProductoResponse {
    docs: Array<ProductoProps>,
    pageInfo: PageInfoProps
}


const query = gql`
    query FCV_PRODUCTOS($limit: Int!, $reverse: Boolean, $page: Int!, $query: String) {
        fcvProductos(limit: $limit, reverse: $reverse, page: $page, query: $query) {
            pageInfo {
                hasNextPage
                hasPrevPage
                limit
                page
                totalDocs
            }
            docs {
                _id
                state
                sinProductoServicio {
                    codigoActividad
                    codigoProducto
                    descripcionProducto
                }
                titulo
                descripcion
                descripcionHtml
                opcionesProducto {
                    nombre
                    valores
                    id
                }
                tipoProducto {
                    _id
                    descripcion
                    codigoParent
                }
                totalVariantes
                imagenDestacada {
                    altText
                    url
                }
                varianteUnica
                proveedor {
                    codigo
                    nombre
                }
                variantes {
                    id
                    codigoProducto
                    titulo
                    nombre
                    codigoBarras
                    precio
                    precioComparacion
                    costo
                    incluirCantidad
                    verificarStock
                    imagen {
                        altText
                        url
                    }
                    unidadMedida {
                        codigoClasificador
                        descripcion
                    }
                    inventario {
                        sucursal {
                            codigo
                        }
                        stock
                    }
                }
                state
                usucre
                createdAt
                usumod
                updatedAt
            }
        }
    }
`

export const apiProductos = async (pageInfo: PageProps): Promise<ApiProductoResponse> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, pageInfo)
    return data.fcvProductos;
}