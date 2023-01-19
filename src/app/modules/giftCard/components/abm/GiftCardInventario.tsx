import { Checkbox, FormControl, FormControlLabel, Grid, Typography } from '@mui/material'
import React, { ChangeEvent, FunctionComponent } from 'react'
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form'
import { GiftCardInputProps } from '../../interfaces/giftCard.interface'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import InputNumber from 'rc-input-number'
import { genReplaceEmpty, handleSelect } from '../../../../utils/helper'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import { SucursalProps } from '../../../sucursal/interfaces/sucursal'
import { sortBy } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import { apiSucursales } from '../../../sucursal/api/sucursales.api'

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>
}

type Props = OwnProps

const GiftCardInventario: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      getValues,
      watch,
      formState: { errors },
    },
  } = props
  const { replace } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'variantes', // unique name for your Field Array
  })
  const [varianteWatch, variantesWatch] = watch(['variante', 'variantes'])

  const crearInventario = (data: SucursalProps[]): Array<any> => {
    return sortBy(data, 'codigo').map((sucursal) => ({
      sucursal,
      stock: genReplaceEmpty(
        varianteWatch.inventario.find((inv) => inv.sucursal.codigo == sucursal.codigo)
          ?.stock,
        0,
      ),
    }))
  }

  const { data: sucursales } = useQuery<SucursalProps[], Error>(
    ['giftCardSucursales'],
    async () => {
      const data = await apiSucursales()
      if (data.length > 0) {
        if (getValues('variante.inventario').length === 0) {
          const inventario = crearInventario(data)
          setValue('variante.inventario', inventario)
          setValue('variantes.0.inventario', inventario)
        }
      }
      return data || []
    },
    { keepPreviousData: true },
  )

  return (
    <Grid container spacing={1}>
      <Grid item lg={12}>
        <Controller
          control={control}
          name={'variante.incluirCantidad'}
          render={({ field }) => (
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e.target.checked)
                      // Actulizamos las variantes de los stocks
                      replace(
                        variantesWatch.map((v) => ({
                          ...v,
                          incluirCantidad: e.target.checked,
                        })),
                      )
                    }}
                  />
                }
                label="¿Incluir cantidad al inventario?"
              />
            </FormControl>
          )}
        />
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
        <Typography variant="subtitle2" gutterBottom component="div">
          &nbsp;Cantidad
        </Typography>
        <div className={'responsive-table'}>
          <table>
            <thead>
              <tr>
                <th data-name="COD" style={{ width: 50 }}>
                  COD
                </th>
                <th>NOMBRE SUCURSAL</th>
                <th style={{ width: 250 }}>CANTIDAD DISPONIBLE</th>
              </tr>
            </thead>
            <tbody>
              {sucursales &&
                sucursales.map((s, index: number) => (
                  <tr key={s.codigo}>
                    <td data-label="COD">{s.codigo}</td>
                    <td data-label="SUCURSAL">
                      {s.municipio} - {s.direccion}
                    </td>
                    <td data-label="CANTIDAD" style={{ textAlign: 'right' }}>
                      {varianteWatch.incluirCantidad ? (
                        <FormControl fullWidth component={'div'}>
                          <MyInputLabel shrink>Cantidad</MyInputLabel>
                          <InputNumber
                            min={0}
                            placeholder={'0.00'}
                            value={genReplaceEmpty(
                              varianteWatch.inventario.find(
                                (inv) => inv.sucursal.codigo === s.codigo,
                              )?.stock,
                              0,
                            )}
                            onFocus={handleSelect}
                            onChange={(stock: number | null) => {
                              if (stock) {
                                setValue(
                                  'variante.inventario',
                                  varianteWatch.inventario.map((item) => {
                                    return item.sucursal.codigo === s.codigo
                                      ? {
                                          ...item,
                                          stock,
                                        }
                                      : item
                                  }),
                                )
                              }
                            }}
                            onBlur={(eventStock) => {
                              if (variantesWatch.length > 0) {
                                // Actualizamos todos los stock de las variantes, en caso tuviera
                                replace(
                                  variantesWatch.map((item) => ({
                                    ...item,
                                    inventario: item.inventario.map((vi) => ({
                                      ...vi,
                                      stock: parseFloat(eventStock.target.value),
                                    })),
                                  })),
                                )
                              }
                            }}
                            formatter={numberWithCommas}
                          />
                        </FormControl>
                      ) : (
                        <Typography variant="subtitle2">No medido</Typography>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Grid>
    </Grid>
  )
}

export default GiftCardInventario
