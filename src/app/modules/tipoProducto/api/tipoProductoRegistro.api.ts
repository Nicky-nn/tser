// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {TipoProductoInputProp, TipoProductoProps} from "../interfaces/tipoProducto.interface";

const gqlQuery = gql`
    mutation TIPO_PRODUCTO_REGISTRO($input: TipoProductoInput!) {
        tipoProductoRegistro(input: $input){
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
`

export const apiTipoProductoRegistro = async (input: TipoProductoInputProp): Promise<TipoProductoProps> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery, {input})
    return data.tipoProductoRegistro
}