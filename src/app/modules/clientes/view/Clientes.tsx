import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { FunctionComponent, useState } from 'react'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import ClientesListado from './Listado/ClientesListado'

interface OwnProps {}

type Props = OwnProps

const Clientes: FunctionComponent<Props> = (props) => {
  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Clientes', path: '/clientes/gestion' },
            { name: 'Gestión de clientes' },
          ]}
        />
      </div>
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
