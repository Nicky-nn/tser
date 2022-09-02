// noinspection GraphQLUnresolvedReference

import { MonetizationOn, Paid } from '@mui/icons-material';
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import InputNumber from 'rc-input-number';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form';
import Swal from 'sweetalert2';

import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel';
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput';
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard';
import { openInNewTab } from '../../../../utils/helper';
import {
  swalAsyncConfirmDialog,
  swalErrorMsg,
  swalException,
} from '../../../../utils/swal';
import { fetchFacturaCreate } from '../../api/facturaCreate.api';
import { FacturaInitialValues, FacturaInputProps } from '../../interfaces/factura';
import {
  genCalculoTotalesService,
  montoSubTotal,
} from '../../services/operacionesService';
import { composeFactura, composeFacturaValidator } from '../../utils/composeFactura';
import { DescuentoAdicionalDialog } from './ventaTotales/DescuentoAdicionalDialog';

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>;
}

type Props = OwnProps;

const VentaTotales: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      reset,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props;
  const [openDescuentoAdicional, setOpenDescuentoAdicional] = useState(false);

  const handleFocus = (event: any) => event.target.select();
  const onSubmit: SubmitHandler<FacturaInputProps> = async (data) => {
    const inputFactura = composeFactura(data);
    const validator = await composeFacturaValidator(inputFactura).catch((err: Error) => {
      swalErrorMsg(err.message);
    });
    if (validator) {
      await swalAsyncConfirmDialog({
        text: '¿Confirma que desea emitir el documento fiscal?',
        preConfirm: () => {
          return fetchFacturaCreate(inputFactura).catch((err) => {
            swalException(err);
            return false;
          });
        },
      }).then((resp) => {
        if (resp.isConfirmed) {
          const { value }: any = resp;
          reset({ ...FacturaInitialValues, actividadEconomica: data.actividadEconomica });
          openInNewTab(value.representacionGrafica.pdf);
          Swal.fire({
            title: `Documento generado correctamente`,
            text: `${value.representacionGrafica.pdf}`,
          }).then();
        }
      });
    }
  };

  useEffect(() => {
    const totales = genCalculoTotalesService(getValues());
    setValue('montoSubTotal', totales.subTotal);
    setValue('montoPagar', totales.montoPagar);
    setValue('inputVuelto', totales.vuelto);
    setValue('total', totales.total);
  }, [getValues('descuentoAdicional'), getValues('inputMontoPagar')]);

  return (
    <>
      <SimpleCard title="Cálculo de los totales" childIcon={<MonetizationOn />}>
        <List dense>
          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="subtitle1" gutterBottom>
                {numberWithCommas(getValues('montoSubTotal'), {})}
              </Typography>
            }
          >
            <ListItemText primary={<strong>SUB-TOTAL</strong>} />
          </ListItem>

          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <>
                <Link
                  href="#"
                  onClick={() => setOpenDescuentoAdicional(true)}
                  variant="subtitle1"
                  underline="hover"
                >
                  {numberWithCommas(getValues('descuentoAdicional') || 0, {})}
                </Link>
                <DescuentoAdicionalDialog
                  id="ringtone-menu"
                  keepMounted={false}
                  open={openDescuentoAdicional}
                  onClose={(newValue) => {
                    setOpenDescuentoAdicional(false);
                    if (newValue || newValue === 0) {
                      setValue('descuentoAdicional', newValue);
                    }
                  }}
                  value={getValues('descuentoAdicional') || 0}
                />
              </>
            }
          >
            <ListItemText primary={<strong>DESCUENTO ADICIONAL</strong>} />
          </ListItem>

          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <>
                <Link href="#" variant="subtitle1" underline="hover">
                  {numberWithCommas(getValues('montoGiftCard') || 0, {})}
                </Link>
              </>
            }
          >
            <ListItemText primary={<strong>MONTO GIFT-CARD</strong>} />
          </ListItem>

          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="subtitle1" gutterBottom>
                {numberWithCommas(getValues('total') || 0, {})}
              </Typography>
            }
          >
            <ListItemText primary={<strong>TOTAL</strong>} />
          </ListItem>
          <Divider
            variant="inset"
            component="li"
            style={{ marginTop: 10, marginBottom: 20 }}
          />
          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="h6" gutterBottom>
                {numberWithCommas(getValues('montoPagar') || 0, {})}
              </Typography>
            }
          >
            <ListItemText primary={<strong>MONTO A PAGAR</strong>} />
          </ListItem>
        </List>

        <Divider style={{ marginTop: 10, marginBottom: 20 }} color={'red'} />
        <Grid sx={{ flexGrow: 1 }} container spacing={3}>
          <Grid item xs={12} md={7} lg={7}>
            <Controller
              control={control}
              name={'inputMontoPagar'}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.inputMontoPagar?.message)}>
                  <MyInputLabel shrink>Ingrese Monto</MyInputLabel>
                  <InputNumber
                    {...field}
                    min={0}
                    id={'montoPagar'}
                    className="inputMontoPagar"
                    value={field.value}
                    onFocus={handleFocus}
                    onChange={(value: number) => {
                      field.onChange(value);
                    }}
                    formatter={numberWithCommas}
                  />
                  <FormHelperText>{errors.inputMontoPagar?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            <small>Vuelto / Saldo</small>
            <Typography variant="h6" gutterBottom mr={2} align={'right'} color={'red'}>
              {numberWithCommas(getValues('inputVuelto') || 0, {})}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              fullWidth={true}
              color="success"
              startIcon={<Paid />}
            >
              REALIZAR PAGO
            </Button>
          </Grid>
        </Grid>
      </SimpleCard>
    </>
  );
};
export default VentaTotales;
