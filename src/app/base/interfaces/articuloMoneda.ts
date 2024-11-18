import { MonedaProps } from './monedaPrecio'

/**
 * Articulo Moneda
 */
export interface ArticuloMonedaProps {
  monedaPrimaria: MonedaProps
  monedaAdicional1: MonedaProps | null
  monedaAdicional2: MonedaProps | null
  monedaAdicional3: MonedaProps | null
  state?: string
  usucre?: string
  usumod?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ArticuloMonedaInputProps {
  moneda: number
}
export const ARTICULO_MONEDA_INITIAL_VALUES: ArticuloMonedaInputProps = {
  moneda: 0,
}
