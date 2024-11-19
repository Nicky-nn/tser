import { RestriccionListadoProps } from '../cuenta/api/usuarioRestriccion.api'

/**
 * Composicion de restricciones de punto de venta
 * @param codigoSucursal
 * @param restriccion
 */
export const restriccionPuntoVentaCompose = (
  codigoSucursal: number,
  restriccion: RestriccionListadoProps[],
): { key: number; value: string }[] => {
  const sucursales = restriccion.find((item) => item.codigo === codigoSucursal)
  if (!sucursales) return []
  return sucursales.puntosVenta.map((item) => ({
    key: item.codigo,
    value: `S ${codigoSucursal} - PV ${item.codigo}`,
  }))
}
