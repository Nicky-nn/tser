// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {AccessToken} from "../../../base/models/paramsModel";
import {FacturaProps} from "../interfaces/factura";

export const FCV_ONLINE = gql`
    mutation FCV_ANULAR($id: ID!, $codigoMotivo: Int!) {
        facturaCompraVentaAnulacion(id: $id, codigoMotivo: $codigoMotivo) {
            representacionGrafica {
                pdf
            }
        }
    }
`

export const fetchFacturaAnular = async (id: string, codigoMotivo: number): Promise<FacturaProps> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(FCV_ONLINE, {id, codigoMotivo})
    return data.facturaCompraVentaAnulacion;
}
