import { ImportExport } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
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
import DatePicker, { registerLocale } from 'react-datepicker'
import Swal from 'sweetalert2'

import { SimpleItem } from '../../../../base/components/Container/SimpleItem'
import useAuth from '../../../../base/hooks/useAuth'
import { restReporteVentasSimpleApi } from '../../api/reporteVentasSimple.api'

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

const PedidosReporteVentaSimpleDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const {
    user: { usuario, sucursal, puntoVenta },
  } = useAuth()

  const exportarDatos = async () => {
    try {
      setLoading(true)

      // Asigna 00:00 como hora de inicio y 23:59 como hora de fin
      const fechaInicialTurno = dayjs(selectedDate)
        .hour(0)
        .minute(0)
        .format('DD/MM/YYYY HH:mm:ss')
      const fechaFinalTurno = dayjs(selectedDate)
        .hour(23)
        .minute(59)
        .format('DD/MM/YYYY HH:mm:ss')

      const entidad = {
        codigoSucursal: sucursal.codigo,
        codigoPuntoVenta: puntoVenta.codigo,
      }

      const data = await restReporteVentasSimpleApi(
        entidad,
        fechaInicialTurno,
        fechaFinalTurno,
        usuario,
      )

      if (!data || !data.restReporteVentasSimple || !data.restReporteVentasSimple.file) {
        Swal.fire({
          icon: 'warning',
          title: 'Sin datos',
          text: 'No hay datos o reporte disponible en la fecha seleccionada.',
        })
        setLoading(false)
        return
      }

      // Descargar el archivo PDF
      const byteCharacters = atob(data.restReporteVentasSimple.file)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'reporte_ventas_simple.pdf')
      document.body.appendChild(link)
      link.click()

      const printerSettings = localStorage.getItem('printers')
      let selectedPrinter = ''
      if (printerSettings) {
        const parsedSettings = JSON.parse(printerSettings)
        selectedPrinter = parsedSettings.comanda
      }

      // Llamar a la API de Flask para imprimir el PDF
      const formData = new FormData()
      formData.append('file', blob, 'reporte_ventas_simple.pdf')
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
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      setSelectedDate(new Date())
    }
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435, height: 500 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Exportar Reporte de Ventas Simple</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item sm={6}>
              <SimpleItem>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  locale={'es'}
                  inline
                />
              </SimpleItem>
            </Grid>
            <Grid item sm={6}>
              <Alert color={'info'}>
                Seleccione el día para obtener el reporte de ventas simple. Recuerde que
                el reporte se genera por día, desde las 00:00 hasta las 23:59.
              </Alert>
              <TextField
                sx={{ mt: 3 }}
                fullWidth
                label="Fecha Seleccionada"
                value={dayjs(selectedDate).format('DD/MM/YYYY') || ''}
                size="small"
              />
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
            disabled={!dayjs(selectedDate).isValid()}
            onClick={() => exportarDatos()}
            startIcon={<ImportExport />}
            loadingPosition="start"
            size={'small'}
            variant={'contained'}
            style={{ marginRight: 15 }}
          >
            Exportar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PedidosReporteVentaSimpleDialog
