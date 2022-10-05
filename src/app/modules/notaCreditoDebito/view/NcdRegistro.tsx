import { yupResolver } from '@hookform/resolvers/yup';
import { Save } from '@mui/icons-material';
import { Button, Grid, Paper, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import SimpleContainer from '../../../base/components/Container/SimpleContainer';
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb';
import useAuth from '../../../base/hooks/useAuth';
import { notSuccess } from '../../../utils/notification';
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal';
import { apiNcdRegistro } from '../api/ncdRegistroApi';
import { NcdInputProps } from '../interfaces/ncdInterface';
import { ncdRouteMap } from '../NotaCreditoDebitoRoutesMap';
import { ncdInputCompose } from '../services/ncdInputCompose';
import { ncdRegistroValidationSchema } from '../validator/ncdRegistroValidator';
import NcdFacturaDevolucion from './registro/NcdFacturaDevolucion';
import NcdFacturaOriginal from './registro/NcdFacturaOriginal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import RepresentacionGraficaUrls from '../../../base/components/RepresentacionGrafica/RepresentacionGraficaUrls';
import { openInNewTab } from '../../../utils/helper';
import { FacturaInitialValues } from '../../ventas/interfaces/factura';

const NcdRegistro = () => {
  const { user } = useAuth();
  const mySwal = withReactContent(Swal);

  const form = useForm<NcdInputProps>({
    defaultValues: {
      facturaCuf: '',
      detalleFactura: [],
    },
    resolver: yupResolver(ncdRegistroValidationSchema),
  });

  const onSubmit: SubmitHandler<NcdInputProps> = async (values) => {
    const apiInput = ncdInputCompose(values);
    await swalAsyncConfirmDialog({
      preConfirm: async () => {
        const resp: any = await apiNcdRegistro(apiInput).catch((err) => ({
          error: err,
        }));
        if (resp.error) {
          swalException(resp.error);
          return false;
        }
        return resp;
      },
    }).then((resp) => {
      if (resp.isConfirmed) {
        const { value } = resp;
        const { representacionGrafica } = value;
        mySwal.fire({
          title: `Documento generado correctamente`,
          html: (
            <RepresentacionGraficaUrls representacionGrafica={representacionGrafica} />
          ),
        });
        form.reset({
          facturaCuf: '',
          detalleFactura: [],
        });
        notSuccess();
        openInNewTab(representacionGrafica.pdf);
      }
      if (resp.isDenied) {
        swalException(resp.value);
      }
      return;
    });
  };

  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Notas Crédito Debito', path: ncdRouteMap.gestion },
            { name: 'Registrar Nota' },
          ]}
        />
      </div>
      <Paper
        elevation={0}
        variant="elevation"
        square
        sx={{ mb: 2, p: 0.5 }}
        className={'asideSidebarFixed'}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          style={{ marginTop: 2 }}
          spacing={{ xs: 1, sm: 1, md: 1, xl: 1 }}
          justifyContent="flex-end"
        >
          <Button
            color={'success'}
            startIcon={<Save />}
            variant={'contained'}
            onClick={form.handleSubmit(onSubmit)}
          >
            Registrar Nota
          </Button>
        </Stack>
      </Paper>
      <form>
        <Grid container spacing={2}>
          <Grid item lg={12}>
            <NcdFacturaOriginal form={form} />
          </Grid>
          <Grid item lg={12}>
            <NcdFacturaDevolucion form={form} />
          </Grid>
        </Grid>
      </form>
      <Box py="12px" />
    </SimpleContainer>
  );
};

export default NcdRegistro;
