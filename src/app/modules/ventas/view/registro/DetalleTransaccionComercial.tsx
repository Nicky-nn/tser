import { Delete, TextIncrease } from '@mui/icons-material'
import {
  Avatar,
  Button,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import InputNumber from 'rc-input-number'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import AsyncSelect from 'react-select/async'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import { reactSelectStyles } from '../../../../base/components/MySelect/ReactSelect'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../../base/hooks/useAuth'
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
  const handleFocus = (event: any) => event.target.select()

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

  const cargarVariantesProductos = async (inputValue: string): Promise<any[]> => {
    try {
      const productos = await apiProductosVariantesBusqueda(inputValue)
      if (productos) return productos
      return []
    } catch (e: any) {
      swalException(e)
      return []
    }
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
                <MyInputLabel shrink>Busqueda de Productos</MyInputLabel>
                <AsyncSelect<ProductoVarianteProps>
                  cacheOptions={false}
                  defaultOptions={false}
                  styles={reactSelectStyles}
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
                              <InputNumber
                                min={0.1}
                                value={item.cantidad}
                                onFocus={handleFocus}
                                onChange={(cantidad: number | null) => {
                                  if (cantidad) {
                                    if (cantidad >= 0) {
                                      update(index, {
                                        ...item,
                                        cantidad,
                                      })
                                    }
                                  }
                                }}
                                formatter={numberWithCommas}
                              />
                            </td>
                            <td data-label={`PRECIO (${monedaTienda.sigla})`}>
                              <InputNumber
                                min={0}
                                value={item.precioUnitario}
                                onFocus={handleFocus}
                                onChange={(precio: number | null) => {
                                  if (precio) {
                                    if (precio >= 0 && precio >= item.montoDescuento) {
                                      update(index, { ...item, precioUnitario: precio })
                                    } else {
                                      toast.warn(
                                        'El precio no puede ser menor al descuento',
                                      )
                                    }
                                  }
                                }}
                                formatter={numberWithCommas}
                              />
                            </td>
                            <td data-label={`DESCUENTO (${monedaTienda.sigla})`}>
                              <InputNumber
                                min={0}
                                max={item.cantidad * item.precioUnitario - 0.1}
                                value={item.montoDescuento || 0}
                                onFocus={handleFocus}
                                onChange={(montoDescuento: number | null) => {
                                  if (montoDescuento! >= 0) {
                                    if (
                                      montoDescuento! <=
                                      item.precioUnitario * item.cantidad
                                    ) {
                                      update(index, {
                                        ...item,
                                        montoDescuento: montoDescuento!,
                                      })
                                    } else {
                                      toast.warn(
                                        `El descuento no puede ser mayor ${
                                          item.cantidad * item.precioUnitario
                                        }`,
                                      )
                                    }
                                  }
                                }}
                                formatter={numberWithCommas}
                              />
                            </td>
                            <td
                              data-label={`SUB-TOTAL (${monedaTienda.sigla || ''})`}
                              style={{ textAlign: 'right', backgroundColor: '#fafafa' }}
                            >
                              <Typography
                                variant="subtitle1"
                                gutterBottom
                                component="div"
                              >
                                <strong>
                                  {numberWithCommas(
                                    item.cantidad * item.precioUnitario -
                                      item.montoDescuento,
                                    {},
                                  )}
                                </strong>
                              </Typography>
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
