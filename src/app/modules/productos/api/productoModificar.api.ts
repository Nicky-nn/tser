// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {ProductoInputApiProps, ProductoProps} from "../interfaces/producto.interface";

const gqlQuery = gql`
    mutation PRODUCTOS_REGISTRO($input: FcvProductoInput!) {
        fcvProductoRegistro(
            input: $input
        ) {
            _id
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
                incluirCantidadInventario
                habilitarStock
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
        }
    }
`

export const apiProductoModificar = async (input: ProductoInputApiProps): Promise<ProductoProps> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery, {input})
    return data.fcvProductoRegistro
}