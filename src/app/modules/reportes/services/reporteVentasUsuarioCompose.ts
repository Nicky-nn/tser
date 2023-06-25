import { uniqBy } from 'lodash'

import { apiEstado } from '../../../interfaces'
import { ReporteVentasUsuarioProps } from '../api/reporteVentasUsuario.api'

export interface ReporteVentasUsuarioDetalleComposeProps {
  usuario: string
  nroValidadas: number
  nroAnuladas: number
  nroParcialFacturas: number
  montoValidadas: number
  montoAnuladas: number
  montoParcialFacturas: number
}

export interface ReporteVentasUsuarioComposeProps {
  nroTotalFacturas: number
  montoTotalFacturas: number
  detalle: ReporteVentasUsuarioDetalleComposeProps[]
}

/**
 * @description Composicion de datos para los reportes
 * @param data
 */
export const reporteVentasUsuarioCompose = (
  data: ReporteVentasUsuarioProps[],
): ReporteVentasUsuarioComposeProps | null => {
  try {
    const newData: ReporteVentasUsuarioDetalleComposeProps[] = []
    const usuarios = uniqBy(data, 'usuario')
    if (usuarios.length === 0) return null

    let nroTotalFacturas = 0
    let montoTotalFacturas = 0

    for (const usuario of usuarios) {
      // Iteramos todos los items
      let nroValidadas = 0
      let nroAnuladas = 0
      let montoValidadas = 0
      let montoAnuladas = 0

      for (const d of data) {
        if (d.usuario === usuario.usuario) {
          if (d.state === apiEstado.validada) {
            nroValidadas += d.numeroFacturas
            montoValidadas += d.montoTotal
          }
          if ([apiEstado.anulado, apiEstado.eliminado].includes(d.state)) {
            nroAnuladas += d.numeroFacturas
            montoAnuladas += d.montoTotal
          }
        }
      }

      newData.push({
        usuario: usuario.usuario,
        nroValidadas,
        nroAnuladas,
        montoValidadas,
        montoAnuladas,
        nroParcialFacturas: nroValidadas + nroAnuladas,
        montoParcialFacturas: montoValidadas - montoAnuladas,
      })
      nroTotalFacturas += nroValidadas + nroAnuladas
      montoTotalFacturas += montoValidadas - montoAnuladas
    }

    return {
      nroTotalFacturas,
      montoTotalFacturas,
      detalle: newData,
    }
  } catch (e) {
    throw new Error('Error en generacion del reporte')
  }
}
