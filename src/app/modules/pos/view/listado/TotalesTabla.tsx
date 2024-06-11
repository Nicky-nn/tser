import { Box, Grid, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import useAuth from '../../../../base/hooks/useAuth'
import { PAGE_DEFAULT, PageProps } from '../../../../interfaces'
import { obtenerListadoPedidos } from '../../api/pedidosListado.api'

// Colores estáticos
const colors = {
  ANULADO: '#FF9598',
  'FACTURA (FINALIZADO)': '#93C4EE',
  'NOTA_VENTA (FINALIZADO)': '#6EDDBD',
} as Record<string, string>

const TotalesTabla = () => {
  const {
    user: { sucursal, puntoVenta },
  } = useAuth()
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const formattedDate = `${year}/${month}/${day}`
  const formatTradition = `${day}/${month}/${year}`
  // Consulta a la API para obtener los totales
  const { data, isError, isLoading } = useQuery<any[]>({
    queryKey: ['pedidos'],
    queryFn: async () => {
      const query = `createdAt>=${formattedDate} 00:00:00`
      const fetchPagination: PageProps = {
        ...PAGE_DEFAULT,
        page: 1,
        limit: 1000,
        reverse: false,
        query,
      }
      const entidad = {
        codigoSucursal: sucursal.codigo,
        codigoPuntoVenta: puntoVenta.codigo,
      }
      const { docs } = await obtenerListadoPedidos(fetchPagination, entidad)
      console.log('docs', docs)
      return docs
    },
    refetchOnWindowFocus: false,
  })

  const prepareDataForPieChart = (docs: any) => {
    if (!docs || !Array.isArray(docs)) {
      console.error('Invalid docs data:', docs)
      return { data: [], totalDocuments: 0, grandTotal: {}, totalByDocumentTypeData: [] }
    }

    const data = [] as any[]
    const statesByDocumentType = {} as Record<string, Record<string, number>>
    const grandTotal = {} as Record<string, number> // Objeto para almacenar el total por moneda
    const totalByDocumentType = {} as Record<string, number>

    // Iterar sobre los documentos y contar las ocurrencias de cada estado por tipo de documento
    docs.forEach((doc: any) => {
      const { tipoDocumento, state, montoTotal, moneda } = doc
      const { sigla } = moneda

      // Inicializar el total por moneda si no existe
      if (!grandTotal[sigla]) {
        grandTotal[sigla] = 0
      }
      // Inicializar el total por tipo de documento si no existe
      if (!totalByDocumentType[tipoDocumento]) {
        totalByDocumentType[tipoDocumento] = 0
      }

      grandTotal[sigla] += montoTotal // Sumar el monto al total de la moneda correspondiente
      totalByDocumentType[tipoDocumento] += montoTotal

      if (!statesByDocumentType[tipoDocumento]) {
        statesByDocumentType[tipoDocumento] = {}
      }
      if (!statesByDocumentType[tipoDocumento][state]) {
        statesByDocumentType[tipoDocumento][state] = 0
      }
      statesByDocumentType[tipoDocumento][state]++
    })

    // Construir el array de datos para el gráfico de torta
    Object.entries(statesByDocumentType).forEach(([tipoDocumento, statesCounts], i) => {
      Object.entries(statesCounts).forEach(([state, count]) => {
        if (state !== 'COMPLETADO') {
          // Omitir el estado 'COMPLETADO'
          const key = `${tipoDocumento} (${state})`
          const fill =
            colors[key] || Object.values(colors)[i % Object.values(colors).length]
          data.push({
            tipoDocumento: key,
            total: count,
            fill,
          })
        }
      })
    })

    const totalByDocumentTypeData = Object.entries(totalByDocumentType).map(
      ([tipoDocumento, total], i) => ({
        tipoDocumento,
        total,
        fill: Object.values(colors)[i % Object.values(colors).length],
      }),
    )

    return { data, totalDocuments: docs.length, grandTotal, totalByDocumentTypeData }
  }

  // Obtener los datos para el gráfico de torta y el total general
  const {
    data: pieChartData,
    totalDocuments,
    grandTotal,
    totalByDocumentTypeData,
  } = prepareDataForPieChart(data)

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="auto"
        padding={5}
      >
        <Typography variant="h6" color="textSecondary">
          Cargando...
        </Typography>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="auto"
        padding={5}
      >
        <Typography variant="h6" color="error">
          Error al cargar los datos
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Reporte de Estado por Tipo de Documento - {formatTradition}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Total de Documentos: {numberWithCommas(totalDocuments, {})}
        </Typography>
        {Object.entries(grandTotal).map(([moneda, total]) => (
          <Typography variant="h6" gutterBottom key={moneda}>
            Total de Ventas ({moneda}): {numberWithCommas(total, {})}
          </Typography>
        ))}
      </Grid>

      {/* First Pie Chart and its Information */}
      <Grid item xs={12} md={3}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="total"
              nameKey="tipoDocumento"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item xs={12} md={3}>
        {pieChartData.map(({ tipoDocumento, total, fill }) => (
          <Box key={tipoDocumento} mb={2}>
            <Typography variant="subtitle1" color="textSecondary">
              {tipoDocumento}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color={fill}>
              {numberWithCommas(total, {})}
            </Typography>
          </Box>
        ))}
      </Grid>

      {/* Second Pie Chart and its Information */}
      <Grid item xs={12} md={3}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={totalByDocumentTypeData}
              dataKey="total"
              nameKey="tipoDocumento"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {totalByDocumentTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item xs={12} md={3}>
        {totalByDocumentTypeData.map(({ tipoDocumento, total, fill }) => (
          <Box key={tipoDocumento} mb={2}>
            <Typography variant="subtitle1" color="textSecondary">
              {tipoDocumento}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color={fill}>
              {numberWithCommas(total, {})}
            </Typography>
          </Box>
        ))}
      </Grid>
    </Grid>
  )
}

export default TotalesTabla
