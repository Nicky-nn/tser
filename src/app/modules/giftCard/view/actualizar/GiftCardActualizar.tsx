import { yupResolver } from '@hookform/resolvers/yup';
import { Save } from '@mui/icons-material';
import { Button, CssBaseline, Grid, Paper, Stack } from '@mui/material';
import React, { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import SimpleContainer from '../../../../base/components/Container/SimpleContainer';
import Breadcrumb from '../../../../base/components/Template/Breadcrumb/Breadcrumb';
import { isEmptyValue } from '../../../../utils/helper';
import { notDanger, notError, notSuccess } from '../../../../utils/notification';
import {
  swalAsyncConfirmDialog,
  swalClose,
  swalException,
  swalLoading,
} from '../../../../utils/swal';
import { apiGiftCard } from '../../api/giftCard.api';
import { apiGiftCardRegistro } from '../../api/giftCardRegistro.api';
import GiftCardDenominacion from '../../components/abm/GiftCardDenominacion';
import GiftCardHomologacion from '../../components/abm/GiftCardHomologacion';
import { giftCardRouteMap } from '../../GiftCardRoutesMap';
import {
  GIFT_CARD_INITIAL_VALUES,
  GiftCardInputProps,
} from '../../interfaces/giftCard.interface';
import {
  giftCardComposeInputService,
  giftCardComposeService,
} from '../../services/giftCardComposeService';
import {
  giftCardRegistroValidationSchema,
  giftCardRegistroValidator,
} from '../../validator/giftCardRegistroValidator';
import GiftCardClasificador from '../../components/abm/clasificador/GiftCardClasificador';
import GiftCardProveedor from '../../components/abm/proveedor/GiftCardProveedor';

interface OwnProps {}

type Props = OwnProps;

const GiftCardRegistro: FunctionComponent<Props> = (props) => {
  const { id }: { id?: string } = useParams();
  const navigate = useNavigate();

  const form = useForm<GiftCardInputProps>({
    defaultValues: {
      ...GIFT_CARD_INITIAL_VALUES,
    },
    resolver: yupResolver(giftCardRegistroValidationSchema),
  });

  const onSubmit: SubmitHandler<GiftCardInputProps> = async (values) => {
    const val = await giftCardRegistroValidator(values);
    if (val.length > 0) {
      notError(val.join('<br>'));
    } else {
      const apiInput = giftCardComposeService(values);
      await swalAsyncConfirmDialog({
        preConfirm: async () => {
          const resp: any = await apiGiftCardRegistro(apiInput).catch((err) => ({
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
          notSuccess();
          console.log(resp);
          navigate(`${giftCardRouteMap.modificar.path}/${resp.value._id}`, {
            replace: true,
          });
        }
        if (resp.isDenied) {
          swalException(resp.value);
        }
        return;
      });
    }
  };

  const onError = (errors: any, e: any) => console.log(errors, e);

  const fetchGiftCard = async (id: string) => {
    try {
      swalLoading();
      const response = await apiGiftCard(id);
      swalClose();
      if (response) {
        const prodInput = giftCardComposeInputService(response);
        console.log(prodInput);
        form.reset(prodInput);
      } else {
        notDanger('No se ha podido encontrar datos del producto');
        navigate(-1);
      }
    } catch (e: any) {
      swalException(e);
    }
  };

  useEffect(() => {
    (async () => {
      if (!isEmptyValue(id)) {
        await fetchGiftCard(id!).then();
      } else {
        notDanger('Require codigo del producto');
        navigate(-1);
      }
    })();
  }, []);

  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[giftCardRouteMap.gestion, { name: 'Nueva Gift Card' }]}
        />
      </div>
      <CssBaseline />

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
            onClick={form.handleSubmit(onSubmit, onError)}
          >
            Guardar Gift Card
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid item lg={8} md={8} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} xs={12}>
              <GiftCardHomologacion form={form} />
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <GiftCardDenominacion form={form} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} xs={12}>
              {<GiftCardClasificador form={form} />}
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              {<GiftCardProveedor form={form} />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </SimpleContainer>
  );
};

export default GiftCardRegistro;
