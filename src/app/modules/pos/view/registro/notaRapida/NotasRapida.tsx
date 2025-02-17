import { DeleteForever } from '@mui/icons-material'
import { Button, ButtonGroup, Grid, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { PAGE_DEFAULT, PageProps } from '../../../../../interfaces'
import { apiTipoArticuloListado } from '../../../api/apiTipoArticuloListado'

interface NotaProps {
  tipoArticuloId: string
  // eslint-disable-next-line no-unused-vars
  onNotaChange: (nota: string) => void
}

const NotasRapidas: React.FC<NotaProps> = ({ tipoArticuloId, onNotaChange }) => {
  const [notas, setNotas] = React.useState<{ cantidad: number; valor: string }[]>([])

  const { data } = useQuery({
    queryKey: ['notas', tipoArticuloId],
    queryFn: async () => {
      const params: PageProps = {
        ...PAGE_DEFAULT,
        page: 1,
        limit: 10,
        reverse: true,
        query: `_id=${tipoArticuloId}`,
      }
      const { docs } = await apiTipoArticuloListado(params)
      return docs.length ? docs[0].notas : []
    },
  })

  const actualizarNotas = (nuevasNotas: { cantidad: number; valor: string }[]) => {
    setNotas(nuevasNotas)
    onNotaChange(nuevasNotas.map((n) => `${n.cantidad} - ${n.valor}`).join(', '))
  }

  const agregarNota = (valor: string) => {
    const existente = notas.find((n) => n.valor === valor)
    if (existente) {
      actualizarNotas(
        notas.map((n) => (n.valor === valor ? { ...n, cantidad: n.cantidad + 1 } : n)),
      )
    } else {
      actualizarNotas([...notas, { cantidad: 1, valor }])
    }
  }

  const eliminarNota = (valor: string) => {
    actualizarNotas(
      notas.flatMap((n) =>
        n.valor === valor
          ? n.cantidad > 1
            ? [{ ...n, cantidad: n.cantidad - 1 }]
            : []
          : [n],
      ),
    )
  }

  return (
    <Grid container spacing={1} columnSpacing={3} sx={{ mt: -1 }}>
      <Grid item xs={12}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {data?.map((item, index) => (
            <ButtonGroup key={index}>
              <Button sx={{ fontSize: '0.8rem' }} onClick={() => agregarNota(item)}>
                {item}
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ p: 0.3 }}
                onClick={() => eliminarNota(item)}
              >
                <DeleteForever sx={{ p: 0, m: 0 }} />
              </Button>
            </ButtonGroup>
          ))}
        </Stack>
      </Grid>
    </Grid>
  )
}

export default NotasRapidas
