/**
 * Homologación de la moneda
 * Codigo debe ser igual al codigo del sin
 */
export interface MonedaProps {
  codigo: number // codigo del sin
  descripcion: string
  sigla: string
  tipoCambio: number
  tipoCambioCompra?: number
  activo: 0 | 1
  usucre?: string
  usumod?: string
  createdAt?: string
  updatedAt?: string
}

export interface MonedaPrecioOperacionProp {
  moneda: MonedaProps
  precioBase: number // Precio base multiplicador por el factor de ajuste
  precio: number
}

/**
 * Relacion entre moneda y precio
 */
export interface MonedaPrecioProp {
  moneda: MonedaProps
  precioBase: number // Precio base multiplicador por el factor de ajuste
  precio: number
  precioComparacion?: number | null
  manual: boolean // Si es false, no multiplica factorAjuste * precioBase
}

export interface MonedaPrecioApiInputProp {
  precioBase: number
  precio: number
  manual: boolean
}
