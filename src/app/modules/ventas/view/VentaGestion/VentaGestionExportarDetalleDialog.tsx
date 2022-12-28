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
import exportFromJSON from 'export-from-json'
import { convert } from 'html-to-text'
import React, { FunctionComponent, useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'

import { SimpleItem } from '../../../../base/components/Container/SimpleItem'
import { PAGE_DEFAULT, PageProps } from '../../../../interfaces'
import { genReplaceEmpty } from '../../../../utils/helper'
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

const VentaGestionExportarDetalleDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(null)
  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const exportarDatos = async () => {
    setLoading(true)
    const sd = dayjs(startDate).format('YYYY-MM-DD')
    const ed = dayjs(endDate).format('YYYY-MM-DD')
    const query = `fechaEmision<=${ed} 24:00:00&fechaEmision>=${sd} 00:00:00`
    const fetchPagination: PageProps = {
      ...PAGE_DEFAULT,
      limit: 100000,
      reverse: false,
      query,
    }
    const { docs } = await fetchFacturaListado(fetchPagination)
    setLoading(false)
    if (docs.length > 0) {
      const dataExport: any = []
      for (const doc of docs) {
        doc.detalle.map((item) => {
          dataExport.push({
            numeroFactura: doc.numeroFactura,
            fechaEmision: doc.fechaEmision,
            cuf: doc.cuf,
            sucursal: doc.sucursal.codigo,
            puntoVenta: doc.puntoVenta.codigo,
            razonSocial: doc.cliente.razonSocial,
            codigoCliente: doc.cliente.codigoCliente,
            numeroDocumento: doc.cliente.numeroDocumento,
            complemento: doc.cliente.complemento || '',
            metodoPago: doc.metodoPago.descripcion,
            nroItem: item.nroItem,
            actividadEconomica: item.actividadEconomica.codigoCaeb,
            productoServicio: item.productoServicio.descripcionProducto,
            producto: item.producto,
            descripcion: item.descripcion,
            detalleExtra: genReplaceEmpty(item.detalleExtra, ''),
            detalleExtraGeneral: convert(doc.detalleExtra, {
              preserveNewlines: false,
              wordwrap: null,
            }),
            cantidad: item.cantidad,
            unidadMedida: item.unidadMedida.descripcion,
            precioUnitario: item.precioUnitario,
            montoDescuento: item.montoDescuento,
            montoTotal: doc.montoTotal,
            montoTotalMoneda: doc.montoTotalMoneda,
            moneda: doc.moneda.descripcion,
            tipoCambio: doc.tipoCambio,
            estado: doc.state,
            usuario: doc.usuario,
          })
        })
      }
      exportFromJSON({
        data: dataExport,
        fileName: 'reporte_detalle_ventas',
        exportType: exportFromJSON.types.csv,
        withBOM: true,
      })
    } else {
      notDanger('No se han encontrado registros para el periodo seleccionado')
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
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435, height: 500 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Exportar Ventas + Detalles</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item sm={7}>
              <SimpleItem>
                <DatePicker
                  selected={startDate}
                  onChange={onChange}
                  locale={'es'}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  isClearable={true}
                />
              </SimpleItem>
            </Grid>
            <Grid item sm={5}>
              <TextField
                sx={{ mt: 1 }}
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

export default VentaGestionExportarDetalleDialog
