import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import PedidoGestion from './PedidoGestion'

const PedidoRegistro = () => {
  const form = useForm<any>({})
  const [, setSelectedTab] = useState(0)

  const changeTabFromOrdenGestion = (newTabIndex: React.SetStateAction<number>) => {
    setSelectedTab(newTabIndex)
  }

  return (
    <div
      style={{
        padding: '10px',
      }}
    >
      {/* <div className="breadcrumb">
        <Breadcrumb routeSegments={[pedidosRouteMap.registro]} />
      </div> */}

      <Grid container spacing={2}>
        <Grid item lg={12} md={12} xs={12}>
          <PedidoGestion form={form} changeTab={changeTabFromOrdenGestion} />
        </Grid>
      </Grid>
      <Box py="12px" />
    </div>
  )
}

export default PedidoRegistro
