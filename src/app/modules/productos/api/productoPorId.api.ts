// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {ProductoInputProps, ProductoProps} from "../interfaces/producto.interface";


const query = gql`
    query FCV_PRODUCTO($id: ID!) {
        fcvProducto(id: $id) {
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
        }
    }
`

export const apiProductoPorId = async (id: string): Promise<ProductoProps> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, {id})
    return data.fcvProducto;
}