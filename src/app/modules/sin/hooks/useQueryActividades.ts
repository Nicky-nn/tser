import {useQuery} from "@tanstack/react-query";
import {QueryKey} from "@tanstack/query-core";
import {SinActividadesProps} from "../interfaces/sin.interface";
import {fetchSinActividadesPorDocumentoSector} from "../api/sinActividadesPorDocumentoSector";

/**
 * Hook para listado básico de tipos de producto
 * limit 1000
 */
const useQueryActividades = (queryKey: QueryKey = []) => {
    const {
        data: actividades,
        isLoading: actLoading,
        isError: actIsError,
        error: actError,
    } = useQuery<SinActividadesProps[], Error>(['actividadesPorDocumentoSector', ...queryKey], async () => {
        const resp = await fetchSinActividadesPorDocumentoSector();
        if (resp.length > 0) {
            return resp
        }
        return []
    })

    return {actividades, actLoading, actIsError, actError}
};

export default useQueryActividades;
