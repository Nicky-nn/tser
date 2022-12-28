import { Cached, HomeWork, Key, Person, Token } from '@mui/icons-material'
import { Grid, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Box } from '@mui/system'
import React, { FunctionComponent, useState } from 'react'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import SimpleCard from '../../../base/components/Template/Cards/SimpleCard'
import CuentaPassword from './Perfil/CuentaPassword'
import CuentaPerfil from './Perfil/CuentaPerfil'
import CuentaRecargarCache from './Perfil/CuentaRecargarCache'
import CuentaSincronizacion from './Perfil/CuentaSincronizacion'
import CuentaSucursal from './Perfil/CuentaSucursal'
import CuentaTokenDelegado from './Perfil/CuentaTokenDelegado'

interface OwnProps {}

type Props = OwnProps

const Cuenta: FunctionComponent<Props> = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index)
  }

  return (
    <>
      <SimpleContainer>
        <div className="breadcrumb">
          <Breadcrumb routeSegments={[{ name: 'Gestión' }]} />
        </div>
        <Grid container spacing={2} columnSpacing={5}>
          <Grid item sm={4} xs={12}>
            <SimpleCard>
              <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <List component="nav" aria-label="main mailbox folders">
                  <ListItemButton
                    selected={selectedIndex === 0}
                    onClick={(event) => handleListItemClick(event, 0)}
                  >
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary="Información Básica" />
                  </ListItemButton>

                  <ListItemButton
                    selected={selectedIndex === 1}
                    onClick={(event) => handleListItemClick(event, 1)}
                  >
                    <ListItemIcon>
                      <Key />
                    </ListItemIcon>
                    <ListItemText primary="Cambiar Contraseña" />
                  </ListItemButton>

                  <ListItemButton
                    selected={selectedIndex === 2}
                    onClick={(event) => handleListItemClick(event, 2)}
                  >
                    <ListItemIcon>
                      <HomeWork />
                    </ListItemIcon>
                    <ListItemText primary="Sucursal / Punto Venta" />
                  </ListItemButton>

                  <ListItemButton
                    selected={selectedIndex === 3}
                    onClick={(event) => handleListItemClick(event, 3)}
                  >
                    <ListItemIcon>
                      <Token />
                    </ListItemIcon>
                    <ListItemText primary="Sincronización" />
                  </ListItemButton>

                  <ListItemButton
                    selected={selectedIndex === 4}
                    onClick={(event) => handleListItemClick(event, 4)}
                  >
                    <ListItemIcon>
                      <Cached />
                    </ListItemIcon>
                    <ListItemText primary="Recargar Cache" />
                  </ListItemButton>
                </List>
              </Box>
            </SimpleCard>
          </Grid>
          <Grid item sm={7} xs={12}>
            {selectedIndex === 0 && <CuentaPerfil />}
            {selectedIndex === 1 && <CuentaPassword />}
            {selectedIndex === 2 && <CuentaSucursal />}
            {selectedIndex === 3 && <CuentaSincronizacion />}
            {selectedIndex === 4 && <CuentaRecargarCache />}
          </Grid>
        </Grid>
        <Box py="12px" />
      </SimpleContainer>
    </>
  )
}

export default Cuenta
