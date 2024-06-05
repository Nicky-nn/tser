import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

interface ReporteVentasData {
  restReporteVentas: {
    file: string
    data: {
      metodoPago: {
        codigoClasificador: number
        descripcion: string
      }
      state: string
      sucursal: {
        codigo: number
        direccion: string
      }
      moneda: {
        codigo: number
        descripcion: string
        sigla: string
      }
      numeroPedidos: number
      montoTotal: number
    }[]
  }
}

const queryReporteVentas = gql`
  query REPORTE_VENTAS(
    $entidad: EntidadParamsInput!
    $fechaInicial: DateDMYHHMMSS!
    $fechaFinal: DateDMYHHMMSS!
    $usucre: String!
  ) {
    restReporteVentas(
      entidad: $entidad
      fechaInicial: $fechaInicial
      fechaFinal: $fechaFinal
      usucre: $usucre
    ) {
      file
      data {
        metodoPago {
          codigoClasificador
          descripcion
        }
        state
        sucursal {
          codigo
          direccion
        }
        moneda {
          codigo
          descripcion
          sigla
        }
        numeroPedidos
        montoTotal
      }
    }
  }
`

export const restReportePedidosApi = async (
  entidad: { codigoSucursal: number; codigoPuntoVenta: number },
  fechaInicial: string,
  fechaFinal: string,
  usucre: string,
): Promise<ReporteVentasData> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const data = await client.request(queryReporteVentas, {
      entidad,
      fechaInicial,
      fechaFinal,
      usucre,
    })

    return data as ReporteVentasData
  } catch (error: any) {
    const errorMessage =
      error.response?.errors?.[0]?.message ||
      'Ocurrió un error inesperado, por favor intente de nuevo'
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonText: 'Entendido',
    })
    console.error('Error en restReporteVentasApi', error)
    throw new MyGraphQlError(error)
  }
}
