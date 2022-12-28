import React, { FunctionComponent } from 'react'

import { ProductoVarianteInputProps } from '../../../interfaces/producto.interface'

interface OwnProps {
  variante: ProductoVarianteInputProps
}

type Props = OwnProps

const PrecioInventarioDetalle: FunctionComponent<Props> = (props) => {
  const { variante, ...other } = props
  return <pre>{JSON.stringify(variante, null, 2)}</pre>
}

export default PrecioInventarioDetalle
