import { DeleteForever } from '@mui/icons-material'
import { Button, ButtonGroup, Grid, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { FunctionComponent, KeyboardEventHandler, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable'

import { PAGE_DEFAULT, PageProps } from '../../../../../interfaces'
import { genReplaceEmpty } from '../../../../../utils/helper'
import { apiTipoArticuloListado } from '../../../api/apiTipoArticuloListado'

const components = {
  DropdownIndicator: null,
}

interface NotaRapidaOptionProps {
  cantidad: number | null
  valor: string
  nota: string
}

const createOption = (cantidad: number | null, valor: string) => ({
  cantidad,
  valor,
  nota: valor,
})

const defaultValue = { cantidad: null, valor: '', nota: '' }

interface OwnProps {
  tipoArticuloId: string
  // eslint-disable-next-line no-unused-vars
  onNotaChange: (nota: string) => void
}

type Props = OwnProps

/**
 * Componente para agregar y eliminar notas rapidas
 * @param props
 * @constructor
 */
const NotaRapidaField: FunctionComponent<Props> = (props) => {
  const { tipoArticuloId, onNotaChange } = props
  const [inputValue, setInputValue] = React.useState<{
    cantidad: number | null
    valor: string
    nota: string
  }>(defaultValue)

  const [nota, setNota] = React.useState<NotaRapidaOptionProps[]>([])

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setNota((prev) => [...prev, createOption(inputValue.cantidad, inputValue.valor)])
        event.preventDefault()
        addNota(inputValue.valor) // Llama a addNota para actualizar correctamente el estado
        setInputValue(defaultValue) // Restablece el campo de entrada
        break
    }
  }

  const { data } = useQuery({
    queryKey: ['notas', tipoArticuloId],
    queryFn: async () => {
      const fetchPagination: PageProps = {
        ...PAGE_DEFAULT,
        page: 1,
        limit: 10,
        reverse: true,
        query: `_id=${tipoArticuloId}`,
      }
      const { docs } = await apiTipoArticuloListado(fetchPagination)
      if (docs.length === 0) return []
      return docs[0].notas
    },
  })

  /**
   * Adicionamos una nueva nota o sumamos la cantidad de una nota existente
   * @param value
   */
  const addNota = (value: string) => {
    const existe = nota.find((n) => n.nota === value)
    let nuevaNota
    let nuevasNotas
    if (existe) {
      nuevasNotas = nota.map((n) =>
        n.nota === value
          ? {
              cantidad: genReplaceEmpty(existe.cantidad, 0) + 1,
              valor: value,
              nota: value,
            }
          : n,
      )
      setNota(nuevasNotas)
    } else {
      nuevaNota = { cantidad: 1, valor: value, nota: value }
      nuevasNotas = [...nota, nuevaNota]
      setNota(nuevasNotas)
    }
    const notaString = nuevasNotas.map((n) => `${n.cantidad} - ${n.valor}`).join(', ')
    onNotaChange(notaString) // Enviar todas las notas en formato "cantidad - valor"
  }

  const deleteNota = (value: string) => {
    const existe = nota.find((n) => n.nota === value)
    const cantidad = genReplaceEmpty(existe?.cantidad, 1)
    let nuevasNotas
    if (cantidad === 1) {
      nuevasNotas = nota.filter((n) => n.nota !== value)
      setNota(nuevasNotas)
    } else {
      nuevasNotas = nota.map((n) =>
        n.nota === value ? { ...n, cantidad: cantidad - 1 } : n,
      )
      setNota(nuevasNotas)
    }
    const notaString = nuevasNotas.map((n) => `${n.cantidad} - ${n.valor}`).join(', ')
    onNotaChange(notaString) // Enviar todas las notas en formato "cantidad - valor"
  }

  useEffect(() => {
    // Cuando se realiza la modificación de la nota, se actualiza el estado
    setNota([])
    setInputValue(defaultValue)
  }, [])

  return (
    <>
      <Grid container spacing={1} columnSpacing={3} sx={{ mt: -1 }}>
        <Grid item xs={12} lg={5} md={4}>
          <CreatableSelect
            components={components}
            inputValue={inputValue.valor}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={(newValue: any) => setNota(newValue)}
            onInputChange={(newValue) =>
              setInputValue({ cantidad: null, valor: newValue, nota: newValue })
            }
            onKeyDown={handleKeyDown}
            placeholder="Escriba y presione enter para guardar..."
            value={nota}
            formatOptionLabel={(option) =>
              option ? `${option.cantidad || ''} ${option.valor}` : ''
            }
            getOptionValue={(option) => option.valor}
          />
        </Grid>
        <Grid item xs={12} lg={7} md={8}>
          <Stack
            spacing={{ xs: 1, sm: 1 }}
            direction="row"
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
          >
            {data?.map((item, index) => (
              <ButtonGroup key={index} aria-label={`Item nota ${item}`}>
                <Button
                  sx={{
                    fontSize: '0.8rem',
                    p: 0.6,
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                    },
                  }}
                  onClick={() => addNota(item)}
                >
                  {item}
                </Button>
                <Button
                  variant={'contained'}
                  color={'error'}
                  sx={{ p: 0.3 }}
                  onClick={() => deleteNota(item)}
                >
                  <DeleteForever sx={{ p: 0, m: 0 }} />
                </Button>
              </ButtonGroup>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default NotaRapidaField
