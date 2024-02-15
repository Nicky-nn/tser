import { ImportExport } from '@mui/icons-material'
import { Alert, LoadingButton } from '@mui/lab'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material'
import { setDefaultOptions } from 'date-fns'
import { es } from 'date-fns/locale'
import dayjs from 'dayjs'
import exportFromJSON from 'export-from-json'
import { convert } from 'html-to-text'
import React, { FunctionComponent, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'

import useAuth from '../../../../base/hooks/useAuth'
import { PAGE_DEFAULT, PageProps } from '../../../../interfaces'
import { clearAllLineBreak } from '../../../../utils/helper'
import { notDanger } from '../../../../utils/notification'
import { fetchFacturaListado } from '../../api/factura.listado.api'

setDefaultOptions({ locale: es })

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: any) => void
}

type Props = OwnProps

const MisVentasDialog: FunctionComponent<Props> = (props) => {
  const { user } = useAuth()

  const { onClose, open, ...other } = props
  const [loading, setLoading] = useState(false)
  // const [startDate, setStartDate] = useState<Date | null>(new Date())
  // const [endDate, setEndDate] = useState<Date | null>(null)

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(),
  ])
  const [startDate, endDate] = dateRange

  const onChange = (dates: any) => {
    const [start, end] = dates
    // setStartDate(start)
    // setEndDate(end)
  }

  const exportarDatos = async () => {
    setLoading(true)
    const sd = dayjs(startDate).format('YYYY-MM-DD')
    const ed = dayjs(endDate).format('YYYY-MM-DD')
    const query = `fechaEmision<=${ed} 24:00:00&fechaEmision>=${sd} 00:00:00&usucre=${user.usuario}`
    const fetchPagination: PageProps = {
      ...PAGE_DEFAULT,
      limit: 100000,
      reverse: false,
      query,
    }
    const { docs } = await fetchFacturaListado(fetchPagination)
    setLoading(false)
    if (docs.length > 0) {
      const dataExport: any = docs.map((item) => ({
        numeroFactura: item.numeroFactura,
        fechaEmision: item.fechaEmision,
        codigoControl: item.cuf,
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
        usucre: item.usucre,
        usuario: item.usuario,
      }))

      const sdText = dayjs(startDate).format('YYYYMMDD')
      const edText = dayjs(endDate).format('YYYYMMDD')

      exportFromJSON({
        data: dataExport,
        fileName: `mis_ventas_${sdText}_${edText}`,
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
        <DialogTitle>
          Exportar ventas para el usuario: {user.usuario?.toUpperCase()}
        </DialogTitle>
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
            Exportar Mis Ventas
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MisVentasDialog
