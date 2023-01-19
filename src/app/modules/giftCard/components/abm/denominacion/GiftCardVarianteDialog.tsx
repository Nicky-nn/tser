import React, { FunctionComponent } from 'react'
import { ClienteProps } from '../../../../clientes/interfaces/cliente'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from '@mui/material'
import { UseFieldArrayReturn, UseFormReturn, useWatch } from 'react-hook-form'
import { GiftCardInputProps } from '../../../interfaces/giftCard.interface'
import { MyInputLabel } from '../../../../../base/components/MyInputs/MyInputLabel'
import InputNumber from 'rc-input-number'
import { genReplaceEmpty, handleSelect } from '../../../../../utils/helper'
import { numberWithCommas } from '../../../../../base/components/MyInputs/NumberInput'

interface OwnProps {
  id: string
  keepMounted: boolean
  form: UseFormReturn<GiftCardInputProps>
  variantes: UseFieldArrayReturn<GiftCardInputProps, 'variantes', 'id'>
  open: boolean
  index: number
  onClose: (value?: ClienteProps) => void
}

type Props = OwnProps

const GiftCardVarianteDialog: FunctionComponent<Props> = (props) => {
  const { form, onClose, keepMounted, open, index, variantes, ...other } = props
  const { control, setValue } = form
  const variante = useWatch({
    control,
    name: 'variantes',
  })[index]

  const [varianteWatch] = form.watch(['variante'])

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '90%', maxHeight: 435 } }}
      maxWidth="md"
      keepMounted={keepMounted}
      open={open}
      {...other}
    >
      <DialogTitle>Modificar {variante.codigoProducto} </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={1}>
          <Grid item lg={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={variante.incluirCantidad}
                    name={`variantes.${index}.incluidCantidad`}
                    onChange={(e) => {
                      setValue(`variantes.${index}.incluirCantidad`, e.target.checked)
                    }}
                  />
                }
                label={'¿Incluir cantidad al inventario?'}
              />
            </FormGroup>
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
                  {variante.inventario &&
                    variante.inventario.map((s, i: number) => (
                      <tr key={s.sucursal.codigo}>
                        <td data-label="COD">{s.sucursal.codigo}</td>
                        <td data-label="SUCURSAL">
                          {s.sucursal.municipio} - {s.sucursal.direccion}
                        </td>
                        <td data-label="CANTIDAD" style={{ textAlign: 'right' }}>
                          {variante.incluirCantidad ? (
                            <FormControl fullWidth component={'div'}>
                              <MyInputLabel shrink>Cantidad</MyInputLabel>
                              <InputNumber
                                min={0}
                                placeholder={'0.00'}
                                name={`variantes.${index}.inventario.${i}.stock`}
                                value={genReplaceEmpty(
                                  variante.inventario.find(
                                    (inv) => inv.sucursal.codigo === s.sucursal.codigo,
                                  )?.stock,
                                  0,
                                )}
                                onFocus={handleSelect}
                                onChange={(stock: number | null) => {
                                  if (stock) {
                                    setValue(
                                      `variantes.${index}.inventario`,
                                      varianteWatch.inventario.map((item) => {
                                        return item.sucursal.codigo === s.sucursal.codigo
                                          ? {
                                              ...item,
                                              stock,
                                            }
                                          : item
                                      }),
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
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          color={'error'}
          variant={'contained'}
          style={{ marginRight: 15 }}
          size={'small'}
          onClick={() => {
            onClose()
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GiftCardVarianteDialog
