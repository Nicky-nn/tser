import { Box, Grid } from '@mui/material'
import React from 'react'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import { productosRouteMap } from '../../productos/ProductosRoutesMap'
import ProveedorListado from '../components/ProveedorListado'

const Proveedores = () => {
  // in this case *props are stored in the state of parent component

  return (
    <>
      <SimpleContainer>
        <Breadcrumb
          routeSegments={[
            { name: 'Productos', path: productosRouteMap.gestion },
            { name: 'Proveedores' },
          ]}
        />
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xs={12}>
            <ProveedorListado />
          </Grid>
        </Grid>
        <Box py="12px" />
      </SimpleContainer>
    </>
  )
}

export default Proveedores
