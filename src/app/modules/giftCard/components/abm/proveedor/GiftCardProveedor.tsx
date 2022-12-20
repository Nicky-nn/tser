import { Button, FormControl, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { FunctionComponent, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import Select from 'react-select';
import { GiftCardInputProps } from '../../../interfaces/giftCard.interface';
import { ProveedorProps } from '../../../../proveedor/interfaces/proveedor.interface';
import { PageInputProps } from '../../../../../interfaces';
import { apiProveedores } from '../../../../proveedor/api/proveedores.api';
import SimpleCard from '../../../../../base/components/Template/Cards/SimpleCard';
import { MyInputLabel } from '../../../../../base/components/MyInputs/MyInputLabel';
import { reactSelectStyles } from '../../../../../base/components/MySelect/ReactSelect';
import ProveedorRegistroDialog from '../../../../proveedor/view/ProveedorRegistroDialog';

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>;
}

type Props = OwnProps;

const GiftCardProveedor: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      reset,
      getValues,
      watch,
      formState: { errors, isSubmitted, isSubmitSuccessful },
    },
  } = props;

  // const {formik} = props;
  // const {values, setFieldValue} = formik

  const [openDialog, setOpenDialog] = useState(false);

  const { data: proveedores, refetch } = useQuery<ProveedorProps[], Error>(
    ['productoProveedores', openDialog],
    async () => {
      const pageInput: PageInputProps = {
        page: 1,
        limit: 1000,
        reverse: true,
      };
      const { docs } = await apiProveedores(pageInput);
      return docs;
    },
  );

  return (
    <SimpleCard title={'Proveedor'}>
      <Grid container spacing={1}>
        <Grid item lg={12} md={12} xs={12}>
          <Controller
            control={control}
            name={'proveedor'}
            render={({ field }) => (
              <FormControl fullWidth>
                <MyInputLabel shrink>Seleccione su proveedor</MyInputLabel>
                <Select<ProveedorProps>
                  {...field}
                  styles={reactSelectStyles}
                  menuPosition={'fixed'}
                  name="proveedor"
                  placeholder={'Seleccione proveedor...'}
                  value={field.value}
                  onChange={(proveedor: any) => {
                    field.onChange(proveedor);
                  }}
                  options={proveedores}
                  isClearable={true}
                  getOptionValue={(ps) => ps.codigo}
                  getOptionLabel={(ps) => `${ps.codigo} - ${ps.nombre}`}
                />
              </FormControl>
            )}
          />
        </Grid>

        <Grid item lg={12} md={12} xs={12} textAlign={'right'}>
          <Button variant={'outlined'} onClick={() => setOpenDialog(true)} size={'small'}>
            Nuevo Proveedor
          </Button>
          <ProveedorRegistroDialog
            id={'proveedorRegistroDialog'}
            keepMounted={false}
            open={openDialog}
            onClose={(value?: ProveedorProps) => {
              if (value) {
                setValue('proveedor', value);
                refetch().then();
              }
              setOpenDialog(false);
            }}
          />
        </Grid>
      </Grid>
    </SimpleCard>
  );
};

export default GiftCardProveedor;