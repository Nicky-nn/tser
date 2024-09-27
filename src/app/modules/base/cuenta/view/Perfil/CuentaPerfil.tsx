import { Email, Person, WhatsApp } from '@mui/icons-material'
import {
  Badge,
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
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
import { apiGetQRCode } from '../../../../whatsapp/api/ObtenerQr.api'

const CuentaPerfil: FunctionComponent = () => {
  const { user } = useAuth()

  const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(
    localStorage.getItem('whatsappEnabled') === 'true',
  )
  const [emailEnabled, setEmailEnabled] = useState<boolean>(
    localStorage.getItem('emailEnabled') === 'true',
  )
  const [hasPlan, setHasPlan] = useState<boolean>(false)

  const fetchQRCode = useCallback(async () => {
    try {
      const code = await apiGetQRCode({ username: user.miEmpresa.tienda })

      if (code) {
        const qr = qrcode(0, 'L')
        qr.addData(code)
        qr.make()
        setHasPlan(true) // Aquí asumimos que si se obtiene el QR, el usuario tiene un plan
      } else {
        throw new Error('No se pudo obtener el código QR')
      }
    } catch (err: any) {
      if (err.message === 'El usuario ya está logueado en WhatsApp') {
        setHasPlan(true) // Aquí asumimos que si ya está logueado, el usuario tiene un plan
      }
      setHasPlan(false) // Si ocurre un error y no es "ya está logueado", asumimos que no tiene un plan
    }
  }, [user.miEmpresa.tienda])

  useEffect(() => {
    fetchQRCode()
    const intervalId = setInterval(fetchQRCode, 30000)
    return () => clearInterval(intervalId)
  }, [fetchQRCode])

  const handleWhatsappEnabledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked
    setWhatsappEnabled(enabled)
    localStorage.setItem('whatsappEnabled', String(enabled))
  }

  const handleEmailEnabledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked
    setEmailEnabled(enabled)
    localStorage.setItem('emailEnabled', String(enabled))
  }

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

          {/* Nueva sección: Habilitar Envío por WhatsApp */}
          {/* <Grid item lg={12} md={12} xs={12}>
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
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={whatsappEnabled}
                  onChange={handleWhatsappEnabledChange}
                  disabled={hasPlan} // Ahora se basa en la variable hasPlan
                />
              }
              label="Habilitar envío por WhatsApp"
            />
          </Grid> */}
          <Grid item lg={12} md={12} xs={12}>
            <Box position="relative" display="inline-block">
              <Stack direction="row" alignItems="center" gap={1}>
                <Email color="success" />
                <Typography style={{ fontWeight: 'bold' }}>Correo Electrónico</Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <FormControlLabel
              control={
                <Checkbox checked={emailEnabled} onChange={handleEmailEnabledChange} />
              }
              label="Habilitar envío Correo Electrónico"
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
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
