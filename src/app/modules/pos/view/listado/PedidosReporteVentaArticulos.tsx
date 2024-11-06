/* eslint-disable no-unused-vars */
import { BarChart as BarChartIcon, Close, ImportExport } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import es from 'date-fns/locale/es'
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
import { restReporteVentasSimpleApi } from '../../api/reporteVentasSimple.api'
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

// @ts-ignore
registerLocale('es', es)

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  // eslint-disable-next-line no-unused-vars
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

  // Opciones para seleccionar sucursal
  const sucursalOptions = sucursales?.sucursales.map((sucursal) => ({
    value: sucursal,
    label: `${sucursal.codigo} - ${sucursal.departamento.sigla} - ${sucursal.direccion}`,
  }))

  // Opciones para seleccionar puntos de venta (filtradas por la sucursal seleccionada)
  const puntosVentaOptions = selectedSucursal?.puntosVenta.map((punto) => ({
    value: punto,
    label: `${punto.codigo} - ${punto.nombre}`,
  }))

  const exportarDatos = async () => {
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

    // Si la respuesta no tiene datos, mostrar mensaje de error
    if (resp.restReportePedidoVentasPorArticuloPuntoVenta.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos o reporte disponible en la fecha seleccionada.',
      })
      setLoading(false)
      return
    }

    // Agrupar los datos por sucursal
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

    const docDefinition: any = {
      pageSize: { width: 180, height: 'auto' },
      pageMargins: [0, 0, 0, 0],

      content: [
        { text: 'Resumen de Ventas Artículo Punto de Venta', style: 'header' },
        { text: `Fecha: ${new Date().toLocaleDateString()}`, style: 'subheader' },
        // Iteramos sobre las sucursales para agregar sus productos
        ...Object.keys(groupedBySucursal).map((sucursalKey) => ({
          stack: [
            { text: `Sucursal: ${sucursalKey}`, style: 'sectionHeader' },
            // Generamos una tabla para los productos de esta sucursal
            {
              table: {
                widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  // Encabezados de la tabla
                  ['Producto', 'Ventas', 'Monto V.', 'Desc.', 'Desc. Ad.'],
                  ...groupedBySucursal[sucursalKey].map((item) => [
                    item.nombreArticulo,
                    item.nroVentas,
                    `${item.montoVentas}`, // Mostrar montoVentas sin formato fijo
                    `${item.montoDescuento}`, // Mostrar montoDescuento sin formato fijo
                    `${item.montoDescuentoAdicional}`, // Mostrar montoDescuentoAdicional sin formato fijo
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
    const pdfDocGenerator = pdfMake.createPdf(docDefinition)

    // Descargar el archivo PDF + fecha actual
    pdfDocGenerator.download(`reporte_ventas_${dayjs().format('DD-MM-YYYY')}.pdf`)
    const printerSettings = localStorage.getItem('printers')
    let selectedPrinter = ''
    if (printerSettings) {
      const parsedSettings = JSON.parse(printerSettings)
      selectedPrinter = parsedSettings.comanda
    }
    // Llamar a la API de Flask para imprimir el PDF
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
              toast.success('Impresión de Comanda iniciada')
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

    // Si la respuesta no tiene datos, mostrar mensaje de error
    if (resp.restReportePedidoVentasPorArticuloPuntoVenta.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos o reporte disponible en la fecha seleccionada.',
      })
      setLoading(false)
      return
    }

    // Filtrar los artículos que tienen ventas
    const ventasFiltradas = resp.restReportePedidoVentasPorArticuloPuntoVenta.filter(
      (articulo) => articulo.nroVentas > 0,
    )

    // Crear datos para el gráfico
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
            {tipo === 'ADMIN' && (
              <>
                {/* Select de Sucursal */}
                <Grid item xs={12} paddingTop={2}>
                  <FormControl fullWidth error={Boolean()}>
                    <MyInputLabel shrink>Sucursales</MyInputLabel>
                    <Select
                      styles={reactSelectStyle(Boolean())}
                      options={sucursalOptions}
                      onChange={(option) => {
                        const selected = option?.value
                        if (selected) {
                          const mappedSucursal: Sucursal = {
                            ...selected,
                            puntosVenta: selected.puntosVenta.map((punto: any) => ({
                              ...punto,
                              tipoPuntoVenta: {
                                ...punto.tipoPuntoVenta,
                                codigoClasificador: String(
                                  punto.tipoPuntoVenta.codigoClasificador,
                                ),
                              },
                            })),
                          }
                          setSelectedSucursal(mappedSucursal)
                        } else {
                          setSelectedSucursal(null)
                        }
                      }}
                      placeholder="Seleccione una Sucursal"
                      isClearable
                    />
                  </FormControl>
                </Grid>

                {/* Select de Puntos de Venta */}
                {selectedSucursal && (
                  <Grid item xs={12} paddingTop={2}>
                    <FormControl fullWidth error={Boolean()}>
                      <MyInputLabel shrink>Puntos de Venta</MyInputLabel>
                      <Select
                        options={puntosVentaOptions}
                        styles={reactSelectStyle(Boolean())}
                        isMulti
                        onChange={(options) =>
                          setSelectedPuntosVenta(options?.map((opt) => opt.value) || [])
                        }
                        placeholder="Seleccione Puntos de Venta"
                        isClearable
                      />
                    </FormControl>
                  </Grid>
                )}
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
          onClick={() => exportarDatos()}
          startIcon={<ImportExport />}
          loadingPosition="start"
          size={'small'}
          variant={'contained'}
        >
          Exportar
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

        {/* Modal para mostrar el gráfico */}
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
            {/* Botón de cierre en la esquina superior derecha */}
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
      </DialogActions>
    </Dialog>
  )
}

export default PedidosReporteVentaArticuloDialog
const truncateName = (name: string, maxLength: number) => {
  if (name.length > maxLength) {
    return name.substring(0, maxLength) + '...'
  }
  return name
}
