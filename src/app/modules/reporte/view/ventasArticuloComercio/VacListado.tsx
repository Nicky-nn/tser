import { Download, PictureAsPdf } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import exportFromJSON from 'export-from-json'
import {
  MaterialReactTable,
  MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table'
import pdfMake from 'pdfmake/build/pdfmake'
import { FunctionComponent, useMemo } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import MuiRenderTopToolbarCustomActions from '../../../../base/components/MuiTable/MuiRenderTopToolbarCustomActions'
import TipoDeDescarga from '../../../../base/components/RepresentacionGrafica/TipoDeDescarga'
import useAuth from '../../../../base/hooks/useAuth'
import { MuiToolbarAlertBannerProps } from '../../../../utils/muiTable/materialReactTableUtils'
import { MuiTableNormalOptionsProps } from '../../../../utils/muiTable/muiTableNormalOptionsProps'
import { notDanger } from '../../../../utils/notification'
import { swalClose, swalLoading } from '../../../../utils/swal'
import {
  obtenerReporteVentasPorArticuloComercio,
  ReportePedidoVentasPorArticuloComercio,
} from '../../../pos/api/reporteVentasArticulo'
import { VacListadoColumns } from './VacListadoColumns'
;(pdfMake as any).fonts = {
  Roboto: {
    normal:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
  },
}
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
  const {
    user: { usuario, razonSocial, sucursal },
  } = useAuth()
  const mySwal = withReactContent(Swal)

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

  const generarPdf = async () => {
    let tipoDescarga: string | undefined

    // Mostrar el SweetAlert
    await mySwal.fire({
      title: 'Selecciona el formato del PDF',
      html: (
        <TipoDeDescarga
          onSelected={(value) => {
            tipoDescarga = value
            mySwal.close() // Cierra el modal una vez seleccionado
          }}
        />
      ),
      showCancelButton: false,
      showCloseButton: true,
      showConfirmButton: false,
      didOpen: () => {
        // Importante para manejar eventos React dentro del modal
        mySwal.getHtmlContainer()?.addEventListener('click', () => {})
      },
    })

    if (!tipoDescarga) return

    if (!respData || respData.length === 0) {
      notDanger('No hay datos para generar el PDF.')
      return
    }

    const groupedData = respData.reduce((acc: any, item: any) => {
      if (!acc[item.sucursal]) acc[item.sucursal] = {}
      if (!acc[item.sucursal][item.tipoArticulo])
        acc[item.sucursal][item.tipoArticulo] = {}
      if (!acc[item.sucursal][item.tipoArticulo][item.unidadMedida]) {
        acc[item.sucursal][item.tipoArticulo][item.unidadMedida] = {}
      }
      if (!acc[item.sucursal][item.tipoArticulo][item.unidadMedida][item.puntoVenta]) {
        acc[item.sucursal][item.tipoArticulo][item.unidadMedida][item.puntoVenta] = []
      }
      acc[item.sucursal][item.tipoArticulo][item.unidadMedida][item.puntoVenta].push(item)
      return acc
    }, {})

    // Genera el documento según el formato seleccionado
    const pdfDefinition =
      tipoDescarga === 'pdf'
        ? generateLetterPDF(groupedData)
        : generateRolloPDF(groupedData)

    // Descarga el PDF
    //@ts-ignore
    const pdfDocGenerator = pdfMake.createPdf(pdfDefinition)
    pdfDocGenerator.download(
      `reporte_ventas_${format(fechaInicial, 'yyyyMMdd')}_${format(
        fechaFinal,
        'yyyyMMdd',
      )}_${tipoDescarga}.pdf`,
    )
  }

  const generateLetterPDF = (groupedData: any) => {
    return {
      pageSize: 'LETTER',
      pageMargins: [40, 40, 40, 40],
      footer: function (currentPage: any, pageCount: any) {
        return {
          text: `Página ${currentPage.toString()} de ${pageCount}`,
          alignment: 'center',
          fontSize: 9,
          margin: [0, 10, 0, 10],
        }
      },
      content: [
        { text: 'Reporte Detallado de Ventas por Artículo', style: 'header' },
        {
          text: `Fecha de Generación: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
          style: 'subheader',
        },
        {
          text: `Período: ${format(fechaInicial, 'dd/MM/yyyy')} - ${format(fechaFinal, 'dd/MM/yyyy')}`,
          style: 'subheader',
        },
        {
          text: `${razonSocial}`,
          style: 'subheader',
        },
        {
          text: `Casa Matriz: ${sucursal.codigo} - ${sucursal.direccion}`,
          style: 'subheader',
        },
        {
          text: `Generado por: ${usuario}`,
          style: 'subheader',
        },
        { text: '\n' },
        // Aquí agregamos el punto de venta en el agrupamiento
        ...Object.keys(groupedData).map((sucursalKey) => ({
          stack: [
            { text: `Sucursal: ${sucursalKey}`, style: 'personalitySucursal' },
            // Recorremos los tipos de artículo por sucursal
            ...Object.keys(groupedData[sucursalKey]).map((tipoArticuloKey) => ({
              stack: [
                { text: `Tipo de Artículo: ${tipoArticuloKey}`, style: 'subheader' },
                // Recorremos las unidades de medida por tipo de artículo
                ...Object.keys(groupedData[sucursalKey][tipoArticuloKey]).map(
                  (unidadMedidaKey) => ({
                    stack: [
                      // Aquí añadimos puntoVenta al loop de unidades de medida
                      ...Object.keys(
                        groupedData[sucursalKey][tipoArticuloKey][unidadMedidaKey],
                      ).map((puntoVentaKey) => ({
                        stack: [
                          {
                            text: `Punto de Venta: ${puntoVentaKey}`,
                            style: 'subheader',
                          },
                          {
                            table: {
                              headerRows: 1,
                              widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
                              body: [
                                [
                                  { text: 'Producto', style: 'tableHeader' },
                                  { text: 'Cantidad Ventas', style: 'tableHeader' },
                                  { text: 'Monto Ventas', style: 'tableHeader' },
                                  { text: 'Descuento', style: 'tableHeader' },
                                  { text: 'Desc. Adicional', style: 'tableHeader' },
                                  { text: 'Total Final', style: 'tableHeader' },
                                ],
                                ...groupedData[sucursalKey][tipoArticuloKey][
                                  unidadMedidaKey
                                ][puntoVentaKey].map((item: any) => [
                                  item.nombreArticulo,
                                  { text: item.nroVentas, alignment: 'center' },
                                  {
                                    text: `${item.montoVentas.toFixed(2)}`,
                                    alignment: 'right',
                                  },
                                  {
                                    text: `${item.montoDescuento.toFixed(2)}`,
                                    alignment: 'right',
                                  },
                                  {
                                    text: `${item.montoDescuentoAdicional.toFixed(2)}`,
                                    alignment: 'right',
                                  },
                                  {
                                    text: `${(
                                      item.montoVentas -
                                      item.montoDescuento -
                                      item.montoDescuentoAdicional
                                    ).toFixed(2)}`,
                                    alignment: 'right',
                                  },
                                ]),
                              ],
                            },
                            layout: 'lightHorizontalLines',
                          },
                          { text: '\n' },
                        ],
                      })),
                    ],
                  }),
                ),
              ],
            })),
          ],
        })),
      ],
      styles: {
        personalitySucursal: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
          fillColor: '#f8f9fa',
        },
        header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        subheader: { fontSize: 12, alignment: 'center', color: 'gray' },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 20, 0, 10] },
        tableHeader: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
          fillColor: '#f8f9fa',
        },
        subsubheader: { fontSize: 12, bold: true, margin: [0, 5, 0, 5] },
        totalHeader: { fontSize: 12, bold: true, alignment: 'right' },
        totalValue: { fontSize: 12, bold: true, alignment: 'right' },
      },
      defaultStyle: {
        fontSize: 10,
      },
    }
  }

  const generateRolloPDF = (groupedData: any) => {
    return {
      pageSize: { width: 227, height: 'auto' },
      pageMargins: [10, 10, 10, 10],
      content: [
        { text: 'Reporte Detallado de Ventas', style: 'header' },
        {
          text: `Fecha: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
          style: 'subheader',
        },
        { text: `${razonSocial}`, style: 'subheader' },
        {
          text: `Sucursal: ${sucursal.codigo} - ${sucursal.direccion}`,
          style: 'subheader',
        },
        { text: `Usuario: ${usuario}`, style: 'subheader' },
        { text: '\n' },
        ...Object.keys(groupedData).map((sucursalKey) => ({
          stack: [
            { text: `Sucursal: ${sucursalKey}`, style: 'sectionHeader' },
            ...Object.keys(groupedData[sucursalKey]).map((tipoArticuloKey) => ({
              stack: [
                { text: `Tipo de Artículo: ${tipoArticuloKey}`, style: 'subsubheader' },
                ...Object.keys(groupedData[sucursalKey][tipoArticuloKey]).map(
                  (unidadMedidaKey) => ({
                    stack: [
                      ...Object.keys(
                        groupedData[sucursalKey][tipoArticuloKey][unidadMedidaKey],
                      ).map((puntoVentaKey) => ({
                        stack: [
                          {
                            text: `Punto de Venta: ${puntoVentaKey}`,
                            style: 'subsubheader',
                          },
                          {
                            table: {
                              headerRows: 1,
                              widths: ['*', 'auto', 'auto'],
                              body: [
                                [
                                  { text: 'Producto', style: 'tableHeader' },
                                  { text: 'Cantidad', style: 'tableHeader' },
                                  { text: 'Total', style: 'tableHeader' },
                                ],
                                ...groupedData[sucursalKey][tipoArticuloKey][
                                  unidadMedidaKey
                                ][puntoVentaKey].map((item: any) => [
                                  item.nombreArticulo,
                                  { text: item.nroVentas, alignment: 'center' },
                                  {
                                    text: `${(
                                      item.montoVentas -
                                      item.montoDescuento -
                                      item.montoDescuentoAdicional
                                    ).toFixed(2)}`,
                                    alignment: 'right',
                                  },
                                ]),
                              ],
                            },
                            layout: 'noBorders',
                          },
                          { text: '\n' },
                        ],
                      })),
                    ],
                  }),
                ),
              ],
            })),
          ],
        })),
      ],
      styles: {
        header: { fontSize: 12, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        subheader: { fontSize: 10, alignment: 'center', color: 'gray' },
        sectionHeader: { fontSize: 11, bold: true, margin: [0, 5, 0, 2] },
        subsubheader: { fontSize: 10, bold: true, margin: [0, 2, 0, 2] },
        tableHeader: { fontSize: 10, bold: true, fillColor: '#e9ecef' },
      },
      defaultStyle: {
        fontSize: 9,
      },
    }
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
        <Button
          variant={'outlined'}
          size={'small'}
          startIcon={<PictureAsPdf />}
          onClick={() => generarPdf()}
        >
          Generar PDF
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
