// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {ClienteProps} from "../../../base/api/cliente.api";

const query = gql`
    mutation CLIENTE_REGISTRO($input: ClienteInput!){
        clienteCreate(input: $input) {
            _id
            razonSocial
            codigoCliente
            tipoDocumentoIdentidad {
                codigoClasificador
                descripcion
            }
            numeroDocumento
            complemento
            nombres
            apellidos
            email
        }
    }
`

export const fetchClienteCreate = async (input: any): Promise<ClienteProps> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, {input})
    return data.clienteCreate;
}