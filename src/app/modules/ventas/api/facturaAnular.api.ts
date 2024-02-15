// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { FacturaProps } from '../interfaces/factura'

export const FCV_ONLINE = gql`
  mutation FCV_ANULAR($id: ID!, $codigoMotivo: Int!) {
    facturaCompraVentaAnulacion(id: $id, codigoMotivo: $codigoMotivo) {
      representacionGrafica {
        pdf
      }
    }
  }
`

/**
 * @description Anula una factura
 * @param id
 * @param codigoMotivo
 */
export const fetchFacturaAnular = async (
  id: string,
  codigoMotivo: number,
): Promise<FacturaProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(FCV_ONLINE, { id, codigoMotivo })
    return data.facturaCompraVentaAnulacion
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}
