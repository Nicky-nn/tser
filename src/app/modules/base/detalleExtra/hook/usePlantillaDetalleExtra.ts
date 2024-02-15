import { QueryKey } from '@tanstack/query-core'
import { useQuery } from '@tanstack/react-query'

import { PlantillaDetalleExtra } from '../../../../interfaces'
import { apiPlantillaDetalleExtra } from '../../../ventas/api/plantillaDetalleExtra.api'

/**
 * Hook para listado básico de tipos de producto
 * limit 1000
 */
const usePlantillaDetalleExtra = (queryKey: QueryKey = []) => {
  const {
    data: plantillaDetalleExtra,
    isLoading: pdeLoading,
    isError: pdeIsError,
    error: pdeError,
  } = useQuery<PlantillaDetalleExtra[], Error>({
    queryKey: ['plantillaDetalleExtra', ...queryKey],
    queryFn: async () => {
      const resp = await apiPlantillaDetalleExtra()
      if (resp.length > 0) {
        return resp
      }
      return []
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  return { plantillaDetalleExtra, pdeLoading, pdeIsError, pdeError }
}

export default usePlantillaDetalleExtra
