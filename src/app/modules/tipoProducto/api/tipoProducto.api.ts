// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {TipoProductoProps} from "../interfaces/tipoProducto.interface";

const gqlQuery = gql`
    query TIPOS_PRODUCTO {
        tiposProductos(limit: 1000, reverse: true) {
            docs {
                _id
                descripcion
                codigoParent
                state
                usucre
                createdAt
                usumod
                UpdatedAt
            }
        }
    }
`

export const apiProveedores = async (): Promise<TipoProductoProps[]> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery)
    return data.tiposProductos?.docs || []
}