import { Box, Card, FormControl, Grid, Icon } from '@mui/material'
import { styled } from '@mui/system'
import { format, lastDayOfMonth, startOfMonth, subMonths } from 'date-fns'
import React, { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { EntidadInputProps } from '../../../interfaces'
import { apiReporteVentasPorUsuario } from '../../../modules/reportes/api/reporteVentasUsuario.api'
import {
  reporteVentasUsuarioCompose,
  ReporteVentasUsuarioComposeProps,
} from '../../../modules/reportes/services/reporteVentasUsuarioCompose'
import ReporteNroVentasUsuario from '../../../modules/reportes/ventasUsuario/ReporteNroVentasUsuario'
import ReporteTotalVentasUsuario from '../../../modules/reportes/ventasUsuario/ReporteTotalVentasUsuario'
import { genReplaceEmpty } from '../../../utils/helper'
import { swalException } from '../../../utils/swal'
import AlertLoading from '../../components/Alert/AlertLoading'
import SimpleContainer from '../../components/Container/SimpleContainer'
import { numberWithCommas } from '../../components/MyInputs/NumberInput'
import { reactSelectStyle } from '../../components/MySelect/ReactSelect'
import SimpleCard from '../../components/Template/Cards/SimpleCard'
import { H3 } from '../../components/Template/Typography'
import useAuth from '../../hooks/useAuth'

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px !important',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    padding: '16px !important',
  },
}))

const ContentBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  '& small': {
    color: theme.palette.text.secondary,
  },
  '& .icon': {
    opacity: 0.6,
    fontSize: '44px',
    color: theme.palette.primary.main,
  },
}))

const Heading = styled('h6')(({ theme }) => ({
  margin: 0,
  marginTop: '4px',
  fontWeight: '500',
  fontSize: '20px',
  color: theme.palette.primary.main,
}))

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'capitalize',
}))

const SubTitle = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}))

const H4 = styled('h4')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginBottom: '16px',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
}))

/**
 * @description Dashboard inicial
 * @constructor
 */
const Analytics = () => {
  // const { palette } = useTheme()
  const periodos = [
    {
      fechaInicial: format(startOfMonth(new Date()), 'dd/MM/yyyy'),
      fechaFinal: format(lastDayOfMonth(new Date()), 'dd/MM/yyyy'),
      value: format(new Date(), 'MM/yyyy'),
    },
    {
      fechaInicial: format(startOfMonth(subMonths(new Date(), 1)), 'dd/MM/yyyy'),
      fechaFinal: format(lastDayOfMonth(subMonths(new Date(), 1)), 'dd/MM/yyyy'),
      value: format(subMonths(new Date(), 1), 'MM/yyyy'),
    },
  ]
  const { user } = useAuth()

  const entidad: EntidadInputProps[] = [
    { codigoSucursal: user.sucursal.codigo, codigoPuntoVenta: user.puntoVenta.codigo },
  ]

  const INIT_VALUES = {
    montoTotalFacturas: 0,
    nroTotalFacturas: 0,
    detalle: [],
  }

  const [resp, setResp] = useState<ReporteVentasUsuarioComposeProps>(INIT_VALUES)
  const [loading, setLoading] = useState(false)

  /**
   * @description Fecth de datos para generar el reporte
   * @param fechaInicial
   * @param fechaFinal
   * @param entidad
   */
  const fetchReporteVentas = async (
    fechaInicial: string,
    fechaFinal: string,
    entidad: EntidadInputProps[],
  ) => {
    setLoading(true)
    try {
      const resp = await apiReporteVentasPorUsuario(fechaInicial, fechaFinal, entidad)
      if (resp.length > 0) {
        const newData = reporteVentasUsuarioCompose(resp)
        if (newData) setResp(newData)
      } else {
        setResp(INIT_VALUES)
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
      swalException(e)
    }
  }

  useEffect(() => {
    const periodo = periodos[0]
    fetchReporteVentas(periodo.fechaInicial, periodo.fechaFinal, entidad).then()
  }, [])

  return (
    <Fragment>
      <SimpleContainer className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={12}>
            <SimpleCard title={'Seleccione el periodo'}>
              <Box className={'asideSidebarFixed'}>
                <FormControl fullWidth>
                  <Select<any>
                    styles={reactSelectStyle(false)}
                    name="periodo"
                    placeholder={'Seleccione el periodo de busqueda'}
                    menuPosition={'fixed'}
                    defaultValue={periodos[0]}
                    onChange={async (item) => {
                      await fetchReporteVentas(
                        item.fechaInicial,
                        item.fechaFinal,
                        entidad,
                      )
                    }}
                    isSearchable={false}
                    options={periodos}
                    getOptionValue={(item) => item.value}
                    getOptionLabel={(item) => `${item.value}`}
                  />
                </FormControl>
              </Box>
            </SimpleCard>
          </Grid>
          <Grid item lg={9} md={10} xs={12}>
            <SimpleCard title={'Reporte de ventas'}>
              <Box sx={{ width: '100%' }}>
                {!loading ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart width={500} height={280} data={resp.detalle}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="usuario" padding={{ left: 50, right: 50 }} />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => `${numberWithCommas(value, {})} BOB`}
                      />
                      <Legend />
                      <Line
                        label={'Monto Anuladas'}
                        type="monotone"
                        strokeWidth={1}
                        dataKey="montoAnuladas"
                        stroke={'red'}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        strokeWidth={1}
                        dataKey="montoValidadas"
                        stroke="blue"
                        activeDot={{ r: 8 }}
                        label={'Monto Validas'}
                      />
                      <Line
                        type="monotone"
                        strokeWidth={3}
                        dataKey="montoParcialFacturas"
                        stroke="green"
                        activeDot={{ r: 8 }}
                        label={'Monto Validas'}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <AlertLoading />
                )}
              </Box>
            </SimpleCard>
          </Grid>
          <Grid item lg={3} md={2} xs={12}>
            <SimpleCard title={'RESUMEN'}>
              <Grid container spacing={3}>
                <Grid item lg={12} md={12} xs={12}>
                  <StyledCard elevation={6}>
                    <ContentBox>
                      <Icon className="icon">numbers</Icon>
                      <Box ml="12px">
                        <H3>Nro. Facturas Periodo</H3>
                        <Heading>
                          {' '}
                          {numberWithCommas(
                            genReplaceEmpty(resp.nroTotalFacturas, 0),
                            {},
                          )}
                        </Heading>
                      </Box>
                    </ContentBox>
                  </StyledCard>
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                  <StyledCard elevation={6}>
                    <ContentBox>
                      <Icon className="icon">attach_money</Icon>
                      <Box ml="12px">
                        <H3>Monto Total Periodo</H3>
                        <Heading>
                          {numberWithCommas(
                            genReplaceEmpty(resp.montoTotalFacturas, 0),
                            {},
                          )}{' '}
                          BOB
                        </Heading>
                      </Box>
                    </ContentBox>
                  </StyledCard>
                </Grid>
              </Grid>
            </SimpleCard>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <SimpleCard title={'Nro de factura realizadas en el periodo'}>
              {loading ? <AlertLoading /> : <ReporteNroVentasUsuario data={resp} />}
            </SimpleCard>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <SimpleCard title={'Total de ventas realizadas en el periodo'}>
              {loading ? <AlertLoading /> : <ReporteTotalVentasUsuario data={resp} />}
            </SimpleCard>
          </Grid>
        </Grid>
      </SimpleContainer>
    </Fragment>
  )
}

export default Analytics
