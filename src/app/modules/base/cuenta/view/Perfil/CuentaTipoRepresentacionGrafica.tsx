import { PictureAsPdfOutlined } from '@mui/icons-material'
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { ChangeEvent, FunctionComponent, useState } from 'react'

import SimpleCard from '../../../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../../../base/hooks/useAuth'
import { TipoRepresentacionGrafica } from '../../../../../base/interfaces/base'
import { notSuccess } from '../../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../../utils/swal'
import { apiUsuarioCambiarTipoRepresentacionGrafica } from '../../api/apiUsuarioCambiarTipoRepresentacionGrafica'

interface OwnProps {}

type Props = OwnProps

const CuentaTipoRepresentacionGrafica: FunctionComponent<Props> = (props) => {
  const auth = useAuth()
  const { user } = auth

  const [tipo, setTipo] = useState<TipoRepresentacionGrafica>(
    user.tipoRepresentacionGrafica || 'pdf',
  )

  const handleTipoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTipo(event.target.value as TipoRepresentacionGrafica)
  }

  const handleGuardarCambios = async () => {
    await swalAsyncConfirmDialog({
      preConfirm: async () => {
        try {
          return await apiUsuarioCambiarTipoRepresentacionGrafica({
            tipoRepresentacionGrafica: tipo,
          })
        } catch (err) {
          swalException(err)
          return false
        }
      },
    }).then((resp) => {
      if (resp.isConfirmed) {
        notSuccess()
        auth.refreshUser()
      }
    })
  }
  return (
    <>
      <SimpleCard
        title={'Cambiar Tipo Representación Grafica'}
        childIcon={<PictureAsPdfOutlined />}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant={'body2'} gutterBottom>
              Cambia la forma en que se visualiza la factura al momento de emisión
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel id="tipo">Seleccione:</FormLabel>
              <RadioGroup
                aria-labelledby="tipo"
                value={tipo}
                onChange={handleTipoChange}
                name="tipo"
              >
                <FormControlLabel
                  value="pdf"
                  control={<Radio />}
                  label="Pdf Medio Oficio"
                />
                <FormControlLabel
                  value="rollo"
                  control={<Radio />}
                  label="Pdf Formato Rollo"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant={'contained'} onClick={handleGuardarCambios}>
              Guardar Cambios
            </Button>
          </Grid>
        </Grid>
      </SimpleCard>
    </>
  )
}

export default CuentaTipoRepresentacionGrafica
