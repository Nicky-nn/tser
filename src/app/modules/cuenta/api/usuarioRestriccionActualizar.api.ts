// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { UsuarioRestriccionProps } from '../interfaces/restriccion.interface'

const gqlQuery = gql`
  mutation CAMBIAR_SUCURSAL_PUNTO_VENTA_ACTIVO(
    $codigoSucursal: Int!
    $codigoPuntoVenta: Int!
  ) {
    usuarioCambiarSucursalPuntoVentaActivo(
      codigoSucursal: $codigoSucursal
      codigoPuntoVenta: $codigoPuntoVenta
    ) {
      nombres
      restriccionActivo {
        codigoSucursal
        codigoPuntoVenta
      }
    }
  }
`

interface apiUsuarioActualizarRestriccionProps {
  codigoSucursal: number
  codigoPuntoVenta: number
}

export const apiUsuarioActualizarRestriccion = async ({
  codigoSucursal,
  codigoPuntoVenta,
}: apiUsuarioActualizarRestriccionProps): Promise<UsuarioRestriccionProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(gqlQuery, { codigoSucursal, codigoPuntoVenta })
  return data.usuarioCambiarSucursalPuntoVentaActivo
}
