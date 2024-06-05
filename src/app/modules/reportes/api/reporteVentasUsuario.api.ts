// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { EntidadInputProps } from '../../../interfaces'

export interface ReporteVentasUsuarioProps {
  sucursal: number
  puntoVenta: number
  usuario: string
  numeroFacturas: number
  montoTotal: number
  state: string
}

const query = gql`
  query VENTAS_X_USUARIO(
    $fechaInicial: DateDMY!
    $fechaFinal: DateDMY!
    $entidad: [EntidadParamsInput]
  ) {
    restFacturaReporteVentasUsuario(
      fechaInicial: $fechaInicial
      fechaFinal: $fechaFinal
      entidad: $entidad
    ) {
      sucursal
      puntoVenta
      usuario
      numeroFacturas
      montoTotal
      state
    }
  }
`

/**
 * @description Generamos el reporte de ventas por usuario
 * @param fechaInicial
 * @param fechaFinal
 * @param entidad
 */
export const apiReporteVentasPorUsuario = async (
  fechaInicial: string,
  fechaFinal: string,
  entidad: EntidadInputProps[] | null,
): Promise<ReporteVentasUsuarioProps[]> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, { fechaInicial, fechaFinal, entidad })
    return data.restFacturaReporteVentasUsuario || []
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}
