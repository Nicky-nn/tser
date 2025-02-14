import { ImportExport } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material'
import es from 'date-fns/locale/es'
import dayjs from 'dayjs'
import { FunctionComponent, useEffect, useState } from 'react'
import { registerLocale } from 'react-datepicker'
import Swal from 'sweetalert2'

import { SimpleItem } from '../../../../base/components/Container/SimpleItem'
import MyDateRangePickerField from '../../../../base/components/MyInputs/MyDateRangePickerField'
import useAuth from '../../../../base/hooks/useAuth'
import { restReporteVentasVsPedidosApi } from '../../api/reportesVentasVsPedido.api'

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

const PedidosVsVentasReporteExportarDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [turnoInicio, setTurnoInicio] = useState<string>('06:00')
  const [turnoFin, setTurnoFin] = useState<string>('13:00')

  const {
    user: { usuario, sucursal, puntoVenta },
  } = useAuth()

  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const exportarDatos = async () => {
    try {
      setLoading(true)
      const fechaInicialTurno = dayjs(startDate)
        .hour(parseInt(turnoInicio.split(':')[0]))
        .minute(parseInt(turnoInicio.split(':')[1]))
        .format('DD/MM/YYYY HH:mm:ss')
      const fechaFinalTurno = dayjs(endDate)
        .hour(parseInt(turnoFin.split(':')[0]))
        .minute(parseInt(turnoFin.split(':')[1]))
        .format('DD/MM/YYYY HH:mm:ss')

      const entidad = {
        codigoSucursal: sucursal.codigo,
        codigoPuntoVenta: puntoVenta.codigo,
      }

      const data = await restReporteVentasVsPedidosApi(
        entidad,
        fechaInicialTurno,
        fechaFinalTurno,
        usuario,
      )

      if (
        !data ||
        !data.restReporteVentasVsPedidos ||
        !data.restReporteVentasVsPedidos.file
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Sin datos',
          text: 'No hay datos o reporte disponible en el rango seleccionado.',
        })
        setLoading(false)
        return
      }

      // Descargar el archivo PDF
      const byteCharacters = atob(data.restReporteVentasVsPedidos.file)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `reporte_ventas_vs_pedidos_${dayjs().format('DDMMYYYY_HHmm')}.pdf`,
      )
      document.body.appendChild(link)
      link.click()

      // Imprimir el PDF
      const printerSettings = localStorage.getItem('printers')
      let selectedPrinter = ''
      if (printerSettings) {
        const parsedSettings = JSON.parse(printerSettings)
        selectedPrinter = parsedSettings.comanda
      }
      // Llamar a la API de Flask para imprimir el PDF
      const formData = new FormData()
      formData.append(
        'file',
        blob,
        `reporte_ventas_vs_pedidos_${dayjs().format('DDMMYYYY_HHmm')}.pdf`,
      )
      formData.append('printer', selectedPrinter)

      const response = await fetch('http://localhost:7777/print', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error en la impresión del PDF')
      }

      Swal.fire({
        icon: 'success',
        title: 'Impresión iniciada',
        text: 'El archivo PDF se está imprimiendo.',
      })

      setLoading(false)
    } catch (error) {
      console.error('Error al exportar datos:', error)
      // notDanger('Error al exportar datos.')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      setStartDate(new Date())
      setEndDate(new Date())
    }
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%' } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Exportar Ventas vs Pedidos</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item sm={5}>
              <TextField
                sx={{ mt: 1 }}
                fullWidth
                label="Inicio del turno"
                value={turnoInicio}
                onChange={(e) => setTurnoInicio(e.target.value)}
                size="small"
                type="time"
              />
              <TextField
                sx={{ mt: 3 }}
                fullWidth
                label="Fin del turno"
                value={turnoFin}
                onChange={(e) => setTurnoFin(e.target.value)}
                size="small"
                type="time"
              />
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
            </Grid>
            <Grid item sm={7}>
              <SimpleItem>
                <MyDateRangePickerField
                  startDate={startDate ?? undefined}
                  endDate={endDate ?? undefined}
                  onChange={(date) => {
                    setStartDate(date[0])
                    setEndDate(date[1])
                  }}
                  // @ts-ignore
                  inline={true}
                />
              </SimpleItem>
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
            onClick={() => {
              onClose()
            }}
          >
            Cancelar
          </Button>
          <LoadingButton
            loading={loading}
            disabled={!dayjs(startDate).isValid() || !dayjs(endDate).isValid()}
            onClick={() => exportarDatos()}
            startIcon={<ImportExport />}
            loadingPosition="start"
            size={'small'}
            variant={'contained'}
            style={{ marginRight: 15 }}
          >
            Exportar Ventas
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PedidosVsVentasReporteExportarDialog
