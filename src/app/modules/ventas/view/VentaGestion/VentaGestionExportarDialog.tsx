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
} from '@mui/material'
import { es } from 'date-fns/locale'
import dayjs from 'dayjs'
import exportFromJSON from 'export-from-json'
import { convert } from 'html-to-text'
import React, { FunctionComponent, useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'

import { PAGE_DEFAULT, PageProps } from '../../../../interfaces'
import { clearAllLineBreak } from '../../../../utils/helper'
import { notDanger } from '../../../../utils/notification'
import { fetchFacturaListado } from '../../api/factura.listado.api'

registerLocale('es', es)

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: any) => void
}

type Props = OwnProps

const VentaGestionExportarDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props
  const [loading, setLoading] = useState(false)

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(),
  ])
  const [startDate, endDate] = dateRange

  const exportarDatos = async () => {
    setLoading(true)
    const sd = dayjs(startDate).format('YYYY-MM-DD')
    const ed = dayjs(endDate).format('YYYY-MM-DD')
    const query = `fechaEmision<=${ed} 24:00:00&fechaEmision>=${sd} 00:00:00`
    const fetchPagination: PageProps = {
      ...PAGE_DEFAULT,
      limit: 10000,
      reverse: false,
      query,
    }
    const { docs } = await fetchFacturaListado(fetchPagination)
    setLoading(false)
    if (docs.length > 0) {
      const dataExport: any = docs.map((item) => ({
        numeroFactura: item.numeroFactura,
        fechaEmision: item.fechaEmision,
        cuf: item.cuf,
        sucursal: item.sucursal.codigo,
        puntoVenta: item.puntoVenta.codigo,
        razonSocial: item.cliente.razonSocial,
        codigoCliente: item.cliente.codigoCliente,
        numeroDocumento: item.cliente.numeroDocumento,
        complemento: item.cliente.complemento || '',
        metodoPago: item.metodoPago.descripcion,
        montoTotal: item.montoTotal,
        montoTotalMoneda: item.montoTotalMoneda,
        moneda: item.moneda.descripcion,
        detalleExtra: clearAllLineBreak(
          convert(item.detalleExtra, {
            preserveNewlines: false,
            wordwrap: null,
          }),
        ),
        estado: item.state,
        usuario: item.usuario,
      }))

      const sdText = dayjs(startDate).format('YYYYMMDD')
      const edText = dayjs(endDate).format('YYYYMMDD')

      exportFromJSON({
        data: dataExport,
        fileName: `reporte_ventas_${sdText}_${edText}`,
        exportType: exportFromJSON.types.csv,
        withBOM: true,
        delimiter: ';',
      })
    } else {
      notDanger('No se han encontrado registros para el periodo seleccionado')
    }
  }
  useEffect(() => {
    if (open) {
      // setStartDate(new Date())
      // setEndDate(new Date())
    }
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', minHeight: 300 } }}
        maxWidth="xs"
        open={open}
        {...other}
      >
        <DialogTitle>Exportar ventas</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <Alert color={'info'}>
                Seleccione el periodo (<strong>fecha inicial - fecha final</strong>).{' '}
                <br />
                Para Obtener el reporte de una fecha debe realizar doble click en la fecha
                selecciona
              </Alert>
            </Grid>
            <Grid item sm={12}>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                locale={'es'}
                dateFormat="dd/MM/yyyy"
                onChange={(update) => {
                  setDateRange(update)
                }}
                isClearable={true}
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

export default VentaGestionExportarDialog
