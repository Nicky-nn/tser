import { Fragment } from 'react'

import RowCards from '../../../base/view/shared/RowCards'
import StatCards from '../../../base/view/shared/StatCards'
import Licencia from '../../../modules/empresa/modules/licencia/view/listado/Licencia'

/**
 * @description Dashboard inicial
 * @constructor
 */
const Home = () => {
  return (
    <Fragment>
      <Licencia />
    </Fragment>
  )
}

export default Home
