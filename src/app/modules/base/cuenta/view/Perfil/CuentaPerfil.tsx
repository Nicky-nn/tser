import { Person, WhatsApp } from '@mui/icons-material'
import {
  Badge,
  Box,
  Button, // Importa el componente Button
  Chip,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import qrcode from 'qrcode-generator'
import { useCallback, useEffect, useState } from 'react'
import React, { FunctionComponent } from 'react'

import SimpleCard from '../../../../../base/components/Template/Cards/SimpleCard'
import { H4 } from '../../../../../base/components/Template/Typography'
import useAuth from '../../../../../base/hooks/useAuth'
import { apiLogout } from '../../../../whatsapp/api/cerrarSesion.api'
import { apiGetQRCode } from '../../../../whatsapp/api/ObtenerQr.api'

const errorMessages = {
  'Usuario no encontrado': 'Necesita adquirir el plan Whapi para obtener el código QR',
  'El usuario ya está logueado en WhatsApp': 'El usuario ya está logueado en WhatsApp',
}

const CuentaPerfil: FunctionComponent = () => {
  const { user } = useAuth()

  const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorColor, setErrorColor] = useState<'error' | 'success'>('error')
  const [isLoading, setIsLoading] = useState(true)
  const [whatsappConnected, setWhatsappConnected] = useState<boolean>(false) // Estado para verificar si está logueado en WhatsApp

  const fetchQRCode = useCallback(async () => {
    try {
      setIsLoading(true)
      const code = await apiGetQRCode({ username: user.miEmpresa.tienda })

      if (code) {
        const qr = qrcode(0, 'L')
        qr.addData(code)
        qr.make()
        setQrCodeSrc(qr.createDataURL(10, 0))
        setError(null)
      } else {
        throw new Error('No se pudo obtener el código QR')
      }
    } catch (err: any) {
      const message =
        errorMessages[err.message as keyof typeof errorMessages] ||
        'Error al obtener el código QR'
      setError(message)
      if (err.message === 'El usuario ya está logueado en WhatsApp') {
        setErrorColor('success')
        setWhatsappConnected(true) // Marca como conectado
      } else {
        setErrorColor('error')
      }
      setQrCodeSrc(null)
    } finally {
      setIsLoading(false)
    }
  }, [user.miEmpresa.tienda])

  useEffect(() => {
    fetchQRCode()
    const intervalId = setInterval(fetchQRCode, 30000) // Actualizar cada 30 segundos
    return () => clearInterval(intervalId)
  }, [fetchQRCode])

  const handleLogout = async () => {
    try {
      await apiLogout({ username: user.miEmpresa.tienda })
      setWhatsappConnected(false) // Actualiza el estado después de cerrar sesión
      setError('Sesión cerrada correctamente') // Mensaje de éxito
      setQrCodeSrc(null) // Opcionalmente, limpia el QR
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      setError('Error al cerrar sesión') // Mensaje de error
    }
  }

  console.log('whatsappConnected:', whatsappConnected)

  return (
    <>
      <SimpleCard title={'PERFIL DE USUARIO'} childIcon={<Person />}>
        <Grid container spacing={2}>
          <Grid item lg={6} md={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                label="Nombres"
                value={user.nombres}
                variant="outlined"
                size="small"
                disabled
              />
            </FormControl>
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                label="Apellidos"
                value={user.apellidos}
                variant="outlined"
                size="small"
                disabled
              />
            </FormControl>
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                label="Cargo"
                value={user.cargo}
                variant="outlined"
                size="small"
                disabled
              />
            </FormControl>
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <FormControl fullWidth>
              <TextField
                label="Rol Operaciones"
                value={user.rol}
                variant="outlined"
                size="small"
                disabled
              />
            </FormControl>
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <Box position="relative" display="inline-block">
              <Stack direction="row" alignItems="center" gap={1}>
                <WhatsApp color="success" />
                <Typography style={{ fontWeight: 'bold' }}>WhatsApp</Typography>
              </Stack>
              <Badge
                badgeContent="Nuevo"
                color="secondary"
                sx={{ position: 'absolute', top: 10, right: -30 }}
              />
            </Box>
            <Box
              sx={{
                position: 'relative',
                mt: 2,
                p: 2,
                backgroundImage:
                  'url("https://upload.wikimedia.org/wikipedia/commons/d/d7/Commons_QR_code.png")',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)',
                },
              }}
            >
              {isLoading ? (
                <Typography
                  variant="body1"
                  sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
                >
                  Cargando código QR...
                </Typography>
              ) : error ? (
                <Typography
                  variant="h6"
                  color={errorColor}
                  sx={{
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                    fontWeight: 'bold',
                    height: '150px',
                  }}
                >
                  {error}
                </Typography>
              ) : qrCodeSrc ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                >
                  <img
                    src={qrCodeSrc}
                    alt="QR Code"
                    style={{ width: 200, height: 200, position: 'relative', zIndex: 1 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, position: 'relative', zIndex: 1 }}
                  >
                    Escanea este código QR con WhatsApp para iniciar sesión
                  </Typography>
                </Box>
              ) : null}
            </Box>
          </Grid>

          <Grid item lg={12} md={12} xs={12}>
            {whatsappConnected && ( // Muestra el botón solo si está logueado en WhatsApp
              <Button
                variant="contained"
                color="error"
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                  alignSelf: 'center',
                }}
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            )}
            <H4>Restricción de accesos</H4>
            {user.dominio.map((item) => (
              <Chip key={item} label={item} variant="outlined" />
            ))}
          </Grid>
        </Grid>
      </SimpleCard>
    </>
  )
}

export default CuentaPerfil
