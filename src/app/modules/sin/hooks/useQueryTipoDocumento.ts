import { QueryKey } from '@tanstack/query-core'
import { QueryObserverOptions, useQuery } from '@tanstack/react-query'

import { fetchSinTipoDocumentoIdentidad } from '../api/sinTipoDocumentoIdentidad.api'
import { SinTipoDocumentoIdentidadProps } from '../interfaces/sin.interface'

/**
 * Hook para listado básico de tipos de producto
 * limit 1000
 */
const useQueryTipoDocumentoIdentidad = (
  queryKey: QueryKey = [],
  options: QueryObserverOptions = {},
) => {
  const {
    data: tiposDocumentoIdentidad,
    isLoading: tdiLoading,
    isError: tdiIsError,
    error: tdiError,
    isSuccess: tdIsSuccess,
  } = useQuery<SinTipoDocumentoIdentidadProps[], Error>(
    ['tipoDocumentoIdentidad', ...queryKey],
    async () => {
      const resp = await fetchSinTipoDocumentoIdentidad()
      if (resp.length > 0) {
        return resp
      }
      return []
    },
    <Omit<any, any>>{ ...options },
  )

  return { tiposDocumentoIdentidad, tdiLoading, tdiIsError, tdiError, tdIsSuccess }
}

export default useQueryTipoDocumentoIdentidad
