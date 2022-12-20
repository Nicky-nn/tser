import { Button, FormControl, Grid } from '@mui/material';
import React, { FunctionComponent, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';

import AlertLoading from '../../../../../base/components/Alert/AlertLoading';
import { MyInputLabel } from '../../../../../base/components/MyInputs/MyInputLabel';
import { reactSelectStyles } from '../../../../../base/components/MySelect/ReactSelect';
import SimpleCard from '../../../../../base/components/Template/Cards/SimpleCard';
import useQueryTiposProducto from '../../../../tipoProducto/hooks/useQueryTiposProducto';
import { TipoProductoProps } from '../../../../tipoProducto/interfaces/tipoProducto.interface';
import TipoProductoDialogRegistro from '../../../../tipoProducto/view/TipoProductoRegistroDialog';
import { GiftCardInputProps } from '../../../interfaces/giftCard.interface';

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>;
}

type Props = OwnProps;

const GiftCardClasificador: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      formState: { errors },
    },
  } = props;

  const [openDialog, setOpenDialog] = useState(false);
  const { tiposProducto, tpRefetch, tpLoading } = useQueryTiposProducto([openDialog]);

  return (
    <SimpleCard title={'Clasificador de Gift Cards'}>
      <Grid container spacing={1}>
        <Grid item lg={12} md={12} xs={12}>
          {tpLoading ? (
            <AlertLoading />
          ) : (
            <Controller
              control={control}
              name={'tipoProducto'}
              render={({ field }) => (
                <FormControl fullWidth>
                  <MyInputLabel shrink>Tipo Producto</MyInputLabel>
                  <Select<TipoProductoProps>
                    {...field}
                    styles={reactSelectStyles}
                    menuPosition={'fixed'}
                    name="tipoProducto"
                    placeholder={'Seleccione...'}
                    value={field.value}
                    onChange={(tipoProducto: SingleValue<TipoProductoProps>) => {
                      field.onChange(tipoProducto);
                    }}
                    options={tiposProducto}
                    isClearable={true}
                    getOptionValue={(ps) => ps._id}
                    getOptionLabel={(item) => `${item.parientes}`}
                  />
                </FormControl>
              )}
            />
          )}
        </Grid>

        <Grid item lg={12} md={12} xs={12} textAlign={'right'}>
          <Button variant={'outlined'} onClick={() => setOpenDialog(true)} size={'small'}>
            Nuevo Clasificador
          </Button>
          <TipoProductoDialogRegistro
            id={'tipoProductoDialogRegistro'}
            keepMounted={false}
            open={openDialog}
            onClose={(value?: TipoProductoProps) => {
              setOpenDialog(false);
              if (value) {
                setValue('tipoProducto', value);
                tpRefetch().then();
              }
            }}
          />
        </Grid>
      </Grid>
    </SimpleCard>
  );
};

export default GiftCardClasificador;
