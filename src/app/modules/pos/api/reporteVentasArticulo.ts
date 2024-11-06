import { gql, GraphQLClient } from 'graphql-request'
import Swal from 'sweetalert2'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

interface ReporteVentasArticuloPuntoVentaData {
  restReportePedidoVentasPorArticuloPuntoVenta: {
    codigoArticulo: string
    nombreArticulo: string
    sucursal: string
    nroVentas: number
    montoVentas: number
    montoDescuento: number
    montoDescuentoAdicional: number
  }[]
}

interface ReporteVentasArticuloComercioData {
  restReportePedidoVentasPorArticuloComercio: {
    codigoArticulo: string
    nombreArticulo: string
    sucursal: string
    puntoVenta: string
    nroVentas: number
    montoVentas: number
    montoDescuento: number
    montoDescuentoAdicional: number
  }[]
}

const queryReporteVentasPorArticuloPuntoVenta = gql`
  query REPORTE_VENTAS_ARTICULO_PUNTO_VENTA(
    $fechaInicial: DateDMY!
    $fechaFinal: DateDMY!
    $codigoSucursal: Int!
    $codigoPuntoVenta: [Int]!
    $mostrarTodos: Boolean!
  ) {
    restReportePedidoVentasPorArticuloPuntoVenta(
      fechaInicial: $fechaInicial
      fechaFinal: $fechaFinal
      codigoSucursal: $codigoSucursal
      codigoPuntoVenta: $codigoPuntoVenta
      mostrarTodos: $mostrarTodos
    ) {
      codigoArticulo
      nombreArticulo
      sucursal
      nroVentas
      montoVentas
      montoDescuento
      montoDescuentoAdicional
    }
  }
`

const queryReporteVentasPorArticuloComercio = gql`
  query REPORTE_VENTAS_ARTICULO_COMERCIO(
    $fechaInicial: DateDMY!
    $fechaFinal: DateDMY!
    $codigoSucursal: [Int]!
  ) {
    restReportePedidoVentasPorArticuloComercio(
      fechaInicial: $fechaInicial
      fechaFinal: $fechaFinal
      codigoSucursal: $codigoSucursal
    ) {
      codigoArticulo
      nombreArticulo
      sucursal
      puntoVenta
      nroVentas
      montoVentas
      montoDescuento
      montoDescuentoAdicional
    }
  }
`

export const obtenerReporteVentasPorArticuloPuntoVenta = async (
  fechaInicial: string,
  fechaFinal: string,
  codigoSucursal: number,
  codigoPuntoVenta: number[],
  mostrarTodos: boolean,
): Promise<ReporteVentasArticuloPuntoVentaData> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const data = await client.request(queryReporteVentasPorArticuloPuntoVenta, {
      fechaInicial,
      fechaFinal,
      codigoSucursal,
      codigoPuntoVenta,
      mostrarTodos,
    })

    return data as ReporteVentasArticuloPuntoVentaData
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
    console.error('Error en obtenerReporteVentasPorArticuloPuntoVenta', error)
    throw new MyGraphQlError(error)
  }
}

export const obtenerReporteVentasPorArticuloComercio = async (
  fechaInicial: string,
  fechaFinal: string,
  codigoSucursal: number[],
): Promise<ReporteVentasArticuloComercioData> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    client.setHeader('authorization', `Bearer ${token}`)

    const data = await client.request(queryReporteVentasPorArticuloComercio, {
      fechaInicial,
      fechaFinal,
      codigoSucursal,
    })

    return data as ReporteVentasArticuloComercioData
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
    console.error('Error en obtenerReporteVentasPorArticuloComercio', error)
    throw new MyGraphQlError(error)
  }
}
