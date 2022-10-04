import { ArrowForwardIosSharp, CheckCircle, ExpandMore } from '@mui/icons-material';
import {
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import React, { FunctionComponent, useState } from 'react';

import AlertError from '../../../base/components/Alert/AlertError';
import AlertLoading from '../../../base/components/Alert/AlertLoading';
import useAuth from '../../../base/hooks/useAuth';
import { notSuccess } from '../../../utils/notification';
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal';
import { apiUsuarioRestriccion } from '../api/usuarioRestriccion.api';
import { apiUsuarioActualizarRestriccion } from '../api/usuarioRestriccionActualizar.api';
import { UsuarioSucursalRestriccionProps } from '../interfaces/restriccion.interface';

/**
 * @description
 * Componente para generar interfaz de acordion
 */
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
  '& .MuiAccordionDetails-root': {
    paddingTop: 5,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 10,
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharp sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

interface OwnProps {}

type Props = OwnProps;

const CuentaRestriccionTable: FunctionComponent<Props> = (props) => {
  const [expanded, setExpanded] = useState<number | false>(false);
  const { user } = useAuth();
  const {
    data: restriccion,
    isError,
    error,
    isLoading,
    isFetching,
  } = useQuery<UsuarioSucursalRestriccionProps[], Error>(
    ['restriccionUsuario'],
    async () => {
      const resp = await apiUsuarioRestriccion();
      return resp.sucursales;
    },
    { keepPreviousData: true },
  );

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const changePuntoVenta = async (codigoSucursal: number, codigoPuntoVenta: number) => {
    await swalAsyncConfirmDialog({
      text: '¿Confirma que desea cambiar de Sucursal / Punto Venta?',
      preConfirm: () => {
        return apiUsuarioActualizarRestriccion({
          codigoSucursal,
          codigoPuntoVenta,
        }).catch((err) => {
          swalException(err);
          return false;
        });
      },
    }).then((resp) => {
      if (resp.isConfirmed) {
        notSuccess();
        setTimeout(() => {
          window.location.reload();
        }, 1);
      }
    });
  };

  if (isError) return <AlertError mensaje={error && error.message} />;

  return (
    <>
      {isLoading ? (
        <AlertLoading />
      ) : (
        restriccion!.map((res) => (
          <React.Fragment key={res.codigo}>
            <Accordion
              expanded={expanded === res.codigo}
              onChange={handleChange(res.codigo)}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                expandIcon={<ExpandMore />}
              >
                <Typography>
                  <strong>SUCURSAL {res.codigo}</strong> / {res.departamento.departamento}{' '}
                  - {res.municipio} / {res.direccion} / {res.telefono}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={12} md={12}>
                    <Demo>
                      <List dense>
                        {res.puntosVenta.map((pv) => (
                          <React.Fragment key={pv.codigo}>
                            <Divider component="li" variant={'fullWidth'} />
                            <ListItem
                              secondaryAction={
                                !(
                                  user.sucursal.codigo === res.codigo &&
                                  user.puntoVenta.codigo === pv.codigo
                                ) && (
                                  <Tooltip
                                    title={'¿Cambiar Punto Venta?'}
                                    placement={'top'}
                                  >
                                    <IconButton
                                      onClick={() =>
                                        changePuntoVenta(res.codigo, pv.codigo)
                                      }
                                      color={'success'}
                                      aria-label="select"
                                    >
                                      <CheckCircle fontSize={'large'} />
                                    </IconButton>
                                  </Tooltip>
                                )
                              }
                            >
                              <ListItemText
                                primary={
                                  <Typography>
                                    <strong>PUNTO VENTA {pv.codigo}</strong> / {pv.nombre}{' '}
                                    / {pv.tipoPuntoVenta.descripcion}
                                  </Typography>
                                }
                              />
                              <Divider />
                            </ListItem>
                          </React.Fragment>
                        ))}
                      </List>
                    </Demo>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </React.Fragment>
        ))
      )}
    </>
  );
};

export default CuentaRestriccionTable;
