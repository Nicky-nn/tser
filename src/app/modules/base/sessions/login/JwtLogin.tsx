import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Card,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  styled,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import Turnstile from 'react-turnstile'
import { object, string } from 'yup'

import { apiCheckHuman } from '../../../../base/api/checkHuman.api'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import { Paragraph } from '../../../../base/components/Template/Typography'
import useAuth from '../../../../base/hooks/useAuth'
import { isEmptyValue } from '../../../../utils/helper'
import {
  storageComercioActualizar,
  storageComercioEliminar,
  storageComercioListado,
  StorageShopProps,
} from '../../../../utils/storage'

const fondo = import.meta.env.ISI_FONDO
const logo = import.meta.env.ISI_LOGO_FULL

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: 'center',
  padding: '0 15px',
}))

const ContentBox = styled(Box)(() => ({
  height: '100%',
  padding: '20px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)',
}))

const IMG = styled('img')(() => ({
  width: '100%',
  // maxHeight: '90px',
}))

const JWTRoot = styled(JustifyBox)(() => ({
  backgroundImage: `url("${fondo}")`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  minHeight: '100vh',
  '& .card': {
    maxWidth: 350,
    borderRadius: 12,
    margin: '1rem',
  },
}))

const validationSchema = object({
  shop: object({
    value: string().required('Url de comercio es requerido'),
  }).required('Url de comercio es requerido'),
  email: string()
    .email('Debe registrar un email válido')
    .required('Licencia es requerido'),
  password: string()
    .min(6, 'Password debe contener al menos 6 caracteres')
    .required('Password es requerido'),
})

interface LoginProps {
  shop: StorageShopProps | null
  email: string
  password: string
  remember: true
}

/**
 * @description Interfaz principal para el inicio de sesión del usuario
 * @constructor
 */
const JwtLogin = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { login }: any = useAuth()

  const [message, setMessage] = useState('')
  const [captchaValidator, setCaptchaValidator] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const shops = storageComercioListado()

  const form = useForm<LoginProps>({
    defaultValues: {
      shop: null,
      email: '',
      password: '',
      remember: true,
    },
    resolver: yupResolver<any>(validationSchema),
  })

  /**
   * @description Login de usuario y validación de permisos
   * @param values
   */
  const onSubmit: SubmitHandler<LoginProps> = async (values) => {
    if (captchaValidator) {
      setLoading(true)
      const { shop, email, password, remember } = values
      try {
        await login(shop?.value, email, password)
        if (remember) {
          storageComercioActualizar(shop!.value)
          // localStorage.setItem('shop', shop)
        } else {
          storageComercioEliminar(shop!.value)
          // localStorage.removeItem('shop')
        }
        navigate('/')
      } catch (e: any) {
        setMessage(e.message)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (!isEmptyValue(localStorage.getItem('shop'))) {
      const st = storageComercioListado()
      form.setValue('shop', st.length > 0 ? st[0] : null)
    }
  }, [])

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={12} xs={12}>
            <JustifyBox p={4} height="100%">
              <IMG
                src={logo}
                alt="Gestión de ventas y servicios"
                style={{ paddingTop: '20px' }}
              />
            </JustifyBox>
          </Grid>

          <Grid item sm={12} xs={12}>
            <ContentBox>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Grid container spacing={5}>
                  <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                    <Controller
                      control={form.control}
                      name={'shop'}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={Boolean(form.formState.errors.shop)}
                          sx={{ mb: 2.5 }}
                        >
                          <MyInputLabel shrink>URL Comercio</MyInputLabel>
                          <CreatableSelect<StorageShopProps>
                            {...field}
                            styles={reactSelectStyle(Boolean(form.formState.errors.shop))}
                            menuPosition={'fixed'}
                            name={'shop'}
                            placeholder={'Sel. o ingrese URL de comercio'}
                            value={field.value}
                            onChange={(newValue) => form.setValue('shop', newValue)}
                            options={shops}
                            isClearable
                          />
                          <FormHelperText>
                            {form.formState.errors.shop?.message || ''}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />

                    <Controller
                      control={form.control}
                      render={({ field }) => (
                        <TextField
                          label="Correo Electrónico"
                          size={'small'}
                          sx={{ mb: 3, width: '100%' }}
                          id="email"
                          name="email"
                          value={field.value}
                          onChange={field.onChange}
                          error={Boolean(form.formState.errors.email)}
                          helperText={form.formState.errors.email?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                      name={'email'}
                    />

                    <Controller
                      render={({ field }) => (
                        <FormControl
                          size={'small'}
                          variant="outlined"
                          sx={{ mb: 2 }}
                          onChange={field.onChange}
                          fullWidth={true}
                          error={Boolean(form.formState.errors.password)}
                        >
                          <InputLabel htmlFor="password" shrink>
                            Contraseña
                          </InputLabel>
                          <OutlinedInput
                            notched
                            id="password"
                            label="Contraseña"
                            name={'password'}
                            type={showPassword ? 'text' : 'password'}
                            value={field.value}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowPassword((show) => !show)}
                                  onMouseDown={(event) => event.preventDefault()}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                          <FormHelperText>
                            {form.formState.errors.password?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                      name={'password'}
                      control={form.control}
                    />

                    <Turnstile
                      style={{ marginBottom: 5 }}
                      sitekey={import.meta.env.ISI_CAPTCHA_KEY || ''}
                      theme={'light'}
                      onVerify={async (token: any) => {
                        setCaptchaValidator(true)
                        await apiCheckHuman(token)
                      }}
                      onError={() => setCaptchaValidator(false)}
                      onLoad={() => setCaptchaValidator(false)}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Controller
                          control={form.control}
                          render={({ field }) => (
                            <>
                              <Checkbox
                                size="small"
                                name="remember"
                                onChange={field.onChange}
                                checked={field.value}
                                sx={{ padding: 0 }}
                              />
                              <Paragraph>Recordarme</Paragraph>
                            </>
                          )}
                          name={'remember'}
                        />
                      </FlexBox>
                      {/*
                        <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        ¿Olvidaste tu contraseña?
                      </NavLink>
                         */}
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      size={'large'}
                      disabled={!captchaValidator}
                      fullWidth
                      sx={{ my: 2 }}
                    >
                      Iniciar Sesión
                    </LoadingButton>
                  </Grid>
                </Grid>

                {message && <Paragraph sx={{ color: 'red' }}>{message}</Paragraph>}
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  )
}

export default JwtLogin
