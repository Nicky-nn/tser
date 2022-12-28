import { QueryKey } from '@tanstack/query-core'
import { useQuery } from '@tanstack/react-query'
import { MetodoPagoProp } from '../interfaces/metodoPago'
import { apiMetodosPago } from '../api/metodosPago.api'

/**
 * Hook para listado de métodos de págo
 * limit 1000
 */
const useQueryMetodosPago = (queryKey: QueryKey = []) => {
  const {
    data: metodosPago,
    isLoading: mpLoading,
    isError: mpIsError,
    error: mpError,
  } = useQuery<MetodoPagoProp[], Error>(['metodosPago', ...queryKey], async () => {
    const resp = await apiMetodosPago()
    if (resp.length > 0) {
      return resp
    }
    return []
  })

  return { metodosPago, mpLoading, mpIsError, mpError }
}

export default useQueryMetodosPago
