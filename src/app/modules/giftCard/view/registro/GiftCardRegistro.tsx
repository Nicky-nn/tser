import { yupResolver } from '@hookform/resolvers/yup'
import { Save } from '@mui/icons-material'
import { Button, CssBaseline, Grid, Paper, Stack } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import SimpleContainer from '../../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../../base/components/Template/Breadcrumb/Breadcrumb'
import { notError, notSuccess } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiGiftCardRegistro } from '../../api/giftCardRegistro.api'
import GiftCardClasificador from '../../components/abm/clasificador/GiftCardClasificador'
import GiftCardDenominacion from '../../components/abm/GiftCardDenominacion'
import GiftCardHomologacion from '../../components/abm/GiftCardHomologacion'
import GiftCardProveedor from '../../components/abm/proveedor/GiftCardProveedor'
import { giftCardRouteMap } from '../../GiftCardRoutesMap'
import {
  GIFT_CARD_INITIAL_VALUES,
  GiftCardInputProps,
} from '../../interfaces/giftCard.interface'
import { giftCardComposeService } from '../../services/giftCardComposeService'
import {
  giftCardRegistroValidationSchema,
  giftCardRegistroValidator,
} from '../../validator/giftCardRegistroValidator'
import GiftCardForm from '../../components/GiftCardForm'

interface OwnProps {}

type Props = OwnProps

const GiftCardRegistro: FunctionComponent<Props> = (props) => {
  const navigate = useNavigate()

  const form = useForm<GiftCardInputProps>({
    defaultValues: {
      ...GIFT_CARD_INITIAL_VALUES,
    },
    resolver: yupResolver(giftCardRegistroValidationSchema),
  })

  const onSubmit: SubmitHandler<GiftCardInputProps> = async (values) => {
    const val = await giftCardRegistroValidator(values)
    if (val.length > 0) {
      notError(val.join('<br>'))
    } else {
      const apiInput = giftCardComposeService(values)
      await swalAsyncConfirmDialog({
        preConfirm: async () => {
          const resp: any = await apiGiftCardRegistro(apiInput).catch((err) => ({
            error: err,
          }))
          if (resp.error) {
            swalException(resp.error)
            return false
          }
          return resp
        },
      }).then((resp) => {
        if (resp.isConfirmed) {
          notSuccess()
          console.log(resp)
          navigate(`${giftCardRouteMap.modificar.path}/${resp.value._id}`, {
            replace: true,
          })
        }
        if (resp.isDenied) {
          swalException(resp.value)
        }
        return
      })
    }
  }

  const onError = (errors: any, e: any) => console.log(errors, e)

  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[giftCardRouteMap.gestion, { name: 'Nueva Gift Card' }]}
        />
      </div>
      <CssBaseline />

      <Paper
        elevation={0}
        variant="elevation"
        square
        sx={{ mb: 2, p: 0.5 }}
        className={'asideSidebarFixed'}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          style={{ marginTop: 2 }}
          spacing={{ xs: 1, sm: 1, md: 1, xl: 1 }}
          justifyContent="flex-end"
        >
          <Button
            color={'success'}
            startIcon={<Save />}
            variant={'contained'}
            onClick={form.handleSubmit(onSubmit, onError)}
          >
            Guardar Gift Card
          </Button>
        </Stack>
      </Paper>
      <GiftCardForm form={form} />
    </SimpleContainer>
  )
}

export default GiftCardRegistro
