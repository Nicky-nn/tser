import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useForm } from 'react-hook-form';

import SimpleContainer from '../../../base/components/Container/SimpleContainer';
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb';
import useAuth from '../../../base/hooks/useAuth';
import { NcdInputProps } from '../interfaces/ncdInterface';
import { ncdRegistroValidationSchema } from '../validator/ncdRegistroValidator';
import { ncdRouteMap } from '../NotaCreditoDebitoRoutesMap';
import NcdFacturaOriginal from "./Registro/NcdFacturaOriginal";

const NcdRegistro = () => {
  const { user } = useAuth();

  const form = useForm<NcdInputProps>({
    defaultValues: {},
    resolver: yupResolver(ncdRegistroValidationSchema),
  });

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
      <form noValidate>
        <Grid container spacing={2}>
            <Grid item lg={12}>
                <NcdFacturaOriginal  form={form}/>
            </Grid>
            <Grid item lg={12}>
                <NcdFacturaOriginal  form={form}/>
            </Grid>
        </Grid>
      </form>
      <Box py="12px" />
    </SimpleContainer>
  );
};

export default NcdRegistro;
