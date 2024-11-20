import { Download } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import exportFromJSON from 'export-from-json'
import {
  MaterialReactTable,
  MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table'
import { FunctionComponent, useMemo } from 'react'

import MuiRenderTopToolbarCustomActions from '../../../../base/components/MuiTable/MuiRenderTopToolbarCustomActions'
import { MuiToolbarAlertBannerProps } from '../../../../utils/muiTable/materialReactTableUtils'
import { MuiTableNormalOptionsProps } from '../../../../utils/muiTable/muiTableNormalOptionsProps'
import { notDanger } from '../../../../utils/notification'
import { swalClose, swalLoading } from '../../../../utils/swal'
import {
  obtenerReporteVentasPorArticuloComercio,
  ReportePedidoVentasPorArticuloComercio,
} from '../../../pos/api/reporteVentasArticulo'
import { VacListadoColumns } from './VacListadoColumns'

interface OwnProps {
  fechaInicial: Date
  fechaFinal: Date
  codigoSucursal: number[]
}

type Props = OwnProps

/**
 * Listado de articulos mas vendidos por punto de venta
 * @param props
 * @constructor
 */
const VacListado: FunctionComponent<Props> = (props) => {
  const { fechaInicial, fechaFinal, codigoSucursal } = props

  const fi = format(fechaInicial, 'dd/MM/yyyy')
  const ff = format(fechaFinal, 'dd/MM/yyyy')

  const columns = useMemo(() => VacListadoColumns(), [])
  // API FETCH
  const {
    data: respData,
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['vapvListado', fechaInicial, fechaFinal, codigoSucursal],
    queryFn: async () => {
      if (!fechaInicial || !fechaFinal) return []
      return await obtenerReporteVentasPorArticuloComercio(fi, ff, codigoSucursal)
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const onExportar = async () => {
    if (!respData) return
    if (respData?.length === 0) {
      notDanger('No se encontraron ventas en el periodo seleccionado')
      return
    }
    swalLoading()
    const exportType = exportFromJSON.types.csv
    const fi = format(fechaInicial, 'dd/MM/yyyy')
    const ff = format(fechaFinal, 'dd/MM/yyyy')
    exportFromJSON({
      data: respData.map((item) => ({
        sucursal: item.sucursal,
        puntoVenta: item.puntoVenta,
        fechaInicial: fi,
        fechaFinal: ff,
        codigoArticulo: item.codigoArticulo,
        articulo: item.nombreArticulo,
        nroVentas: item.nroVentas,
        montoVentas: item.montoVentas,
        montoDescuento: item.montoDescuento,
        montoDescuentoAdicional: item.montoDescuentoAdicional,
        moneda: item.moneda,
      })),
      fileName: `rep_articulos_comercio_${fi}_${ff}`,
      exportType,
      delimiter: ';',
      withBOM: true,
    })
    swalClose()
  }

  const table = useMaterialReactTable({
    ...(MuiTableNormalOptionsProps as MRT_TableOptions<ReportePedidoVentasPorArticuloComercio>),
    columns: columns,
    data: respData || [],
    muiToolbarAlertBannerProps: MuiToolbarAlertBannerProps(isError),
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      density: 'compact',
    },
    enableColumnActions: false,
    enableRowActions: false,
    renderTopToolbarCustomActions: () => (
      <MuiRenderTopToolbarCustomActions refetch={refetch}>
        <Button
          variant={'outlined'}
          size={'small'}
          startIcon={<Download />}
          onClick={() => onExportar()}
        >
          Exportar
        </Button>
      </MuiRenderTopToolbarCustomActions>
    ),
  })

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  )
}

export default VacListado
