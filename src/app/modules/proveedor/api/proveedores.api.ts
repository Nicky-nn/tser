// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {ProveedorProps} from "../interfaces/proveedor.interface";

const gqlQuery = gql`
    query PROVEEDORES {
        proveedores(limit: 1000, page: 1, reverse: true){
            docs{
                codigo
                nombre
                razonSocial
                nit
                direccion
            }
        }
    }
`

export const apiProveedores = async (): Promise<ProveedorProps[]> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery)
    return data.proveedores?.docs || []
}