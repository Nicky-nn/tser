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
}

type Props = OwnProps

/**
 * Componente para agregar y eliminar notas rapidas
 * @param props
 * @constructor
 */
const NotaRapidaField: FunctionComponent<Props> = (props) => {
  console.log('NotaRapidaField', props)
  const { tipoArticuloId } = props
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
        setInputValue(defaultValue)
        event.preventDefault()
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
      console.log('docs', docs)
      if (docs.length === 0) return []
      return docs[0].notas
    },
  })

  /**
   * Adicionamos una nueva nota o sumamos la cantidad de una nota existente
   * @param value
   */
  const addNota = (value: string) => {
    // Buscamos si ya existe la nota
    const existe = nota.find((n) => n.nota === value)
    if (existe) {
      const filtro = nota.map((n) =>
        n.nota === value
          ? {
              cantidad: genReplaceEmpty(existe.cantidad, 0) + 1,
              valor: value,
              nota: value,
            }
          : n,
      )
      setNota(filtro)
    } else {
      setNota((prev) => [...prev, { cantidad: 1, valor: value, nota: value }])
    }
  }

  /**
   * @description Eliminamos una nota o restamos la cantidad de una nota existente
   * @param value
   */
  const deleteNota = (value: string) => {
    const existe = nota.find((n) => n.nota === value)
    // si cantidad === 1 se realiza la eliminación de la note
    const cantidad = genReplaceEmpty(existe?.cantidad, 1)
    if (cantidad === 1) {
      setNota((prev) => prev.filter((n) => n.nota !== value))
    } else {
      const filtro = nota.map((n) =>
        n.nota === value ? { ...n, cantidad: cantidad - 1 } : n,
      )
      setNota(filtro)
    }
  }

  useEffect(() => {
    // Cuando se realiza la modificación de la nota, se actualiza el estado
    setNota([])
    setInputValue(defaultValue)
  }, [])

  return (
    <>
      <Grid container spacing={1} columnSpacing={3} sx={{ mt: -1 }}>
        <Grid item xs={12} lg={5}>
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
        <Grid item xs={12} lg={7}>
          <Stack
            spacing={{ xs: 1, sm: 1 }}
            direction="row"
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
          >
            {data?.map((item, index) => (
              <ButtonGroup key={index} aria-label={`Item nota ${item}`}>
                <Button sx={{ fontSize: '0.8rem', p: 0.3 }} onClick={() => addNota(item)}>
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
