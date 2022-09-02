import { Newspaper } from '@mui/icons-material';
import { Button, Grid, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import SimpleContainer from '../../../base/components/Container/SimpleContainer';
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb';
import AuthContext from '../../../base/contexts/JWTAuthContext';
import ProductosListado from './listado/ProductosListado';

const Productos = () => {
  const { user } = useContext(AuthContext);
  // in this case *props are stored in the state of parent component

  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Productos', path: '/productos/gestión' },
            { name: 'Gestión de productos' },
          ]}
        />
      </div>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        justifyContent="right"
        sx={{ marginBottom: 3 }}
      >
        {/*<Button size={'small'} variant="outlined" startIcon={<UploadFile/>}>Importar</Button>*/}
        {/*<Button size={'small'} variant="outlined" startIcon={<FileDownload/>}>Exportar</Button>*/}
        <Button
          size={'small'}
          variant="contained"
          component={RouterLink}
          to="/productos/nuevo"
          startIcon={<Newspaper />}
          color={'success'}
        >
          {' '}
          Nuevo Producto
        </Button>
      </Stack>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} xs={12}>
          <ProductosListado />
        </Grid>
      </Grid>
      <Box py="12px" />
    </SimpleContainer>
  );
};

export default Productos;
