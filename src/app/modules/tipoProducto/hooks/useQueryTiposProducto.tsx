import { QueryKey } from '@tanstack/query-core'
import { useQuery } from '@tanstack/react-query'

import { apiTipoProductoListado } from '../api/tipoProductoListado.api'
import { TipoProductoProps } from '../interfaces/tipoProducto.interface'

/**
 * Hook para listado básico de tipos de producto
 * limit 1000
 */
const useQueryTiposProducto = (queryKey: QueryKey = []) => {
  const {
    data: tiposProducto,
    isLoading: tpLoading,
    isError: tpIsError,
    error: tpError,
    refetch: tpRefetch,
  } = useQuery<TipoProductoProps[], Error>({
    queryKey: ['tiposProducto', ...queryKey],
    queryFn: async () => {
      const resp = await apiTipoProductoListado()
      if (resp.length > 0) {
        return resp
      }
      return []
    },
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  })

  return { tiposProducto, tpLoading, tpIsError, tpError, tpRefetch }
}

export default useQueryTiposProducto
