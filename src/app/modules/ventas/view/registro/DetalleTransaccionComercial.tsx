import { Delete, TextIncrease } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import AsyncSelect from 'react-select/async'
import Swal from 'sweetalert2'

import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { NumeroMask } from '../../../../base/components/Mask/NumeroMask'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../../base/hooks/useAuth'
import { genReplaceEmpty, handleSelect } from '../../../../utils/helper'
import { pFloat } from '../../../../utils/pFloat'
import { swalException } from '../../../../utils/swal'
import { apiProductosVariantesBusqueda } from '../../../productos/api/productosVariantesBusqueda.api'
import ProductoExplorarDialog from '../../../productos/components/ProductoExplorarDialog'
import { ProductoVarianteProps } from '../../../productos/interfaces/producto.interface'
import { FacturaDetalleInputProps, FacturaInputProps } from '../../interfaces/factura'
import {
  genCalculoTotalesService,
  montoSubTotal,
} from '../../services/operacionesService'
import AgregarArticuloDialog from './AgregarArticuloDialog'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
}

type Props = OwnProps
/**
 * @description Detalle de la transaccion comercial
 * @param props
 * @constructor
 */
export const DetalleTransaccionComercial: FC<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props
  const { user } = useAuth()
  const monedaTienda = user.monedaTienda

  const { fields, append, prepend, remove, insert, update } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'detalle', // unique name for your Field Array
  })

  const [openAgregarArticulo, setOpenAgregarArticulo] = useState(false)
  const [openExplorarProducto, setOpenExplorarProducto] = useState(false)

  const handleChange = async (newInput: ProductoVarianteProps) => {
    if (newInput) {
      // Verificamos si ya existe el producto (no se verifica)
      // const producto = fields.find((d) => d.codigoProducto === newInput.codigoProducto);
      prepend({
        ...newInput,
        codigoProductoSin: newInput.sinProductoServicio.codigoProducto,
        cantidad: 1,
        precioUnitario: newInput.precio,
        montoDescuento: 0,
        detalleExtra: newInput.detalleExtra,
        subtotal: 0,
      } as FacturaDetalleInputProps)
    }
  }

  // AÑADIMOS O SETEAMOS A CERO EL DETALLE EXTRA
  const handleAddDetalleExtra = (index: number, newInput: FacturaDetalleInputProps) => {
    update(index, newInput)
  }

  /**
   * @description Cargamos los productos a travez de la busqueda por expresion regular
   * @param inputValue
   */
  const cargarVariantesProductos = async (inputValue: string): Promise<any[]> => {
    try {
      if (inputValue.trim().length >= 1) {
        const productos = await apiProductosVariantesBusqueda(inputValue)
        if (productos) return productos
      }
      return []
    } catch (e: any) {
      swalException(e)
      return []
    }
  }
  /**
   * @description Generamos el subTotal por fila
   * @param cantidad
   * @param precio
   * @param descuento
   */
  const genSubTotal = (cantidad: number, precio: number, descuento: number) => {
    const st = cantidad * precio - descuento
    return (
      <Box
        sx={{
          color: st > 0 ? 'primary.main' : 'error.main',
          fontSize: 17,
          pt: '5px',
          fontWeight: 500,
        }}
      >
        {numberWithCommas(st, {})}
      </Box>
    )
  }

  useEffect(() => {
    const totales = genCalculoTotalesService(getValues())
    setValue('montoSubTotal', totales.subTotal)
    setValue('montoPagar', totales.montoPagar)
    setValue('inputVuelto', totales.vuelto)
    setValue('total', totales.total)
  }, [fields])

  useEffect(() => {
    if (getValues('actividadEconomica')) cargarVariantesProductos('').then()
  }, [getValues('actividadEconomica')])

  if (getValues('actividadEconomica.codigoActividad')) {
    return (
      <>
        <SimpleCard title="Productos">
          <Grid container spacing={1}>
            <Grid item xs={12} lg={7} md={7} sm={12}>
              <FormControl fullWidth>
                <MyInputLabel shrink>Búsqueda de Productos</MyInputLabel>
                <AsyncSelect<ProductoVarianteProps>
                  cacheOptions={false}
                  defaultOptions={false}
                  styles={reactSelectStyle(false)}
                  menuPosition={'fixed'}
                  name="productosServicios"
                  placeholder={'Seleccione producto'}
                  loadOptions={cargarVariantesProductos}
                  isClearable={true}
                  value={null}
                  getOptionValue={(item) => item.codigoProducto}
                  getOptionLabel={(item) => `${item.codigoProducto} - ${item.nombre}`}
                  onChange={(val: any) => handleChange(val)}
                  noOptionsMessage={() =>
                    'Ingrese referencia al Producto/Servicio deseado'
                  }
                  loadingMessage={() => 'Buscando...'}
                />
              </FormControl>
              <FormHelperText>Mínimo 1 caracteres</FormHelperText>
            </Grid>

            <Grid item xs={12} md={5} lg={5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button variant="outlined" onClick={() => setOpenExplorarProducto(true)}>
                  Explorar Productos
                </Button>
                <Button onClick={() => setOpenAgregarArticulo(true)} variant="outlined">
                  Producto Personalizado
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <div className="responsive-table" style={{ marginTop: 20 }}>
                <table>
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: 400 }}>
                        Producto
                      </th>
                      <th scope="col" style={{ width: 160 }}>
                        Cantidad
                      </th>
                      <th scope="col" style={{ width: 160 }}>
                        Precio ({monedaTienda.sigla})
                      </th>
                      <th scope="col" style={{ width: 160 }}>
                        Descuento ({monedaTienda.sigla})
                      </th>
                      <th scope="col" style={{ width: 150 }}>
                        SUB Total ({monedaTienda.sigla})
                      </th>
                      <th scope="col" style={{ width: 100 }}>
                        Opciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.length > 0 &&
                      fields.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td data-label="Producto">
                              <List
                                dense={true}
                                sx={{
                                  width: '400%',
                                  maxWidth: 360,
                                  bgcolor: 'background.paper',
                                  padding: 0,
                                }}
                              >
                                <ListItem alignItems="flex-start">
                                  <ListItemAvatar>
                                    <Avatar
                                      alt="Remy Sharp"
                                      src="/static/images/avatar/1.jpg"
                                    />
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <>
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom={true}
                                        >
                                          {item.nombre}{' '}
                                          <span style={{ fontWeight: 'normal' }}>
                                            {item.detalleExtra || ''}
                                          </span>
                                        </Typography>
                                      </>
                                    }
                                    secondary={
                                      <Fragment>
                                        <Typography
                                          sx={{ display: 'inline' }}
                                          component="span"
                                          variant="body2"
                                          color="text.primary"
                                        >
                                          {`Código: ${item.codigoProducto}`}
                                        </Typography>{' '}
                                        <br />
                                        {`${item.unidadMedida.descripcion || ''}`}
                                      </Fragment>
                                    }
                                  />
                                </ListItem>
                              </List>
                            </td>
                            <td data-label="CANTIDAD">
                              <OutlinedInput
                                error={(item.cantidad || 0) === 0}
                                size={'small'}
                                value={item.cantidad?.toString()}
                                onFocus={handleSelect}
                                onChange={({ target }) => {
                                  const cantidad = pFloat(target.value)
                                  update(index, {
                                    ...item,
                                    cantidad,
                                  })
                                }}
                                inputComponent={NumeroMask as any}
                                inputProps={{}}
                              />
                            </td>
                            <td data-label={`PRECIO (${monedaTienda.sigla})`}>
                              <OutlinedInput
                                error={(item.precioUnitario || 0) === 0}
                                size={'small'}
                                value={item.precioUnitario?.toString()}
                                onFocus={handleSelect}
                                onChange={({ target }) => {
                                  const precioUnitario = pFloat(target.value)
                                  update(index, {
                                    ...item,
                                    precioUnitario,
                                  })
                                }}
                                inputComponent={NumeroMask as any}
                                inputProps={{}}
                              />
                            </td>
                            <td data-label={`DESCUENTO (${monedaTienda.sigla})`}>
                              <OutlinedInput
                                size={'small'}
                                value={item.montoDescuento?.toString()}
                                onFocus={handleSelect}
                                onChange={({ target }) => {
                                  const montoDescuento = pFloat(target.value)
                                  update(index, {
                                    ...item,
                                    montoDescuento,
                                  })
                                }}
                                inputComponent={NumeroMask as any}
                                inputProps={{}}
                              />
                            </td>
                            <td
                              data-label={`SUB-TOTAL (${monedaTienda.sigla || ''})`}
                              style={{ textAlign: 'right', backgroundColor: '#fafafa' }}
                            >
                              {genSubTotal(
                                genReplaceEmpty(item.cantidad, 0),
                                genReplaceEmpty(item.precioUnitario, 0),
                                genReplaceEmpty(item.montoDescuento, 0),
                              )}
                            </td>
                            <td data-label="OPCIONES" style={{ textAlign: 'right' }}>
                              <IconButton onClick={() => remove(index)}>
                                <Delete color="warning" />
                              </IconButton>
                              <IconButton
                                onClick={async () => {
                                  const { value: text } = await Swal.fire({
                                    input: 'textarea',
                                    inputLabel: 'Añadir descripción extra',
                                    inputPlaceholder: 'Ingrese su descripcion extra...',
                                    inputValue: item.detalleExtra || '',
                                    inputAttributes: {
                                      'aria-label': 'Type your message here',
                                    },
                                    showCancelButton: true,
                                    cancelButtonText: 'Cancelar',
                                    confirmButtonText: 'Agregar Descripción',
                                  })
                                  handleAddDetalleExtra(index, {
                                    ...item,
                                    detalleExtra: text || '',
                                  })
                                }}
                              >
                                <TextIncrease color="primary" />
                              </IconButton>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </Grid>
          </Grid>
        </SimpleCard>
        <>
          <AgregarArticuloDialog
            id={'agregarArticulo'}
            keepMounted={false}
            open={openAgregarArticulo}
            codigoActividad={getValues('actividadEconomica.codigoActividad')}
            onClose={(newProduct: any) => {
              handleChange(newProduct).then()
              setOpenAgregarArticulo(false)
            }}
          />
        </>
        <>
          <ProductoExplorarDialog
            id={'explorarProductos'}
            keepMounted={false}
            open={openExplorarProducto}
            codigoActividad={getValues('actividadEconomica.codigoActividad')}
            onClose={(newProduct?: ProductoVarianteProps[]) => {
              if (newProduct) {
                for (const pvp of newProduct) {
                  handleChange(pvp).then()
                }
              }
              setOpenExplorarProducto(false)
            }}
          />
        </>
      </>
    )
  }
  return (
    <>
      <AlertLoading />
    </>
  )
}
