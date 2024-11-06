/* eslint-disable prettier/prettier */
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
import {
  obtenerReporteVentasPorArticuloComercio,
  obtenerReporteVentasPorArticuloPuntoVenta,
} from '../../api/reporteVentasArticulo'
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
  const [selectedSucursal, setSelectedSucursal] = useState<any | null>(null)
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
      tipo === 'ADMIN' && selectedSucursal
        ? selectedSucursal.map((sucursal: any) => sucursal.codigo)
        : sucursal.codigo

    const resp = await obtenerReporteVentasPorArticuloComercio(
      fechaInicialTurno,
      fechaFinalTurno,
      codigoSucursal,
    )

    // Si la respuesta no tiene datos, mostrar mensaje de error
    if (resp.restReportePedidoVentasPorArticuloComercio.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos o reporte disponible en la fecha seleccionada.',
      })
      setLoading(false)
      return
    }

    // Agrupar los datos por sucursal y luego por punto de venta
    const groupedBySucursalAndPuntoVenta =
      resp.restReportePedidoVentasPorArticuloComercio.reduce(
        (acc: { [key: string]: { [key: string]: any[] } }, item: any) => {
          if (!acc[item.sucursal]) {
            acc[item.sucursal] = {} // Si no existe la sucursal, crearla
          }
          if (!acc[item.sucursal][item.puntoVenta]) {
            acc[item.sucursal][item.puntoVenta] = [] // Si no existe el punto de venta, crearlo
          }
          acc[item.sucursal][item.puntoVenta].push(item) // Agregar el item al punto de venta correspondiente
          return acc
        },
        {},
      )

    // Definición del documento
    const docDefinition: any = {
      pageSize: { width: 180, height: 'auto' },
      pageMargins: [0, 0, 0, 0],

      content: [
        { text: 'Reporte Ventas Artículo Comercio', style: 'header' },
        { text: `Fecha: ${new Date().toLocaleDateString()}`, style: 'subheader' },

        // Iteramos sobre las sucursales
        ...Object.keys(groupedBySucursalAndPuntoVenta).map((sucursalKey) => ({
          stack: [
            // Cabecera de la sucursal
            { text: `SUCURSAL: ${sucursalKey}`, style: 'sectionHeader' },

            // Iteramos sobre los puntos de venta dentro de cada sucursal
            ...Object.keys(groupedBySucursalAndPuntoVenta[sucursalKey]).map(
              (puntoVentaKey) => ({
                stack: [
                  // Cabecera del punto de venta
                  { text: `PUNTO DE VENTA: ${puntoVentaKey}`, style: 'sectionSubHeader' },

                  // Tabla con los productos, usando abreviaturas de las columnas
                  {
                    table: {
                      headerRows: 1,
                      body: [
                        // Nombres de las columnas (abreviados y en negrita)
                        [
                          { text: 'Prod.', style: 'tableHeader' },
                          { text: 'Nro. Vent.', style: 'tableHeader' },
                          { text: 'M. Vent $', style: 'tableHeader' },
                          { text: 'Desc.', style: 'tableHeader' },
                          { text: 'Des. Adic.', style: 'tableHeader' },
                        ],
                        // Datos de los productos
                        ...groupedBySucursalAndPuntoVenta[sucursalKey][puntoVentaKey].map(
                          (item: any) => [
                            { text: item.nombreArticulo, style: 'tableCell' },
                            { text: item.nroVentas.toString(), style: 'tableCell' },
                            { text: item.montoVentas.toString(), style: 'tableCell' },
                            { text: item.montoDescuento.toString(), style: 'tableCell' },
                            {
                              text: item.montoDescuentoAdicional.toString(),
                              style: 'tableCell',
                            },
                          ],
                        ),
                      ],
                      widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                    },
                  },
                ],
              }),
            ),
          ],
        })),
      ],
      // Estilos para el documento
      styles: {
        header: {
          fontSize: 8,
          bold: true,
          alignment: 'center',
        },
        subheader: {
          fontSize: 8,
          alignment: 'center',
        },
        sectionHeader: {
          fontSize: 8,
          bold: true,
          decoration: 'underline',
          margin: [0, 5, 0, 5],
        },
        sectionSubHeader: {
          fontSize: 8,
          bold: true,
          margin: [0, 5, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          fillColor: '#f0f0f0',
        },
        tableCell: {
          fontSize: 8,
          alignment: 'center',
        },
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
      tipo === 'ADMIN' && selectedSucursal
        ? selectedSucursal.map((sucursal: any) => sucursal.codigo)
        : sucursal.codigo

    const resp = await obtenerReporteVentasPorArticuloComercio(
      fechaInicialTurno,
      fechaFinalTurno,
      codigoSucursal,
    )

    // Si la respuesta no tiene datos, mostrar mensaje de error
    if (resp.restReportePedidoVentasPorArticuloComercio.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos o reporte disponible en la fecha seleccionada.',
      })
      setLoading(false)
      return
    }

    // Filtrar los artículos que tienen ventas
    const ventasFiltradas = resp.restReportePedidoVentasPorArticuloComercio.filter(
      (articulo) => articulo.nroVentas > 0,
    )

    // Agrupar por sucursal y punto de venta
    const groupedData = ventasFiltradas.reduce((acc: any, item) => {
      const sucursal = item.sucursal
      const puntoVenta = item.puntoVenta

      if (!acc[sucursal]) {
        acc[sucursal] = {}
      }

      if (!acc[sucursal][puntoVenta]) {
        acc[sucursal][puntoVenta] = []
      }

      acc[sucursal][puntoVenta].push(item)
      return acc
    }, {})

    // Formatear los datos para el gráfico
    const chartData = Object.keys(groupedData)
      .map((sucursalKey) => {
        return Object.keys(groupedData[sucursalKey]).map((puntoVentaKey) => {
          return {
            sucursal: `Sucursal ${sucursalKey}`,
            puntoVenta: `Punto de Venta ${puntoVentaKey}`,
            ventas: groupedData[sucursalKey][puntoVentaKey].reduce(
              (total: number, item: any) => total + item.nroVentas,
              0,
            ),
          }
        })
      })
      .flat()

    console.log('chartData', chartData)

    return chartData
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
      <DialogTitle>Exportar Reporte de Ventas por Artículo Comercio</DialogTitle>
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
                      defaultValue={sucursalOptions?.[0]}
                      isMulti={true}
                      onChange={(option) => {
                        const selected = option ? option.map((opt) => opt.value) : null
                        if (selected) {
                          const mappedSucursal = selected.map((sucursal) => sucursal)
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
        {/* <LoadingButton
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
        </LoadingButton> */}

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

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="puntoVenta" />
                <YAxis />
                {/* <Tooltip /> */}
                <Legend />
                <Bar dataKey="ventas" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
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
