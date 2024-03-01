import React, { FC } from 'react'

import useSettings from '../../../hooks/useSettings'
import MatxSuspense from '../MatxSuspense/MatxSuspense'
import { MatxLayouts } from './index'

const MatxLayout: FC<any> = (props) => {
  const { settings } = useSettings()
  const Layout = MatxLayouts[settings.activeLayout]

  return (
    <MatxSuspense>
      <Layout {...props} />
    </MatxSuspense>
  )
}

export default MatxLayout
