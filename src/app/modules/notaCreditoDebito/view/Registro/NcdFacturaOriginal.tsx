import { Button, Grid, Typography } from '@mui/material';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { UseFormReturn } from 'react-hook-form';

import { FormTextField } from '../../../../base/components/Form';
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput';
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard';
import { DetalleFacturaProps, FacturaProps } from '../../../ventas/interfaces/factura';
import { NcdInputProps } from '../../interfaces/ncdInterface';
import NcdFacturaOriginalDialog from './NcdFacturaOriginalDialog';

interface OwnProps {
  form: UseFormReturn<NcdInputProps>;
}

type Props = OwnProps;

const NcdFacturaOriginal: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      getValues,
      watch,
      formState: { errors },
    },
  } = props;

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const columns = useMemo<TableColumn<DetalleFacturaProps>[]>(
    //column definitions...
    () => [
      {
        name: 'Nro. Item',
        selector: (row) => row.nroItem,
        width: '100px',
      },
      {
        name: 'Cantidad',
        selector: (row) => row.cantidad,
        width: '100px',
      },
      {
        name: 'Descripción',
        selector: (row) => row.descripcion,
      },
      {
        name: 'Descuento',
        selector: (row) => numberWithCommas(row.montoDescuento as number, {}),
        right: true,
        width: '160px',
      },
      {
        name: 'Precio Unitario',
        selector: (row) => numberWithCommas(row.precioUnitario as number, {}),
        right: true,
        width: '160px',
      },
      {
        name: 'Sub Total',
        selector: (row) => numberWithCommas(row.subTotal as number, {}),
        right: true,
        width: '160px',
      },
    ],
    [], //end
  );
  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
    const detalle = state.selectedRows.map((d: DetalleFacturaProps) => ({
      nroItem: d.nroItem,
      cantidadOriginal: d.cantidad,
      cantidad: d.cantidad,
      descripcion: d.descripcion,
      montoDescuento: d.montoDescuento,
      precioUnitario: d.precioUnitario,
      subTotal: d.subTotal,
    }));
    setValue('detalleFactura', detalle);
  }, []);

  useEffect(() => {
    setSelectedRows([]);
    setValue('detalleFactura', []);
  }, []);

  return (
    <>
      <SimpleCard title={'DATOS DE LA FACTURA ORIGINAL'}>
        <Grid container spacing={3}>
          <Grid item lg={12}>
            <Button
              size={'small'}
              variant={'contained'}
              color={'info'}
              onClick={() => setOpenDialog(true)}
            >
              Seleccionar Factura
            </Button>
            <hr />
          </Grid>
          <Grid item lg={2} md={2} xs={12}>
            <FormTextField
              name="numeroFactura"
              label="Número Factura"
              value={getValues('numeroFactura')}
              autoComplete="off"
            />
          </Grid>
          <Grid item lg={4} md={4} xs={12}>
            <FormTextField
              name="fechaEmision"
              label="Fecha Emisión"
              value={getValues('fechaEmision')}
            />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <FormTextField
              name="razonSocial"
              label="Razon Social"
              value={getValues('razonSocial')}
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <FormTextField
              name="cuf"
              label="Código Control (C.U.F.)"
              value={getValues('facturaCuf')}
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12} sx={{ pt: 10 }}>
            <Typography gutterBottom variant={'subtitle1'}>
              Detalle
            </Typography>
            <DataTable
              columns={columns}
              data={getValues('detalle')}
              selectableRows
              onSelectedRowsChange={handleRowSelected}
              dense
            />
          </Grid>
        </Grid>
      </SimpleCard>
      <>
        <NcdFacturaOriginalDialog
          id={'ncdFacturaOriginalDialogSeleccion'}
          keepMounted={false}
          open={openDialog}
          onClose={(value?: FacturaProps) => {
            setOpenDialog(false);
            if (value) {
              setValue('numeroFactura', value.numeroFactura.toString());
              setValue('fechaEmision', value.fechaEmision);
              setValue('razonSocial', value.cliente.razonSocial);
              setValue('facturaCuf', value.cuf);
              setValue('detalleFactura', []);
              setValue('detalle', value.detalle);
              setSelectedRows([]);
            }
          }}
        />
      </>
    </>
  );
};

export default NcdFacturaOriginal;
