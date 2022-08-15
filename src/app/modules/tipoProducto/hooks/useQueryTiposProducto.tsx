import {useQuery} from "@tanstack/react-query";
import {TipoProductoProps} from "../interfaces/tipoProducto.interface";
import {apiTiposProducto} from "../../productos/api/productoTipo.api";
import {QueryKey} from "@tanstack/query-core";

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
        refetch: tpRefetch
    } = useQuery<TipoProductoProps[], Error>(['tiposProducto', ...queryKey], async () => {
        const resp = await apiTiposProducto();
        if (resp.length > 0) {
            return resp
        }
        return []
    })

    return {tiposProducto, tpLoading, tpIsError, tpError, tpRefetch}
};

export default useQueryTiposProducto;
