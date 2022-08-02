// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {TipoProductoProps} from "../../tipoProducto/interfaces/tipoProducto.interface";

const gqlQuery = gql`
    query TIPOS_PRODUCTOS {
        tiposProductos(limit:1000, page: 1, reverse: true) {
            pageInfo{
                hasNextPage
                hasPrevPage
                totalDocs
                limit
                page
                totalPages
            }
            docs{
                _id
                codigoParent
                descripcion
            }
        }
    }
`

export const apiTiposProducto = async (): Promise<TipoProductoProps[]> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery)
    return data.tiposProductos.docs!
}