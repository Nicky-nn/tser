/* eslint-disable no-unused-vars */
import { BarChart as BarChartIcon, Close, ImportExport, Print } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  Dialog as PrintDialog,
  DialogActions,
  DialogActions as PrintDialogActions,
  DialogContent,
  DialogContent as PrintDialogContent,
  DialogTitle,
  DialogTitle as PrintDialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { es } from 'date-fns/locale'
import dayjs from 'dayjs'
import * as pdfMake from 'pdfmake/build/pdfmake'
import printJS from 'print-js'
import { FunctionComponent, useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { BarChart, Cell, Rectangle } from 'recharts'
import { Bar, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import Swal from 'sweetalert2'

import { SimpleItem } from '../../../../base/components/Container/SimpleItem'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import useAuth from '../../../../base/hooks/useAuth'
import { apiUsuarioRestriccion } from '../../../base/cuenta/api/usuarioRestriccion.api'
import { UsuarioRestriccionProps } from '../../../base/cuenta/interfaces/restriccion.interface'
import { obtenerReporteVentasPorArticuloPuntoVenta } from '../../api/reporteVentasArticulo'

// Configure pdfMake fonts
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

interface Sucursal {
  codigo: number
  telefono: string
  direccion: string
  departamento: {
    codigo: number
    codigoPais: number
    sigla: string
    departamento: string
  }
  municipio: string
  puntosVenta: PuntoVenta[]
}

interface PuntoVenta {
  codigo: number
  tipoPuntoVenta: {
    codigoClasificador: string
    descripcion: string
  }
  nombre: string
  descripcion: string
}

interface ChartData {
  nombreArticulo: string
  nroVentas: number
  montoVentas: number
}

registerLocale('es', es)

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: any) => void
}

type Props = OwnProps

const PedidosReporteVentaArticuloDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const [checkedPedidos, setCheckedPedidos] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null)
  const [selectedPuntosVenta, setSelectedPuntosVenta] = useState<PuntoVenta[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [openPrintDialog, setOpenPrintDialog] = useState(false)
  const [chartData, setChartData] = useState<ChartData[]>([])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    if (!event.target.checked) {
      setStartDate(new Date())
      setEndDate(null)
    }
  }

  const handleChangePedido = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedPedidos(event.target.checked)
  }

  const {
    user: { usuario, sucursal, puntoVenta, rol, tipo },
  } = useAuth()

  const { data: sucursales, isLoading: loadingSucursalPuntoVenta } =
    useQuery<UsuarioRestriccionProps>({
      queryKey: ['sucursalPuntoVenta'],
      queryFn: async () => {
        const data = await apiUsuarioRestriccion()
        return data || []
      },
      refetchOnWindowFocus: false,
      refetchInterval: false,
    })

  const generateRollPDF = (groupedBySucursal: any) => {
    return {
      pageSize: { width: 180, height: 'auto' as 'auto' },
      pageMargins: [0, 0, 0, 0] as [number, number, number, number],
      content: [
        { text: 'Resumen de Ventas Artículo Punto de Venta', style: 'header' },
        { text: `Fecha: ${new Date().toLocaleDateString()}`, style: 'subheader' },
        ...Object.keys(groupedBySucursal).map((sucursalKey) => ({
          stack: [
            { text: `Sucursal: ${sucursalKey}`, style: 'sectionHeader' },
            {
              table: {
                widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  ['Producto', 'Ventas', 'Monto V.', 'Desc.', 'Desc. Ad.'],
                  ...groupedBySucursal[sucursalKey].map((item: any) => [
                    item.nombreArticulo,
                    item.nroVentas,
                    `${item.montoVentas}`,
                    `${item.montoDescuento}`,
                    `${item.montoDescuentoAdicional}`,
                  ]),
                ],
              },
              style: 'table',
            },
          ],
        })),
      ],
      styles: {
        header: { fontSize: 9, bold: true, alignment: 'center' },
        subheader: { fontSize: 9, alignment: 'center' },
        sectionHeader: { fontSize: 9, bold: true, margin: [0, 10] },
        table: { fontSize: 8 },
      },
    }
  }

  const generateLetterPDF = (groupedBySucursal: any) => {
    return {
      pageSize: 'LETTER',
      pageMargins: [40, 40, 40, 40],
      content: [
        { text: 'Reporte Detallado de Ventas por Artículo', style: 'header' },
        {
          text: `Fecha de Generación: ${new Date().toLocaleDateString()}`,
          style: 'subheader',
        },
        { text: '\n' },
        ...Object.keys(groupedBySucursal).map((sucursalKey) => ({
          stack: [
            { text: `Sucursal: ${sucursalKey}`, style: 'sectionHeader' },
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
                  ...groupedBySucursal[sucursalKey].map((item: any) => [
                    item.nombreArticulo,
                    { text: item.nroVentas, alignment: 'center' },
                    { text: `${item.montoVentas.toFixed(2)}`, alignment: 'right' },
                    { text: `${item.montoDescuento.toFixed(2)}`, alignment: 'right' },
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
            {
              table: {
                widths: ['*', 'auto'],
                body: [
                  [
                    { text: 'Total Ventas:', style: 'totalHeader' },
                    {
                      text: `${groupedBySucursal[sucursalKey]
                        .reduce((sum: number, item: any) => sum + item.nroVentas, 0)
                        .toFixed(0)}`,
                      style: 'totalValue',
                    },
                  ],
                  [
                    { text: 'Monto Total:', style: 'totalHeader' },
                    {
                      text: `${groupedBySucursal[sucursalKey]
                        .reduce(
                          (sum: number, item: any) =>
                            sum +
                            (item.montoVentas -
                              item.montoDescuento -
                              item.montoDescuentoAdicional),
                          0,
                        )
                        .toFixed(2)}`,
                      style: 'totalValue',
                    },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
        })),
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        subheader: { fontSize: 12, alignment: 'center', color: 'gray' },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 20, 0, 10] },
        tableHeader: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
          fillColor: '#f8f9fa',
        },
        totalHeader: { fontSize: 12, bold: true, alignment: 'right' },
        totalValue: { fontSize: 12, bold: true, alignment: 'right' },
      },
      defaultStyle: {
        fontSize: 10,
      },
    }
  }

  const handlePrint = async (type: 'roll' | 'letter') => {
    setOpenPrintDialog(false)
    setLoading(true)

    const fechaInicialTurno = dayjs(checked ? startDate : selectedDate)
      .hour(0)
      .minute(0)
      .format('DD/MM/YYYY')
    const fechaFinalTurno = dayjs(checked ? endDate : selectedDate)
      .hour(23)
      .minute(59)
      .format('DD/MM/YYYY')

    const codigoSucursal =
      tipo === 'ADMIN' && selectedSucursal ? selectedSucursal.codigo : sucursal.codigo
    const codigoPuntoVenta =
      tipo === 'ADMIN' && selectedSucursal
        ? selectedPuntosVenta.map((punto) => punto.codigo)
        : [puntoVenta.codigo]

    try {
      const resp = await obtenerReporteVentasPorArticuloPuntoVenta(
        fechaInicialTurno,
        fechaFinalTurno,
        codigoSucursal,
        codigoPuntoVenta,
        checkedPedidos,
      )

      if (resp.restReportePedidoVentasPorArticuloPuntoVenta.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Sin datos',
          text: 'No hay datos o reporte disponible en la fecha seleccionada.',
        })
        setLoading(false)
        return
      }

      const groupedBySucursal = resp.restReportePedidoVentasPorArticuloPuntoVenta.reduce(
        (acc: { [key: string]: any[] }, item) => {
          if (!acc[item.sucursal]) {
            acc[item.sucursal] = []
          }
          acc[item.sucursal].push(item)
          return acc
        },
        {},
      )

      const docDefinition =
        type === 'roll'
          ? generateRollPDF(groupedBySucursal)
          : generateLetterPDF(groupedBySucursal)

      // @ts-ignore
      const pdfDocGenerator = pdfMake.createPdf(docDefinition)

      if (type === 'roll') {
        const printerSettings = localStorage.getItem('printers')
        let selectedPrinter = ''
        if (printerSettings) {
          const parsedSettings = JSON.parse(printerSettings)
          selectedPrinter = parsedSettings.comanda
        }

        if (selectedPrinter) {
          pdfDocGenerator.getBlob((blob: Blob) => {
            const formData = new FormData()
            formData.append('file', blob, 'reporte_ventas.pdf')
            formData.append('printer', selectedPrinter)
            fetch('http://localhost:7777/print', {
              method: 'POST',
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.error) {
                  toast.error(`Error al imprimir: ${data.error}`)
                } else {
                  toast.success('Impresión iniciada')
                }
              })
              .catch((error) => {
                toast.error(`Error al imprimir: ${error.message}`)
              })
          })
        } else {
          pdfDocGenerator.getBlob((blob: any) => {
            const pdfUrl = URL.createObjectURL(blob)
            printJS({
              printable: pdfUrl,
              type: 'pdf',
              style:
                '@media print { @page { size: 100%; margin: 0mm; } body { width: 100%; } }',
            })
          })
        }
      } else {
        // Para tamaño carta, descarga automática
        pdfDocGenerator.download(`reporte_ventas_${dayjs().format('DD-MM-YYYY')}.pdf`)
      }
    } catch (error) {
      toast.error('Error al generar el reporte')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const graficoVentas = async () => {
    const fechaInicialTurno = dayjs(checked ? startDate : selectedDate)
      .hour(0)
      .minute(0)
      .format('DD/MM/YYYY')
    const fechaFinalTurno = dayjs(checked ? endDate : selectedDate)
      .hour(23)
      .minute(59)
      .format('DD/MM/YYYY')

    const codigoSucursal =
      tipo === 'ADMIN' && selectedSucursal ? selectedSucursal.codigo : sucursal.codigo
    const codigoPuntoVenta =
      tipo === 'ADMIN' && selectedSucursal
        ? selectedPuntosVenta.map((punto) => punto.codigo)
        : [puntoVenta.codigo]

    const resp = await obtenerReporteVentasPorArticuloPuntoVenta(
      fechaInicialTurno,
      fechaFinalTurno,
      codigoSucursal,
      codigoPuntoVenta,
      checkedPedidos,
    )

    if (resp.restReportePedidoVentasPorArticuloPuntoVenta.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos o reporte disponible en la fecha seleccionada.',
      })
      setLoading(false)
      return
    }

    const ventasFiltradas = resp.restReportePedidoVentasPorArticuloPuntoVenta.filter(
      (articulo) => articulo.nroVentas > 0,
    )

    const data = ventasFiltradas.map((articulo) => ({
      nombreArticulo: truncateName(articulo.nombreArticulo, 8),
      nroVentas: articulo.nroVentas,
      montoVentas: articulo.montoVentas,
    }))

    setChartData(data)
    setOpenModal(true)
    setLoading(false)
  }

  useEffect(() => {
    if (open) {
      setStartDate(new Date())
      setEndDate(null)
      setSelectedDate(new Date())
    }
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '90%', maxHeight: 600, height: 700 } }}
        maxWidth={tipo === 'ADMIN' ? 'md' : 'sm'}
        open={open}
        {...other}
      >
        <DialogTitle>Exportar Reporte de Ventas por Artículo</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item sm={6}>
              {checked && (
                <SimpleItem>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: [Date | null, Date | null]) => {
                      setStartDate(date[0])
                      setEndDate(date[1])
                    }}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange={checked}
                    locale="es"
                    inline
                  />
                </SimpleItem>
              )}
              {!checked && (
                <SimpleItem>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date) => setSelectedDate(date)}
                    locale={'es'}
                    inline
                  />
                </SimpleItem>
              )}
            </Grid>
            <Grid item sm={6}>
              <Alert color={'info'}>
                Seleccione el día o rango de fechas para obtener el reporte de ventas
                simple.
              </Alert>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={handleChange} color="primary" />
                }
                label="Con Rango de Fechas"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedPedidos}
                    onChange={handleChangePedido}
                    color="primary"
                  />
                }
                label="Mostrar todos los pedidos"
              />
              {!checked && (
                <TextField
                  sx={{ mt: 3 }}
                  fullWidth
                  label="Fecha Seleccionada"
                  value={dayjs(selectedDate).format('DD/MM/YYYY') || ''}
                  size="small"
                />
              )}
              {checked && (
                <>
                  <TextField
                    sx={{ mt: 3 }}
                    fullWidth
                    label="Fecha Inicial"
                    value={dayjs(startDate).format('DD/MM/YYYY') || ''}
                    size="small"
                  />
                  <TextField
                    sx={{ mt: 3 }}
                    fullWidth
                    label="Fecha Final"
                    value={dayjs(endDate).format('DD/MM/YYYY') || ''}
                    size="small"
                  />
                </>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            disabled={loading}
            color={'error'}
            variant={'contained'}
            size={'small'}
            onClick={() => onClose()}
          >
            Cancelar
          </Button>
          <LoadingButton
            loading={loading}
            disabled={!dayjs(startDate).isValid()}
            onClick={() => setOpenPrintDialog(true)}
            startIcon={<Print />}
            loadingPosition="start"
            size={'small'}
            variant={'contained'}
          >
            Imprimir
          </LoadingButton>
          <LoadingButton
            loading={loading}
            onClick={() => {
              setLoading(true)
              graficoVentas()
            }}
            size="small"
            startIcon={<BarChartIcon />}
            variant="outlined"
            style={{ marginRight: 15 }}
          >
            Ver Gráfico
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Modal para seleccionar tipo de impresión */}
      <Dialog open={openPrintDialog} onClose={() => setOpenPrintDialog(false)}>
        <DialogTitle>Seleccionar Formato de Impresión</DialogTitle>
        <DialogContent>
          <Typography>Seleccione el formato de impresión deseado:</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlePrint('roll')} color="primary">
            Rollo
          </Button>
          <Button onClick={() => handlePrint('letter')} color="primary">
            Carta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal del gráfico */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            boxShadow: 24,
            width: 600,
            height: 400,
            padding: '0 0px 40px 10px',
          }}
        >
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'black',
            }}
          >
            <Close />
          </IconButton>
          <h2>Gráfico de Ventas</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombreArticulo" />
                <YAxis />
                <Legend />
                <Bar dataKey="nroVentas" fill="#8884d8" name="Ventas" />
                <Bar
                  dataKey="montoVentas"
                  fill="#82ca9d"
                  name="Monto Ventas"
                  activeBar={<Rectangle fill="gold" stroke="purple" />}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay ventas para mostrar</p>
          )}
        </Box>
      </Modal>
    </>
  )
}

export default PedidosReporteVentaArticuloDialog

const truncateName = (name: string, maxLength: number) => {
  if (name.length > maxLength) {
    return name.substring(0, maxLength) + '...'
  }
  return name
}
