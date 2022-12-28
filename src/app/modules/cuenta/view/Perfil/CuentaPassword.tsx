import { Key } from '@mui/icons-material'
import { Button, FormControl, Grid, TextField } from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import React, { FunctionComponent } from 'react'

import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import { notSuccess } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiUsuarioCambiarPassword } from '../../api/usuarioCambiarPassword.api'
import { UsuarioCambiarPasswordInputProps } from '../../interfaces/cuenta.interface'
import { cambiarPasswordValidationSchema } from '../../validator/cambiarPassword.validator'

interface OwnProps {}

type Props = OwnProps

const CuentaPassword: FunctionComponent<Props> = (props) => {
  const formik: FormikProps<UsuarioCambiarPasswordInputProps> =
    useFormik<UsuarioCambiarPasswordInputProps>({
      initialValues: {
        password: '',
        nuevoPassword: '',
        nuevoPassword2: '',
      },
      validationSchema: cambiarPasswordValidationSchema,
      onSubmit: async (values) => {
        await swalAsyncConfirmDialog({
          preConfirm: () => {
            return apiUsuarioCambiarPassword(values).catch((err) => {
              swalException(err)
              return false
            })
          },
          text: '¿Confirma que desea cambiar la contraseña?',
        }).then((resp) => {
          if (resp.isConfirmed) {
            notSuccess(
              'Se ha cambiado la contraseña correctamente, esta se aplica a partir del proximo reinicio de sesión',
            )
          }
        })
      },
    })

  return (
    <>
      <SimpleCard title={'CAMBIAR CONTRASEÑA'} childIcon={<Key />}>
        <Grid container spacing={2}>
          <Grid item lg={6} md={6} xs={12}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2} rowSpacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      name={'password'}
                      type={'password'}
                      label="Ingrese su contraseña"
                      value={formik.values.password}
                      variant="outlined"
                      size="small"
                      onChange={formik.handleChange}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      name={'nuevoPassword'}
                      type={'password'}
                      label="Ingrese su nueva contraseña"
                      value={formik.values.nuevoPassword}
                      variant="outlined"
                      size="small"
                      onChange={formik.handleChange}
                      error={
                        formik.touched.nuevoPassword &&
                        Boolean(formik.errors.nuevoPassword)
                      }
                      helperText={
                        formik.touched.nuevoPassword && formik.errors.nuevoPassword
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      name={'nuevoPassword2'}
                      type={'password'}
                      label="Confirme su nueva contraseña"
                      value={formik.values.nuevoPassword2}
                      variant="outlined"
                      size="small"
                      onChange={formik.handleChange}
                      error={
                        formik.touched.nuevoPassword2 &&
                        Boolean(formik.errors.nuevoPassword2)
                      }
                      helperText={
                        formik.touched.nuevoPassword2 && formik.errors.nuevoPassword2
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button variant={'contained'} type={'submit'}>
                    Guardar Cambios
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item lg={6} md={6} xs={12}></Grid>
        </Grid>
      </SimpleCard>
    </>
  )
}

export default CuentaPassword
