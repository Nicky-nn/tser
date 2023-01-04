import { Grid } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { GiftCardInputProps } from '../interfaces/giftCard.interface'
import GiftCardHomologacion from './abm/GiftCardHomologacion'
import GiftCardDenominacion from './abm/GiftCardDenominacion'
import GiftCardClasificador from './abm/clasificador/GiftCardClasificador'
import GiftCardProveedor from './abm/proveedor/GiftCardProveedor'
import SimpleCard from '../../../base/components/Template/Cards/SimpleCard'
import GiftCardEstado from './abm/GiftCardEstado'
import GiftCardProgramacion from './abm/GiftCardProgramacion'
import GiftCardInventario from './abm/GiftCardInventario'

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>
}

type Props = OwnProps

const GiftCardForm: FunctionComponent<Props> = (props) => {
  const { form } = props

  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={2} md={12} xs={12}></Grid>
        <Grid item lg={6} md={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} xs={12}>
              <SimpleCard title={'Homologación'}>
                <GiftCardHomologacion form={form} />
              </SimpleCard>
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <SimpleCard title={'INVENTARIO'}>
                <GiftCardInventario form={form} />
              </SimpleCard>
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <SimpleCard title={'Denominaciones'}>
                <GiftCardDenominacion form={form} />
              </SimpleCard>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={3} md={4} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} xs={12}>
              <SimpleCard title={'Estado de la Tarjeta de Regalo'}>
                {<GiftCardEstado form={form} />}
              </SimpleCard>
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <SimpleCard title={'Programar Disponibilidad'}>
                {<GiftCardProgramacion form={form} />}
              </SimpleCard>
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              {<GiftCardClasificador form={form} />}
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              {<GiftCardProveedor form={form} />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default GiftCardForm
