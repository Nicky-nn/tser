import { Box, Grid } from '@mui/material'
import React, { FunctionComponent } from 'react'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import ClientesListado from './Listado/ClientesListado'

interface OwnProps {}

type Props = OwnProps

/**
 * Componente para la gestión de clientes
 * @param props
 * @constructor
 */
const Clientes: FunctionComponent<Props> = (props) => {
  return (
    <SimpleContainer>
      <Breadcrumb
        routeSegments={[{ name: 'Gestion de clientes', path: '/clientes/gestion' }]}
      />
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xs={12}>
            <ClientesListado />
          </Grid>
        </Grid>
      </form>
      <Box py="12px" />
    </SimpleContainer>
  )
}

export default Clientes
