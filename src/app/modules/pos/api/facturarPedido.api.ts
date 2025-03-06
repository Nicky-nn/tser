import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

interface FacturaInput {
  codigoExcepcion: number
  codigoMetodoPago: number
  numeroTarjeta: string | null
  codigoMoneda: number
  tipoCambio: number
  detalleExtra: string | null
  usuario: string | null
}

interface RepresentacionGrafica {
  rolloResumen: string
  pdf: string
  xml: string
  rollo: string
  sin: string
}

interface FacturaResponse {
  restPedidoFacturaRegistro: {
    numeroDocumento: any
    cuf: any
    state: any
    representacionGrafica: any
  }
  factura: {
    nitEmisor: string
    numeroFactura: string
    cuf: string
    representacionGrafica: RepresentacionGrafica
  }
  pedido: {
    numeroPedido: number
    numeroOrden: number
  }
}

interface FacturaData {
  restPedidoFacturaRegistro: FacturaResponse
}

const mutationFactura = gql`
  mutation FACTURA(
    $numeroPedido: Int!
    $cliente: ClienteOperacionInput!
    $entidad: EntidadParamsInput!
    $input: RestPedidoFacturaInput!
    $notificacion: Boolean
  ) {
    restPedidoFacturaRegistro(
      numeroPedido: $numeroPedido
      cliente: $cliente
      entidad: $entidad
      input: $input
      notificacion: $notificacion
    ) {
      factura {
        nitEmisor
        numeroFactura
        cuf
        representacionGrafica {
          pdf
          xml
          rollo
          sin
          rolloResumen
        }
        cliente {
          razonSocial
          numeroDocumento
          email
          telefono
        }
        createdAt
      }
      pedido {
        numeroPedido
        numeroOrden
      }
    }
  }
`

export const restPedidoFacturaApi = async (
  numeroPedido: number,
  cliente: { codigoCliente: string },
  entidad: { codigoSucursal: number; codigoPuntoVenta: number },
  input: FacturaInput,
): Promise<FacturaResponse> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    // Obtenemos y guardamos notofcation del local storage emailEnabled

    const notificacion = localStorage.getItem('emailEnabled') === 'true' ? true : false

    const data = (await client.request(mutationFactura, {
      numeroPedido,
      cliente,
      entidad,
      input,
      notificacion,
    })) as FacturaData

    return data.restPedidoFacturaRegistro
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
    console.error('Error en restPedidoFacturaApi', error)
    throw new MyGraphQlError(error)
  }
}
