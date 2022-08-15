// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {ProveedorProps} from "../interfaces/proveedor.interface";
import {PageInfoProps, PageInputProps} from "../../../interfaces";

const gqlQuery = gql`
    query PROVEEDORES($limit: Int!, $reverse: Boolean, $page: Int!, $query: String) {
        proveedores(limit: $limit, reverse: $reverse, page: $page, query: $query) {
            pageInfo {
                hasNextPage
                hasPrevPage
                totalDocs
                limit
                page
                totalPages
            }
            docs {
                codigo
                nombre
                direccion
                ciudad
                contacto
                correo
                telefono
                state
                createdAt
                updatedAt
                usucre
                usumod
            }
        }
    }
`

interface ProveedorResponse {
    pageInfo: PageInfoProps,
    docs: ProveedorProps[]
}

export const apiProveedores = async (pageInfo: PageInputProps): Promise<ProveedorResponse> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery, pageInfo)
    return data.proveedores
}