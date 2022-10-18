import {
  Computer,
  Home,
  MonetizationOn,
  Money,
  MoneySharp,
  RepeatOne,
} from '@mui/icons-material';
import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/system';
import React, { FC, useState } from 'react';

import CuentaRestriccionDialog from '../../../modules/cuenta/view/CuentaRestriccionDialog';
import { topBarHeightRestriccion } from '../../../utils/constant';
import useAuth from '../../hooks/useAuth';
import { themeShadows } from '../Template/MatxTheme/themeColors';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const RestriccionTopBarRoot = styled('div')(() => ({
  top: 0,
  zIndex: 96,
  transition: 'all 0.3s ease',
  boxShadow: themeShadows[5],
  height: topBarHeightRestriccion,
}));

const RestriccionTopBarContainer = styled(Paper)(({ theme }) => ({
  padding: 0,
  paddingLeft: 0,
  paddingRight: 0,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  background: theme.palette.primary.main,
  borderRadius: 0,
  justifyContent: 'space-between',
}));

const LayoutRestriccion: FC<any> = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { logout, user }: any = useAuth();

  const handleChangeSucursal = () => {
    setOpen(true);
  };

  return (
    <>
      <RestriccionTopBarRoot>
        <RestriccionTopBarContainer>
          <TableContainer
            component={'div'}
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 0,
              background: 'transparent',
            }}
          >
            <Table sx={{ minWidth: 800 }} size="small">
              <TableHead></TableHead>
              <TableBody>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ minWidth: 200, maxWidth: 400 }}>
                    <Typography
                      variant={'body1'}
                      color={'red'}
                      style={{ fontWeight: 500 }}
                    >
                      {user.razonSocial}
                    </Typography>
                  </TableCell>

                  <TableCell align="left" sx={{ width: 270 }}>
                    <Tooltip title={user.sucursal.direccion}>
                      <Chip
                        icon={<Home />}
                        color={'success'}
                        label={
                          <>
                            <strong>Sucursal {user.sucursal.codigo}</strong>
                          </>
                        }
                        variant="outlined"
                      />
                    </Tooltip>
                    &nbsp;
                    <Tooltip title={user.puntoVenta.nombre}>
                      <Chip
                        icon={<Computer />}
                        color={'success'}
                        label={
                          <>
                            <strong>Punto Venta {user.puntoVenta.codigo}</strong>
                          </>
                        }
                        variant="outlined"
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="left" sx={{ width: 180 }}>
                    <Tooltip title={'Moneda general'}>
                      <Chip
                        icon={<MonetizationOn />}
                        label={
                          <>
                            Moneda <strong>{user.monedaTienda.sigla}</strong>
                          </>
                        }
                        variant="outlined"
                      />
                    </Tooltip>
                  </TableCell>

                  <TableCell align="left" sx={{ width: 60 }}>
                    <Tooltip title={'Cambiar Sucursal / PuntoVenta'} leaveDelay={50}>
                      <StyledIconButton
                        color={'success'}
                        onClick={handleChangeSucursal}
                        theme={theme}
                        aria-label="Cambiar Sucursal / Punto Venta"
                        style={{ padding: 0, margin: 0 }}
                      >
                        <RepeatOne fontSize={'large'} />
                      </StyledIconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </RestriccionTopBarContainer>
      </RestriccionTopBarRoot>
      <CuentaRestriccionDialog
        id={'CuentaRestriccion'}
        keepMounted
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default React.memo(LayoutRestriccion);
