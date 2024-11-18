import { useContext } from 'react'

import OperacionesContext from '../contexts/OperacionesContext'

const useOperaciones = () => useContext(OperacionesContext)

export default useOperaciones
