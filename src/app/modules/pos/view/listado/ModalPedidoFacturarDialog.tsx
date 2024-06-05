import {
  Add,
  Close,
  ExpandMore,
  HomeWork,
  LibraryAddCheck,
  PersonAddAlt1Outlined,
  RecentActors,
  Remove,
  TableChart,
} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  Paper,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { replace } from 'lodash'
import pdfMake from 'pdfmake/build/pdfmake'
import printJS from 'print-js'
import InputNumber from 'rc-input-number'
import { FunctionComponent, useEffect, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'
import { SingleValue } from 'react-select'
import AsyncSelect from 'react-select/async'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { FormTextField } from '../../../../base/components/Form'
import { TarjetaMask } from '../../../../base/components/Mask/TarjetaMask'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import RepresentacionGraficaUrls from '../../../../base/components/RepresentacionGrafica/RepresentacionGraficaUrls'
import useAuth from '../../../../base/hooks/useAuth'
import { genReplaceEmpty } from '../../../../utils/helper'
import { swalException } from '../../../../utils/swal'
import { apiMetodosPago } from '../../../base/metodoPago/api/metodosPago.api'
import { MetodoPagoProp } from '../../../base/metodoPago/interfaces/metodoPago'
import { apiMonedas } from '../../../base/moneda/api/monedaListado.api'
import { MonedaProps } from '../../../base/moneda/interfaces/moneda'
import { apiClienteBusqueda } from '../../../clientes/api/clienteBusqueda.api'
import ClienteExplorarDialog from '../../../clientes/components/ClienteExplorarDialog'
import { ClienteProps } from '../../../clientes/interfaces/cliente'
import Cliente99001RegistroDialog from '../../../clientes/view/registro/Cliente99001RegistroDialog'
import ClienteRegistroDialog from '../../../clientes/view/registro/ClienteRegistroDialog'
import DatosCliente from '../../../ventas/view/registro/DatosCliente'
import { obtenerListadoPedidos } from '../../api/pedidosListado.api'
import { generarComandaPDF } from '../../Pdf/Comanda'
import { facturarPedido } from '../../Pdf/facturarPedido'
import { finalizarPedido } from '../../Pdf/finalizarPedido'
import { generarReciboPDF } from '../../Pdf/Recibo'
;(pdfMake as any).fonts = {
  Roboto: {
    normal:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
  },
}

interface Product {
  imagen: any
  extraDetalle?: string
  name: string
  price: number
  description?: string
  quantity: number
  discount: number
  extraDescription: string
  codigoAlmacen: string
  codigoArticuloUnidadMedida: string
  codigoArticulo: string
  fromDatabase?: boolean
  nroItem?: number
}

interface Option {
  value: Number
  nroPedido: Number | null
  nroOrden: Number | null
  mesa: string
  state: string
}
interface OwnProps {
  data: any
  onClose: any
  form: UseFormReturn<any>
}
type Props = OwnProps

//@ts-ignore
const ModalPedidoFacturar: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      watch,
      setValue,
      getValues,
      formState: { errors },
    },
    onClose,
  } = props
  const {
    user: {
      sucursal,
      puntoVenta,
      tipoRepresentacionGrafica,
      usuario,
      moneda,
      monedaTienda,
    },
  } = useAuth()

  const handleClose = () => {
    onClose()
  }

  const [cart, setCart] = useState<Product[]>([])
  const [additionalDiscount, setAdditionalDiscount] = useState<number>(0)
  const [giftCardAmount, setGiftCardAmount] = useState<number>(0)
  const [montoRecibido, setMontoRecibido] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)

  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteProps | null>(
    null,
  )

  const [openNuevoCliente, setNuevoCliente] = useState(false)
  const [openExplorarCliente, setExplorarCliente] = useState(false)
  const [openCliente99001, setCliente99001] = useState(false)

  const [printDescuentoAdicional, setPrintDescuentoAdicional] = useState<number>(0)

  const mySwal = withReactContent(Swal)

  const fetchClientes = async (inputValue: string): Promise<any[]> => {
    try {
      if (inputValue.length > 2) {
        const clientes = await apiClienteBusqueda(inputValue)
        if (clientes) return clientes
      }
      return []
    } catch (e: any) {
      swalException(e)
      return []
    }
  }

  useEffect(() => {
    const mappedProducts = props.data.productos.map((producto: any) => ({
      imagen: '', // Si tienes una URL para la imagen, puedes asignarla aquí
      nroItem: producto.nroItem,
      codigoArticulo: producto.codigoArticulo,
      name: producto.nombreArticulo,
      price: producto.articuloPrecio.monedaPrecio.precio,
      description: producto.sinProductoServicio.descripcionProducto,
      quantity: producto.articuloPrecio.cantidad,
      discount: producto.articuloPrecio.descuento,
      extraDescription: producto.nota || '',
      extraDetalle: producto.detalleExtra || '',
      codigoAlmacen: producto.almacen ? producto.almacen.codigoAlmacen : null,
      codigoArticuloUnidadMedida:
        producto.articuloPrecio.articuloUnidadMedida.codigoUnidadMedida || '',
      fromDatabase: true,
    }))

    const option = {
      value: Number(props.data.mesa.nombre),
      nroPedido: props.data.numeroPedido,
      nroOrden: props.data.numeroOrden,
      mesa: props.data.mesa.nombre,
      state: props.data.state,
    } as Option

    setSelectedOption(option)

    setCart(mappedProducts)
  }, [props.data])

  useEffect(() => {
    if (props.data.cliente) {
      setValue('cliente', props.data.cliente)
      setValue('emailCliente', props.data.cliente.email || '')
    }
  }, [props.data, setValue])

  const handleDiscountChange = (index: number, discount: number) => {
    const product = cart[index]
    if (discount > product.price * product.quantity) {
      toast.error('El descuento no puede ser mayor al precio total del producto')
      return
    }
    setCart((prevCart) =>
      prevCart.map((item, i) => (i === index ? { ...item, discount } : item)),
    )
  }

  const handleExtraDescriptionChange = (index: number, extraDescription: string) => {
    setCart((prevCart) =>
      prevCart.map((item, i) => (i === index ? { ...item, extraDescription } : item)),
    )
  }

  const handleDetalleExtraChange = (index: number, extraDetalle: string) => {
    setCart((prevCart) =>
      prevCart.map((item, i) => (i === index ? { ...item, extraDetalle } : item)),
    )
  }

  const subtotal = cart.reduce(
    (total, product) => total + product.price * product.quantity - product.discount,
    0,
  )

  const total = subtotal - additionalDiscount - giftCardAmount

  const { refetch } = useQuery<any[]>({
    queryKey: ['pedidosListadao'],
    queryFn: async () => {
      const fetchPagination = { page: 1, limit: 100, reverse: true, query: '' }
      const entidad = {
        codigoSucursal: sucursal.codigo,
        codigoPuntoVenta: puntoVenta.codigo,
      }
      const { docs } = await obtenerListadoPedidos(fetchPagination, entidad)
      return docs
    },
    refetchOnWindowFocus: false,
  })

  const handleFacturar = () => {
    console.log('Codigo de excepcion', getValues('codigoExcepcion'))
    // Mensaje de cliente no seleccionado
    if (clienteSeleccionado === null || clienteSeleccionado === undefined) {
      toast.error('Debe seleccionar un cliente')
      return
    }
    // Mensaje de mesa no seleccionada
    if (selectedOption === null) {
      toast.error('Debe seleccionar una mesa')
      return
    }

    // Si el estado es COMPLETADO, finalizamos y luego facturamos
    if (selectedOption?.state === 'COMPLETADO') {
      finalizarPedido(
        getValues(),
        puntoVenta,
        sucursal,
        // @ts-ignore
        selectedOption?.nroPedido ?? 0,
        additionalDiscount,
        () => {
          refetch()
        },
      )
        .then(() => {
          // Luego de finalizar el pedido, procedemos con la facturación
          facturarPedido(
            getValues(),
            puntoVenta,
            sucursal,
            // @ts-ignore
            selectedOption?.nroPedido ?? 0,
            usuario,
            refetch,
          )
            .then((response) => {
              if (response) {
                const { representacionGrafica } = response.factura
                if (tipoRepresentacionGrafica === 'pdf')
                  printJS(representacionGrafica.pdf)
                if (tipoRepresentacionGrafica === 'rollo')
                  printJS(representacionGrafica.rollo)
                mySwal.fire({
                  title: `Documento generado correctamente`,
                  html: (
                    <RepresentacionGraficaUrls
                      representacionGrafica={representacionGrafica}
                    />
                  ),
                })
                setValue('cliente', null)
                additionalDiscount !== 0 && setAdditionalDiscount(0)
                handleClose()
              }
            })
            .catch((error) => {
              console.error('Error al facturar el pedido:', error)
            })
        })
        .catch((error) => {
          console.error('Error al finalizar el pedido:', error)
        })
    } else if (selectedOption?.state === 'FINALIZADO') {
      // Si el estado es FINALIZADO, no es necesario finalizar nuevamente, procedemos directamente con la facturación
      facturarPedido(
        getValues(),
        puntoVenta,
        sucursal,
        // @ts-ignore
        selectedOption?.nroPedido ?? 0,
        usuario,
        refetch,
      )
        .then((response) => {
          if (response) {
            const { representacionGrafica } = response.factura
            if (tipoRepresentacionGrafica === 'pdf') printJS(representacionGrafica.pdf)
            if (tipoRepresentacionGrafica === 'rollo')
              printJS(representacionGrafica.rollo)
            mySwal.fire({
              title: `Documento generado correctamente`,
              html: (
                <RepresentacionGraficaUrls
                  representacionGrafica={representacionGrafica}
                />
              ),
            })
            setValue('cliente', null)
            additionalDiscount !== 0 && setAdditionalDiscount(0)
            handleClose()
          }
        })
        .catch((error) => {
          console.error('Error al facturar el pedido:', error)
        })
    }
  }

  useEffect(() => {
    const clienteSeleccionado = getValues('cliente')
    setClienteSeleccionado(clienteSeleccionado)
  }, [watch('cliente')])

  useEffect(() => {
    setPrintDescuentoAdicional(additionalDiscount)
  }, [additionalDiscount])
  const inputMoneda = getValues('moneda')

  const { data: monedas, isLoading: monedaLoading } = useQuery<MonedaProps[], Error>({
    queryKey: ['apiMonedas'],
    queryFn: async () => {
      const resp = await apiMonedas()
      if (resp.length > 0) {
        // monedaUsuario
        const sessionMoneda = resp.find(
          (i) => i.codigo === genReplaceEmpty(inputMoneda?.codigo, moneda.codigo),
        )
        // montoTienda
        const mt = resp.find((i) => i.codigo === monedaTienda.codigo)
        if (sessionMoneda && mt) {
          setValue('moneda', sessionMoneda)
          setValue('tipoCambio', mt.tipoCambio)
        }
        return resp
      }
      return []
    },
  })

  const { data: metodosPago, isLoading: mpLoading } = useQuery<MetodoPagoProp[], Error>({
    queryKey: ['metodosPago'],
    queryFn: async () => {
      const resp = await apiMetodosPago()
      if (resp.length > 0) {
        return resp
      }
      return []
    },
  })
  // colocamos el valor de la api en el campo de metodo de pago
  useEffect(() => {
    setValue('metodoPago', props.data.metodoPago)
    setAdditionalDiscount(props.data.descuentoAdicional)
    setValue('numeroTarjeta', props.data.numeroTarjeta)
  }, [metodosPago])

  return (
    <Dialog open={true} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h6">Detalles del Pedido</Typography>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item>
                <Button
                  endIcon={<HomeWork />}
                  onClick={handleFacturar}
                  variant="contained"
                  color="primary"
                  disabled={props.data.tipoDocumento === 'FACTURA'}
                >
                  Facturar
                </Button>
              </Grid>
              <Grid item>
                <Tooltip title="Generar Comanda">
                  <IconButton
                    onClick={() =>
                      generarComandaPDF(
                        cart,
                        usuario,
                        selectedOption?.mesa,
                        selectedOption?.nroOrden?.toString(),
                      )
                    }
                    style={{ color: '#6e7b8c' }}
                  >
                    <LibraryAddCheck />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Generar Estado de Cuenta">
                  <IconButton
                    onClick={() =>
                      generarReciboPDF(
                        cart,
                        usuario,
                        total,
                        selectedOption?.mesa,
                        selectedOption?.nroOrden?.toString(),
                        printDescuentoAdicional.toString(),
                      )
                    }
                    style={{ color: '#b69198' }}
                  >
                    <RecentActors />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Cerrar">
                  <IconButton onClick={handleClose} sx={{ color: 'red' }}>
                    <Close />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6} sx={{ userSelect: 'none' }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Grid container justifyContent="center">
                {selectedOption && (
                  <Grid container justifyContent="center">
                    <Grid
                      item
                      sx={{
                        backgroundColor:
                          selectedOption.state === 'Libre' ? '#AFE3B7' : '#FFF6E9',
                        backgroundBlendMode: 'overlay',
                        padding: '10px',
                        borderRadius: '8px',
                        width: '100%',
                      }}
                    >
                      <Grid container justifyContent="space-between" padding={1}>
                        <Grid item>
                          <Typography variant="h6">
                            {selectedOption.nroPedido !== null
                              ? `Pedido: ${selectedOption.nroOrden}`
                              : `Mesa: ${selectedOption.mesa}`}
                          </Typography>
                          <Typography variant="body1">
                            {selectedOption.nroPedido !== null
                              ? `Mesa: ${selectedOption.mesa}`
                              : ``}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body2">
                            {selectedOption.state !== null
                              ? `Estado: ${selectedOption.state}`
                              : `Estado: Libre`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Box
                sx={{
                  backgroundColor: '#FFFFFF',
                  paddingTop: 2,
                }}
              >
                {cart.map((product, index) => (
                  <Zoom in={true} key={index}>
                    <Accordion
                      key={index}
                      sx={{ mb: 1 }}
                      onClick={(event) => event.stopPropagation()}
                      style={{ backgroundColor: '#EEF5FB', borderRadius: 7 }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          backgroundColor: '#EEF5FB',
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                          }}
                          onClick={(event) => event.stopPropagation()} // Detener la propagación del evento en el elemento del producto
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1">{product.name}</Typography>
                            <Typography variant="body1">
                              ${product.price.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton color="primary">
                              <Remove />
                            </IconButton>
                            <Typography variant="h6">{product.quantity}</Typography>
                            <IconButton color="primary">
                              <Add />
                            </IconButton>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              {product.discount > 0 && (
                                <Typography
                                  variant="body2"
                                  sx={{ textDecoration: 'line-through', color: 'gray' }}
                                >
                                  ${(product.price * product.quantity).toFixed(2)}
                                </Typography>
                              )}
                              <Typography variant="body1">
                                $
                                {(
                                  product.price * product.quantity -
                                  product.discount
                                ).toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ display: 'flex' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={5}>
                            <FormTextField
                              label="Descuento"
                              type="number"
                              value={product.discount || 0}
                              onChange={(e) =>
                                handleDiscountChange(
                                  index,
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              sx={{ width: '100%' }}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={7}>
                            <FormTextField
                              label="Notas"
                              value={product.extraDescription}
                              onChange={(e) =>
                                handleExtraDescriptionChange(index, e.target.value)
                              }
                              sx={{ width: '100%' }}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormTextField
                              label="Detalle Extra"
                              value={product.extraDetalle}
                              onChange={(e) =>
                                handleDetalleExtraChange(index, e.target.value)
                              }
                              sx={{ width: '100%' }}
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Zoom>
                ))}
              </Box>
              <hr />
              <Typography variant="h6">Resumen del Pedido</Typography>
              <List dense>
                <ListItem
                  style={{ padding: 0 }}
                  secondaryAction={
                    <Typography variant="subtitle1" gutterBottom>
                      {numberWithCommas(subtotal, {})}
                      <span style={{ fontSize: '0.8em' }}> BOB</span>
                    </Typography>
                  }
                >
                  <ListItemText primary={<strong>Sub Total</strong>} />
                </ListItem>
                <List dense>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Descuento Adicional:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FormTextField
                        value={additionalDiscount || ''} // Establecer el valor predeterminado como una cadena vacía si es nulo
                        onChange={
                          (e) => setAdditionalDiscount(parseFloat(e.target.value) || 0) // Convertir a número y establecer como 0 si se borra todo
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography variant="body1"> BOB</Typography>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          width: '100%',
                          '& input': { textAlign: 'right' }, // Alinear el texto a la derecha
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Tarjeta de Regalo:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FormTextField
                        value={giftCardAmount || ''}
                        onChange={(e) =>
                          setGiftCardAmount(parseFloat(e.target.value) || 0)
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography variant="body1"> BOB</Typography>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          width: '100%',
                          '& input': { textAlign: 'right' },
                        }}
                      />
                    </Grid>
                  </Grid>
                </List>
              </List>
              <List>
                <ListItem
                  style={{ padding: 0 }}
                  secondaryAction={
                    <Typography variant="h6" gutterBottom>
                      <span style={{ fontWeight: 'bold', color: 'green' }}>
                        {numberWithCommas(total, {})}
                        <span> BOB</span>
                      </span>
                    </Typography>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        color="error"
                        style={{ fontWeight: 'bold' }}
                      >
                        Total
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <FormControl fullWidth error={Boolean(errors.inputMontoPagar?.message)}>
                    <MyInputLabel shrink>Ingrese Monto</MyInputLabel>
                    <InputNumber
                      min={0}
                      id={'montoPagar'}
                      className="inputMontoPagar"
                      value={montoRecibido ?? 0}
                      onChange={(value) => setMontoRecibido(value ?? 0)}
                      precision={2}
                      formatter={numberWithCommas}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Cambio</InputLabel>
                    <OutlinedInput
                      label={'Cambio'}
                      size={'small'}
                      value={numberWithCommas(montoRecibido - total, {})}
                      readOnly
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Grid container spacing={2} rowSpacing={3}>
                <Grid item xs={12} sm={7} lg={7} xl={8}>
                  <Controller
                    name="cliente"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.cliente)}>
                        <MyInputLabel shrink>Búsqueda de clientes</MyInputLabel>
                        <AsyncSelect<ClienteProps>
                          {...field}
                          cacheOptions={false}
                          defaultOptions={true}
                          styles={reactSelectStyle(Boolean(errors.cliente))}
                          menuPosition={'fixed'}
                          name="clientes"
                          placeholder={'Seleccione Cliente'}
                          loadOptions={fetchClientes}
                          isClearable={true}
                          value={field.value || null}
                          getOptionValue={(item) => item.codigoCliente}
                          getOptionLabel={(item) =>
                            `${item.numeroDocumento}${item.complemento || ''} - ${
                              item.razonSocial
                            } - ${item.tipoDocumentoIdentidad.descripcion}`
                          }
                          onChange={(cliente: SingleValue<ClienteProps>) => {
                            field.onChange(cliente)
                            setValue('emailCliente', genReplaceEmpty(cliente?.email, ''))
                          }}
                          onBlur={field.onBlur}
                          noOptionsMessage={() =>
                            'Ingrese referencia -> Razon Social, Codigo Cliente, Numero documento'
                          }
                          loadingMessage={() => 'Buscando...'}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={5} lg={5} xl={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setExplorarCliente(true)}
                    startIcon={<TableChart />}
                  >
                    Explorar Clientes
                  </Button>
                </Grid>

                <Grid item xs={12} sm={7} lg={7} xl={5}>
                  <Controller
                    control={control}
                    name={'emailCliente'}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={Boolean(errors.emailCliente)}
                        fullWidth
                        name={'emailCliente'}
                        size={'small'}
                        label="Correo Electrónico Alternativo"
                        value={field.value || ''}
                        disabled={!getValues('cliente')}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={5} lg={5} xl={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    title={'Nuevo Cliente'}
                    onClick={() => setNuevoCliente(true)}
                    startIcon={<PersonAddAlt1Outlined />}
                  >
                    N. Cliente
                  </Button>
                </Grid>
                <Grid item xs={12} md={12} sm={3} xl={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setCliente99001(true)}
                    startIcon={<PersonAddAlt1Outlined />}
                  >
                    N. Cliente 99001
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <FormGroup>
                    <Controller
                      name={'codigoExcepcion'}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={!!getValues('codigoExcepcion')}
                            />
                          }
                          label="Permitir facturar incluso si el NIT es inválido"
                          name={'codigoExcepcion'}
                        />
                      )}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  <DatosCliente form={props.form} />
                </Grid>
              </Grid>
            </Paper>
            <Grid item xs={12} sx={{ mt: 2 }}>
              {monedaLoading ? (
                <AlertLoading />
              ) : (
                <Controller
                  name="moneda"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={Boolean(errors.moneda)}>
                      <MyInputLabel shrink>Moneda de venta</MyInputLabel>
                      <Select<MonedaProps>
                        {...field}
                        styles={reactSelectStyle(Boolean(errors.moneda))}
                        name="moneda"
                        placeholder={'Seleccione la moneda de venta'}
                        value={field.value}
                        onChange={async (val: any) => {
                          field.onChange(val)
                        }}
                        onBlur={async () => {
                          field.onBlur()
                        }}
                        isSearchable={false}
                        menuPosition={'fixed'}
                        options={monedas}
                        getOptionValue={(item) => item.codigo.toString()}
                        getOptionLabel={(item) =>
                          `${item.descripcion} (${item.sigla}) - ${numberWithCommas(item.tipoCambio, {})}`
                        }
                      />
                    </FormControl>
                  )}
                />
              )}
            </Grid>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                {mpLoading ? (
                  <AlertLoading />
                ) : (
                  <Controller
                    name="metodoPago"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.metodoPago)}>
                        <MyInputLabel shrink>Método de Pago</MyInputLabel>
                        <Select<MetodoPagoProp>
                          {...field}
                          styles={reactSelectStyle(Boolean(errors.metodoPago))}
                          name="codigoMetodoPago"
                          placeholder={'Seleccione el método de pago'}
                          value={field.value}
                          onChange={async (val: any) => {
                            field.onChange(val)
                            setValue('numeroTarjeta', null)
                          }}
                          onBlur={async () => {
                            field.onBlur()
                          }}
                          menuPosition={'fixed'}
                          isSearchable={false}
                          options={metodosPago}
                          getOptionValue={(item) => item.codigoClasificador.toString()}
                          getOptionLabel={(item) =>
                            `${item.codigoClasificador} - ${item.descripcion}`
                          }
                        />
                      </FormControl>
                    )}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="numeroTarjeta"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth style={{ zIndex: 0 }}>
                      <TextField
                        label="Número de tarjeta"
                        variant={'outlined'}
                        value={field.value || ''}
                        onChange={(event) => {
                          const numeroTarjeta = replace(
                            event.target.value,
                            new RegExp('-', 'g'),
                            '',
                          )
                            .replace(/_/g, '')
                            .trim()
                          field.onChange(numeroTarjeta)
                        }}
                        name="numeroTarjeta"
                        disabled={getValues('metodoPago.codigoClasificador') !== 2}
                        size={'small'}
                        InputProps={{
                          inputComponent: TarjetaMask as any,
                          readOnly: getValues('metodoPago.codigoClasificador') !== 2,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <FormHelperText>
                        Ingrese los primeros 4 y últimos 4 dígitos
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <>
          <ClienteExplorarDialog
            id={'explorarClienteDialog'}
            keepMounted={false}
            open={openExplorarCliente}
            onClose={async (value?: ClienteProps) => {
              if (value) {
                setValue('cliente', value)
                setValue('emailCliente', value.email)
                await fetchClientes(value.codigoCliente)
                setExplorarCliente(false)
              } else {
                setExplorarCliente(false)
              }
            }}
          />
        </>
        <>
          <Cliente99001RegistroDialog
            id={'explorarClienteDialog99001'}
            keepMounted={false}
            open={openCliente99001}
            onClose={async (value?: ClienteProps) => {
              if (value) {
                setValue('cliente', value)
                setValue('emailCliente', value.email)
                await fetchClientes(value.codigoCliente)
                setCliente99001(false)
              } else {
                setCliente99001(false)
              }
            }}
          />
        </>
        <>
          <ClienteRegistroDialog
            id={'nuevoClienteDialog'}
            keepMounted={false}
            open={openNuevoCliente}
            onClose={async (value?: ClienteProps) => {
              if (value) {
                setValue('cliente', value)
                setValue('emailCliente', value.email)
                await fetchClientes(value.codigoCliente)
                setNuevoCliente(false)
              } else {
                setNuevoCliente(false)
              }
            }}
          />
        </>
      </DialogContent>
    </Dialog>
  )
}

export default ModalPedidoFacturar
