// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {ClienteProps} from "../../../base/api/cliente.api";
import {PageInfoProps, PageProps} from "../../../interfaces";

interface ClienteListadoProps {
    pageInfo: PageInfoProps,
    docs: ClienteProps[]
}


const query = gql`
    query CLIENTES_LISTADO($limit: Int!, $page:Int, $query: String) {
        clientesAll(limit:$limit, page: $page, query: $query) {
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
                apellidos
                codigoCliente
                complemento
                email
                nombres
                numeroDocumento
                razonSocial
                codigoExcepcion
                tipoDocumentoIdentidad{
                    codigoClasificador
                    descripcion
                }
            }
        }
    }
`

export const fetchClienteListado = async ({limit, page, query: queryText = ""}: PageProps): Promise<ClienteListadoProps> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, {limit, page, query:queryText})
    return data.clientesAll;
}