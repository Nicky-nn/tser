import StoreIcon from '@mui/icons-material/Store'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { FunctionComponent } from 'react'

import useAuth from '../../../../base/hooks/useAuth'
import { notSuccess } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiUsuarioRestriccion } from '../api/usuarioRestriccion.api'
import { apiUsuarioActualizarRestriccion } from '../api/usuarioRestriccionActualizar.api'
import { UsuarioSucursalRestriccionProps } from '../interfaces/restriccion.interface'

const CuentaRestriccionTable: FunctionComponent = () => {
  const { user } = useAuth()

  const {
    data: restricciones,
    isError,
    error,
    isLoading,
  } = useQuery<UsuarioSucursalRestriccionProps[]>({
    queryKey: ['restriccionUsuario'],
    queryFn: async () => {
      const resp = await apiUsuarioRestriccion()
      return resp.sucursales
    },
    refetchInterval: false,
  })

  const changePuntoVenta = async (codigoSucursal: number, codigoPuntoVenta: number) => {
    await swalAsyncConfirmDialog({
      text: `¿Cambiar a la Sucursal <strong>${codigoSucursal}</strong> / Punto Venta <strong>${codigoPuntoVenta}</strong>?`,
      preConfirm: async () => {
        return apiUsuarioActualizarRestriccion({
          codigoSucursal,
          codigoPuntoVenta,
        }).catch((err) => {
          swalException(err)
          return false
        })
      },
    }).then((resp) => {
      if (resp.isConfirmed) {
        notSuccess()
        setTimeout(() => {
          window.location.reload()
        }, 1)
      }
    })
  }

  if (isLoading)
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>Cargando...</Box>
  if (isError) return <Box sx={{ color: 'error.main', p: 3 }}>{error?.message}</Box>

  return (
    <>
      {restricciones?.map((sucursal) => (
        <Card key={sucursal.codigo} sx={{ mb: 2, borderRadius: 2 }}>
          <CardContent>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary">
                  Sucursal {sucursal.codigo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sucursal.departamento.departamento} - {sucursal.municipio}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sucursal.direccion} | Tel: {sucursal.telefono}
                </Typography>
              </Grid>

              {sucursal.puntosVenta.length > 0 ? (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ borderRadius: 2, mt: 2 }}>
                    <List>
                      {sucursal.puntosVenta.map((pv) => {
                        const isCurrentPoint =
                          user.sucursal.codigo === sucursal.codigo &&
                          user.puntoVenta.codigo === pv.codigo

                        return !isCurrentPoint ? (
                          <ListItem key={pv.codigo} disablePadding>
                            <ListItemButton
                              onClick={() => changePuntoVenta(sucursal.codigo, pv.codigo)}
                              sx={{ borderRadius: 2 }}
                            >
                              <ListItemIcon>
                                <StoreIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                  >
                                    <Chip
                                      label={`Suc. ${sucursal.codigo}`}
                                      size="small"
                                      color="primary"
                                      variant="outlined"
                                    />
                                    <Chip
                                      label={`PV. ${pv.codigo}`}
                                      size="small"
                                      color="secondary"
                                      variant="outlined"
                                    />
                                  </Box>
                                }
                                secondary={`${pv.nombre} - ${pv.tipoPuntoVenta.descripcion}`}
                              />
                            </ListItemButton>
                          </ListItem>
                        ) : null
                      })}
                    </List>
                  </Paper>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', p: 2 }}
                  >
                    Ya se encuentra en el punto de venta activo
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default CuentaRestriccionTable
