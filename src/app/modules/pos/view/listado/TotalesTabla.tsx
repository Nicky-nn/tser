import { Box, Grid, Typography } from '@mui/material'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'

interface TotalesTablaProps {
  totalesPorTipoDocumentoYState: Record<string, Record<string, Record<string, number>>>
}

// Colores estáticos
const colors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7f0e',
  '#ff6384',
  '#36a2eb',
  '#ffce56',
  '#9966ff',
  '#ffcc99',
  '#ffcc00',
  '#ffcc33',
  '#ffcc66',
  '#ffccff',
  '#ffcccc',
  '#ffccdd',
  '#ffccaa',
]

const TotalesTabla: React.FC<TotalesTablaProps> = ({ totalesPorTipoDocumentoYState }) => {
  // Función para preparar los datos para el gráfico de torta
  const prepareDataForPieChart = (
    totalesPorTipoDocumentoYState: Record<string, Record<string, Record<string, number>>>,
  ) => {
    const data: { tipoDocumento: string; total: number; fill: string }[] = []
    let colorIndex = 0

    Object.entries(totalesPorTipoDocumentoYState).forEach(([tipoDocumento, states]) => {
      Object.entries(states as Record<string, Record<string, number>>).forEach(
        ([state, siglas]) => {
          Object.entries(siglas as Record<string, number>).forEach(([sigla, total]) => {
            const label = `${tipoDocumento} (${state}) - ${sigla}`
            const color = colors[colorIndex] // Obtener color de la lista de colores
            colorIndex = (colorIndex + 1) % colors.length // Avanzar al siguiente color

            data.push({ tipoDocumento: label, total, fill: color })
          })
        },
      )
    })

    return data
  }

  // Datos para el gráfico de torta
  const pieChartData = prepareDataForPieChart(totalesPorTipoDocumentoYState)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
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
      <Grid item xs={12} md={6}>
        {/* Tabla de totales */}
        {Object.entries(totalesPorTipoDocumentoYState).map(([tipoDocumento, states]) =>
          Object.entries(states).map(([state, siglas]) =>
            Object.entries(siglas).map(([sigla, total]) => {
              const entryColor = pieChartData.find(
                (d) => d.tipoDocumento === `${tipoDocumento} (${state}) - ${sigla}`,
              )?.fill
              return (
                <Box key={`${tipoDocumento}-${state}-${sigla}`} mb={2}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Total {tipoDocumento} ({state}) - {sigla}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color={entryColor}>
                    {numberWithCommas(total, {})}
                  </Typography>
                </Box>
              )
            }),
          ),
        )}
      </Grid>
    </Grid>
  )
}

export default TotalesTabla
