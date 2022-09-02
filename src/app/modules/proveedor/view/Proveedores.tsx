import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';

import SimpleContainer from '../../../base/components/Container/SimpleContainer';
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb';
import AuthContext from '../../../base/contexts/JWTAuthContext';
import { productosRouteMap } from '../../productos/ProductosRoutesMap';
import ProveedorListado from '../components/ProveedorListado';

const Proveedores = () => {
  const { user } = useContext(AuthContext);
  // in this case *props are stored in the state of parent component

  return (
    <>
      <SimpleContainer>
        <div className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              { name: 'Productos', path: productosRouteMap.gestion },
              { name: 'Proveedores' },
            ]}
          />
        </div>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xs={12}>
            <ProveedorListado />
          </Grid>
        </Grid>
        <Box py="12px" />
      </SimpleContainer>
    </>
  );
};

export default Proveedores;
