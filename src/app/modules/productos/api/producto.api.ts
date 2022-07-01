// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {ProductoInputProps} from "../interfaces/producto.interface";


const query = gql`
    query FCV_PARAMETROS {
        sinTipoMetodoPago {
            codigoClasificador
            descripcion
        }
        sinUnidadMedida {
            codigoClasificador
            descripcion
        }
        sinActividades{
            codigoCaeb
            descripcion
            tipoActividad
        }
    }
`

export const fetchProductoListado = async (): Promise<ProductoInputProps> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query)
    return data;
}