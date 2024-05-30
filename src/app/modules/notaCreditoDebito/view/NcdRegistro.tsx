import { yupResolver } from '@hookform/resolvers/yup'
import { Save } from '@mui/icons-material'
import { Box, Button, Grid } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import StackMenu from '../../../base/components/MyMenu/StackMenu'
import { StackMenuItem } from '../../../base/components/MyMenu/StackMenuActionTable'
import RepresentacionGraficaUrls from '../../../base/components/RepresentacionGrafica/RepresentacionGraficaUrls'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import { openInNewTab } from '../../../utils/helper'
import { notError, notSuccess } from '../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiNcdRegistro } from '../api/ncdRegistroApi'
import { NcdInputProps } from '../interfaces/ncdInterface'
import { ncdRouteMap } from '../NotaCreditoDebitoRoutesMap'
import { ncdInputCompose } from '../services/ncdInputCompose'
import { ncdRegistroValidationSchema } from '../validator/ncdRegistroValidator'
import NcdFacturaDevolucion from './Registro/NcdFacturaDevolucion'
import NcdFacturaOriginal from './Registro/NcdFacturaOriginal'

const NcdRegistro = () => {
  const mySwal = withReactContent(Swal)

  const form = useForm<NcdInputProps>({
    defaultValues: {
      numeroFactura: '',
      fechaEmision: '',
      razonSocial: '',
      facturaCuf: '',
      detalleFactura: [],
      detalle: [],
    },
    resolver: yupResolver<any>(ncdRegistroValidationSchema),
  })

  /**
   * @description Guardamos la nota
   * @param values
   */
  const onSubmit: SubmitHandler<NcdInputProps> = async (values) => {
    if (values.detalleFactura.length > 0) {
      const apiInput = ncdInputCompose(values)
      await swalAsyncConfirmDialog({
        preConfirm: async () => {
          const resp: any = await apiNcdRegistro(apiInput).catch((err) => ({
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
          const { value } = resp
          const { representacionGrafica } = value
          mySwal.fire({
            title: `Documento generado correctamente`,
            html: (
              <RepresentacionGraficaUrls representacionGrafica={representacionGrafica} />
            ),
          })
          form.reset({
            numeroFactura: '',
            fechaEmision: '',
            razonSocial: '',
            facturaCuf: '',
            detalleFactura: [],
          })
          notSuccess()
          openInNewTab(representacionGrafica.pdf)
        }
        if (resp.isDenied) {
          swalException(resp.value)
        }
        return
      })
    } else {
      notError('Seleccione el item o los items a ser devueltos')
    }
  }

  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[ncdRouteMap.gestion, ncdRouteMap.nuevo]} />
      </div>
      <StackMenu asideSidebarFixed>
        <StackMenuItem>
          <Button
            startIcon={<Save />}
            variant={'contained'}
            onClick={form.handleSubmit(onSubmit)}
          >
            Registrar Nota
          </Button>
        </StackMenuItem>
      </StackMenu>

      <form>
        <Grid container spacing={2}>
          <Grid item lg={12} xs={12} md={12}>
            <NcdFacturaOriginal form={form} />
          </Grid>
          <Grid item lg={12}>
            <NcdFacturaDevolucion form={form} />
          </Grid>
        </Grid>
      </form>
      <Box py="12px" />
    </SimpleContainer>
  )
}

export default NcdRegistro
