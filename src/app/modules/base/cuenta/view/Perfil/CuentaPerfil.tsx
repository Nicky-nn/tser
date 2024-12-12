import { Email, Person } from '@mui/icons-material'
import {
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
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import React, { FunctionComponent } from 'react'

import SimpleCard from '../../../../../base/components/Template/Cards/SimpleCard'
import { H4 } from '../../../../../base/components/Template/Typography'
import useAuth from '../../../../../base/hooks/useAuth'
import { apiListadoProductos } from '../../../../ventas/api/licencias.api'

const CuentaPerfil: FunctionComponent = () => {
  const { user } = useAuth()
  // eslint-disable-next-line no-unused-vars
  const [showWarning, setShowWarning] = useState(true)

  // const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(
  //   localStorage.getItem('whatsappEnabled') === 'true',
  // )
  const [emailEnabled, setEmailEnabled] = useState<boolean>(
    localStorage.getItem('emailEnabled') === 'true',
  )

  // const { data } = useQuery({
  //   queryKey: ['licenciaProductoListado'],
  //   queryFn: async () => {
  //     const data = await apiListadoProductos()
  //     return data || []
  //   },
  //   refetchOnWindowFocus: false,
  //   refetchInterval: false,
  // })

  // const whaapi = data?.find((item) => item.tipoProducto === 'WHATSAPP')
  // const state = whaapi?.state
  // const fechaVencimiento = whaapi?.fechaVencimiento
  // const fechaActual = new Date()

  // // Verifica si el estado no es "activado" o si la fecha ya venció
  // const mostrarAviso =
  //   showWarning &&
  //   (state !== 'ACTIVADO' ||
  //     (fechaVencimiento && new Date(fechaVencimiento) < fechaActual))

  // console.log('whaapi', mostrarAviso)

  // const handleWhatsappEnabledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const enabled = event.target.checked
  //   setWhatsappEnabled(enabled)
  //   localStorage.setItem('whatsappEnabled', String(enabled))
  // }

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
          {/* {whaapi && (
            <>
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
              </Grid>
              <Grid item lg={12} md={12} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={whatsappEnabled}
                      onChange={handleWhatsappEnabledChange}
                    />
                  }
                  label="Habilitar envío por WhatsApp"
                />
              </Grid>
            </>
          )} */}
          {/* {mostrarAviso && (
            <Grid item lg={12} md={12} xs={12}>
              <Typography style={{ color: 'red' }}>
                Su licencia de WhatsApp está vencida o desactivada
              </Typography>
            </Grid>
          )} */}
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
