import { ImportExport } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import es from 'date-fns/locale/es';
import dayjs from 'dayjs';
import exportFromJSON from 'export-from-json';
import React, { FunctionComponent, useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';

import { SimpleItem } from '../../../../base/components/Container/SimpleItem';
import { PAGE_DEFAULT, PageProps } from '../../../../interfaces';
import { notDanger } from '../../../../utils/notification';
import { fetchFacturaListado } from '../../api/factura.listado.api';

registerLocale('es', es);

interface OwnProps {
  id: string;
  keepMounted: boolean;
  open: boolean;
  onClose: (value?: any) => void;
}

type Props = OwnProps;

const VentaGestionExportarDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props;
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const exportarDatos = async () => {
    setLoading(true);
    const query = `fechaEmision<=${endDate}&fechaEmision>=${startDate}`;
    const fetchPagination: PageProps = {
      ...PAGE_DEFAULT,
      limit: 10000,
      reverse: false,
      query,
    };
    const { docs } = await fetchFacturaListado(fetchPagination);
    setLoading(false);
    if (docs.length > 0) {
      const dataExport = docs.map((item) => ({
        numeroFactura: item.numeroFactura,
        fechaEmision: item.fechaEmision,
        cuf: item.cuf,
        sucursal: item.sucursal.codigo,
        puntoVenta: item.puntoVenta.codigo,
        razonSocial: item.cliente.razonSocial,
        codigoCliente: item.cliente.codigoCliente,
        numeroDocumento: item.cliente.numeroDocumento,
        complemento: item.cliente.complemento,
        metodoPago: item.metodoPago.descripcion,
        montoTotal: item.montoTotal,
        moneda: item.moneda.descripcion,
        usuario: item.usuario,
      }));
      exportFromJSON({
        data: dataExport,
        fileName: 'reporte_ventas',
        exportType: exportFromJSON.types.csv,
        withBOM: true,
      });
      console.log('exportando');
    } else {
      notDanger('No se han encontrado registros para el periodo seleccionado');
    }
  };
  useEffect(() => {
    if (open) {
      setStartDate(new Date());
      setEndDate(new Date());
    }
  }, [open]);

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435, height: 500 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Exportar Ventas</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
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
              onClose();
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
  );
};

export default VentaGestionExportarDialog;
