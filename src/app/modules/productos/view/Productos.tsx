import { Newspaper } from '@mui/icons-material'
import { Button, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { Link as RouterLink } from 'react-router-dom'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import StackMenu from '../../../base/components/MyMenu/StackMenu'
import { StackMenuItem } from '../../../base/components/MyMenu/StackMenuActionTable'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import { productosRouteMap } from '../ProductosRoutesMap'
import ProductosListado from './listado/ProductosListado'

/**
 * @description componente principal para la gestión de productos
 * @constructor
 */
const Productos = () => {
  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[productosRouteMap.gestion]} />
      </div>
      <StackMenu asideSidebarFixed>
        <StackMenuItem>
          <Button
            size={'small'}
            variant="contained"
            component={RouterLink}
            to={productosRouteMap.nuevo.path}
            startIcon={<Newspaper />}
            color={'success'}
          >
            {productosRouteMap.nuevo.name}
          </Button>
        </StackMenuItem>
      </StackMenu>

      <Grid container spacing={2}>
        <Grid item lg={12} md={12} xs={12}>
          <ProductosListado />
        </Grid>
      </Grid>
      <Box py="12px" />
    </SimpleContainer>
  )
}

export default Productos
