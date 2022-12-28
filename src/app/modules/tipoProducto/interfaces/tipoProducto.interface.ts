export interface TipoProductoProps {
  _id: string
  codigoParent: string | null
  descripcion: string
  parientes: string
}

export interface TipoProductoListProps extends TipoProductoProps {
  state: string
  createdAt: string
  updatedAt?: string
  usucre: string
  usumod?: string
}

export interface TipoProductoInputProp {
  codigoParent: string | null
  descripcion: string
}

export const TIPO_PRODUCTO_INITIAL_VALUES: TipoProductoInputProp = {
  codigoParent: null,
  descripcion: '',
}
