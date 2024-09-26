import {
  AccountBalance,
  Add,
  AltRoute,
  AttachMoney,
  Close,
  CreditCard,
  CurrencyExchange,
  Delete,
  Done,
  DoneAll,
  Edit,
  ExpandMore,
  Home,
  MoreHoriz,
  MoreVert,
  NineK,
  PercentOutlined,
  PersonAdd,
  Pix,
  PointOfSale,
  Print,
  QrCode,
  Receipt,
  Redeem,
  Remove,
  Room,
  Save,
  Search,
  ShoppingCartOutlined,
  ViewList,
  ViewModule,
} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Skeleton,
  styled,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
} from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import pdfMake from 'pdfmake/build/pdfmake'
import printJS from 'print-js'
import { FunctionComponent, ReactNode, useEffect, useMemo, useState } from 'react'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select, { SingleValue } from 'react-select'
import AsyncSelect from 'react-select/async'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import AlertLoading from '../../../base/components/Alert/AlertLoading'
import { FormTextField } from '../../../base/components/Form'
import { NumeroFormat } from '../../../base/components/Mask/NumeroFormat'
import { MyInputLabel } from '../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import { reactSelectStyle } from '../../../base/components/MySelect/ReactSelect'
import useAuth from '../../../base/hooks/useAuth'
import { SinTipoDocumentoIdentidadProps } from '../../../interfaces/sin.interface'
import { genReplaceEmpty } from '../../../utils/helper'
import { swalException } from '../../../utils/swal'
import useQueryMetodosPago from '../../base/metodoPago/hooks/useQueryMetodosPago'
import { MetodoPagoProp } from '../../base/metodoPago/interfaces/metodoPago'
import { apiClienteBusqueda } from '../../clientes/api/clienteBusqueda.api'
import ClienteExplorarDialog from '../../clientes/components/ClienteExplorarDialog'
import { ClienteProps } from '../../clientes/interfaces/cliente'
import Cliente99001RegistroDialog from '../../clientes/view/registro/Cliente99001RegistroDialog'
import ClienteRegistroDialog from '../../clientes/view/registro/ClienteRegistroDialog'
import useQueryTipoDocumentoIdentidad from '../../sin/hooks/useQueryTipoDocumento'
import { apiListadoPorInventarioEntidad } from '../api/articulos.api'
import { obtenerListadoPedidos } from '../api/pedidosListado.api'
import { apiListadoEspacios } from '../api/restauranteEspacios.api'
import { generarComandaPDF } from '../Pdf/Comanda'
import { facturarPedido } from '../Pdf/facturarPedido'
import { finalizarPedido } from '../Pdf/finalizarPedido'
import { generarReciboPDF } from '../Pdf/Recibo'
import { useWhatsappSender } from '../Pdf/sendWhatsappMessage'
import MetodoPagoButton from '../utils/MetodoPagoButton'
import { actualizarItemPedido } from '../utils/Pedidos/actualizarItem'
import { adicionarItemPedido } from '../utils/Pedidos/adicionarItems'
import { eliminarPedido } from '../utils/Pedidos/pedidoEliminar'
import { restPedidoExpressRegistro } from '../utils/Pedidos/PedidoExpress'
import { eliminarPedidoTodo } from '../utils/Pedidos/pedidoTodoEliminar'
import CreditCardDialog from './CardDialog'
import DeliveryDialog from './listado/PedidosDeliveryDialog'
import NuevoEspacioDialog from './registro/DialogRegistroMesas'
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
const ICONS = {
  EFECTIVO: AttachMoney,
  TARJETA: CreditCard,
  'EFECTIVO-TARJETA': PointOfSale,
  'TRANSFERENCIA BANCARIA': AccountBalance,
  'TARJETA-CHEQUE': CreditCard,
  'EFECTIVO-DEPOSITO EN CUENTA': CurrencyExchange,
  'DEBITO AUTOMATICO -  TRANSFERENCIA BANCARIA': QrCode,
  CHEQUE: Receipt,
  'GIFT-CARD': Redeem,
  OTROS: AltRoute,
  QR: QrCode,
}
interface Product {
  sigla: ReactNode
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

interface ProductoProps {
  imagen: any
  articuloPrecio: any
  detalleExtra: unknown
  tipoArticulo: {
    codigo: string
    descripcion: string
    grupoUnidadMedida: {
      descripcion: string
    }
    state: string
  }
  codigoArticulo: string
  nombreArticulo: string
  descripcionArticulo: string
  sinProductoServicio: {
    descripcionProducto: string
  }
  articuloPrecioBase: {
    articuloUnidadMedida: {
      codigoUnidadMedida: any
      nombreUnidadMedida: string
    }
    monedaPrimaria: {
      moneda: {
        descripcion: string
        sigla: string
      }
      precioBase: number
      precio: number
    }
  }
  inventario: {
    detalle: {
      almacen: {
        codigoAlmacen: string
      }
    }[]

    totalStock: number
  }[]
}

interface Option {
  value: Number
  nroPedido: Number | null
  nroOrden: Number | null
  mesa: string
  state: string
}
interface OwnProps {
  form: UseFormReturn<any>
  // eslint-disable-next-line no-unused-vars
  changeTab: (newTabIndex: number) => void
}
type Props = OwnProps

const PedidoGestion: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      watch,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props
  const {
    user: { sucursal, puntoVenta, tipoRepresentacionGrafica, usuario, miEmpresa },
  } = useAuth()

  const { user } = useAuth()
  const sendWhatsappMessage = useWhatsappSender(user)

  const form = props.form
  const logo = import.meta.env.ISI_LOGO_FULL
  const queryClient = useQueryClient()

  const [cart, setCart] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [additionalDiscount, setAdditionalDiscount] = useState<number>(0)
  const [giftCardAmount, setGiftCardAmount] = useState<number>(0)
  // eslint-disable-next-line no-unused-vars
  const [montoRecibido, setMontoRecibido] = useState<number>(0)
  const [selectedButtonTipoPedido, setSelectedButtonTipoPedido] = useState<string | null>(
    'C. Interno',
  )
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)

  const [openNuevoCliente, setNuevoCliente] = useState(false)
  const [openExplorarCliente, setExplorarCliente] = useState(false)
  const [openCliente99001, setCliente99001] = useState(false)

  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteProps | null>(
    null,
  )
  const [printDescuentoAdicional, setPrintDescuentoAdicional] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState('')

  const [deletedProducts, setDeletedProducts] = useState<
    { nroItem: number; fromDatabase: boolean }[]
  >([])

  const [openDialogCard, setOpenDialogCard] = useState(false)
  const [enviaDatos, setEnviaDatos] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [selectedView, setSelectedView] = useState<string>('')
  const [selectedUbicacion, setSelectedUbicacion] = useState<string | null>(null)
  const [dialogEspacioOpen, setDialogEspacioOpen] = useState(false)
  const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(
    localStorage.getItem('whatsappEnabled') === 'true',
  )

  const theme = useTheme()

  const [isCreatingNewClient, setIsCreatingNewClient] = useState(false)
  const fetchClientes = async (inputValue: string): Promise<ClienteProps[]> => {
    try {
      if (inputValue.length > 2) {
        const clientes = await apiClienteBusqueda(inputValue)
        if (clientes.length === 0) {
          return [
            {
              codigoCliente: '',
              razonSocial: isNaN(Number(inputValue)) ? inputValue : '',
              _id: '',
              apellidos: '',
              codigoExcepcion: 0,
              complemento: '',
              email: miEmpresa.emailFake,
              nombres: '',
              numeroDocumento: !isNaN(Number(inputValue)) ? inputValue : '',
              tipoDocumentoIdentidad: {
                codigoClasificador: 1,
                descripcion: 'CI - CEDULA DE IDENTIDAD',
              },
              state: 'REGISTRO',
              telefono: '',
              usucre: '',
              createdAt: '',
              usumod: '',
              updatedAt: '',
            },
          ]
        }
        setIsCreatingNewClient(false)
        return clientes
      }
      return []
    } catch (e: any) {
      swalException(e)
      return []
    }
  }

  // Declara una variable para almacenar la caché de imágenes
  const imageCache = {} as Record<string, string>

  // Dentro de tu función o componente
  const { data: articulosProd } = useQuery<ProductoProps[]>({
    queryKey: ['articulosListado'],
    queryFn: async () => {
      const entidad = {
        codigoSucursal: sucursal.codigo,
        codigoPuntoVenta: puntoVenta.codigo,
      }
      const { articuloEntidadInventarioListado } =
        await apiListadoPorInventarioEntidad(entidad)
      // Almacenar en caché las URL de las imágenes
      articuloEntidadInventarioListado.forEach((producto: any) => {
        const imageUrl = producto.imagen // Suponiendo que la URL de la imagen está en la propiedad 'imagen' del producto
        const codigoArticulo = producto.codigoArticulo
        imageCache[codigoArticulo] = imageUrl
      })
      return articuloEntidadInventarioListado
    },
    refetchOnWindowFocus: false,
  })

  const { data: espacios } = useQuery<any>({
    queryKey: ['espaciosListado'],
    queryFn: async () => {
      const entidad = {
        codigoSucursal: sucursal.codigo,
        codigoPuntoVenta: puntoVenta.codigo,
      }
      const data = await apiListadoEspacios(entidad)
      return data.restEspacioPorEntidad || []
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const categories = useMemo(() => {
    if (!articulosProd) return []

    const categorias: { name: string; products: Product[] }[] = []

    articulosProd.forEach((producto) => {
      const categoriaDescripcion = producto.tipoArticulo?.descripcion || 'Otros'
      const categoriaExistente = categorias.find(
        (categoria) => categoria.name === categoriaDescripcion,
      )

      const productData = {
        imagen: producto.imagen,
        sigla: producto.articuloPrecioBase.monedaPrimaria.moneda.sigla,
        codigoArticulo: producto.codigoArticulo,
        name: producto.nombreArticulo,
        price: producto.articuloPrecioBase.monedaPrimaria.precio,
        description: producto.descripcionArticulo,
        quantity: producto.inventario.reduce((total, inv) => total + inv.totalStock, 0),
        discount: producto.articuloPrecio.descuento,
        extraDescription: '',
        extraDetalle: producto.detalleExtra?.toString() || '',
        codigoAlmacen: '',
        codigoArticuloUnidadMedida:
          producto.articuloPrecioBase.articuloUnidadMedida.codigoUnidadMedida,
      }

      if (categoriaExistente) {
        categoriaExistente.products.push(productData)
      } else {
        categorias.push({
          name: categoriaDescripcion,
          products: [productData],
        })
      }

      // Agregar verificaciones adicionales para codigoAlmacen
      if (
        producto.inventario &&
        producto.inventario.length > 0 &&
        producto.inventario[0].detalle &&
        producto.inventario[0].detalle.length > 0 &&
        producto.inventario[0].detalle[0].almacen
      ) {
        productData.codigoAlmacen =
          producto.inventario[0].detalle[0].almacen.codigoAlmacen
      }
    })

    return categorias
  }, [articulosProd])

  const handleAddToCart = (product: Product) => {
    if (!selectedOption?.mesa) {
      toast.error('Debe seleccionar una mesa')
      return
    }

    const existingProduct = cart.find((p) => p.codigoArticulo === product.codigoArticulo)
    if (existingProduct) {
      setCart((prevCart) =>
        prevCart.map((p) =>
          p.codigoArticulo === product.codigoArticulo
            ? { ...p, quantity: p.quantity + 1 }
            : p,
        ),
      )
    } else {
      const maxNroItem = Math.max(...cart.map((p) => p.nroItem || 0), 0)
      const newItem = {
        ...product,
        quantity: 1,
        discount: 0,
        extraDescription: '',
        // Asigna el número de item como el máximo encontrado + 1
        nroItem: maxNroItem + 1,
      }

      setCart((prevCart) => [...prevCart, newItem])
    }
  }

  const handleRemoveFromCart = (index: number) => {
    setCart((prevCart) => {
      const removedItem = prevCart[index]

      // Agrega el nroItem y fromDatabase del elemento eliminado al estado deletedProducts
      //@ts-ignore
      setDeletedProducts((prevDeletedProducts) => [
        ...prevDeletedProducts,
        { nroItem: removedItem.nroItem, fromDatabase: removedItem.fromDatabase || false },
      ])

      return prevCart.filter((_, i) => i !== index)
    })
  }

  const handleQuantityChange = (index: number, action: string) => {
    const newQuantity =
      action === 'add' ? cart[index].quantity + 1 : cart[index].quantity - 1
    if (newQuantity >= 0) {
      setCart((prevCart) =>
        prevCart.map((item, i) =>
          i === index ? { ...item, quantity: newQuantity } : item,
        ),
      )
    }
  }

  const [discountTypes, setDiscountTypes] = useState(cart.map(() => false))

  const handleDiscountChange = (index: number, value: string, isPercentage: boolean) => {
    const product = cart[index]
    let numericValue = value === '' ? 0 : parseFloat(value)
    let actualDiscount = isPercentage
      ? (numericValue / 100) * product.price * product.quantity
      : numericValue

    if (actualDiscount > product.price * product.quantity) {
      toast.error('El descuento no puede ser mayor al precio total del producto')
      return
    }

    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index ? { ...item, discount: actualDiscount } : item,
      ),
    )
  }

  const handleBlur = (index: number, value: string) => {
    if (value === '' || isNaN(parseFloat(value))) {
      handleDiscountChange(index, '0', discountTypes[index])
    }
  }

  const toggleDiscountType = (index: number) => {
    setDiscountTypes((prevTypes) => {
      const newTypes = [...prevTypes]
      newTypes[index] = !newTypes[index]
      return newTypes
    })

    const product = cart[index]
    const currentDiscount = product.discount
    const price = product.price * product.quantity

    if (discountTypes[index]) {
      // Cambiando de porcentaje a BOB
      handleDiscountChange(index, currentDiscount.toString(), false)
    } else {
      // Cambiando de BOB a porcentaje
      handleDiscountChange(index, ((currentDiscount / price) * 100).toString(), true)
    }
  }

  const getDisplayValue = (product: Product, index: number) => {
    if (discountTypes[index]) {
      const percentage = (product.discount / (product.price * product.quantity)) * 100
      return percentage === 0 ? '' : (percentage as any)
    } else {
      return product.discount === 0 ? '' : product.discount.toString()
    }
  }

  const handleExtraDescriptionChange = (index: number, extraDescription: string) => {
    setCart((prevCart) =>
      prevCart.map((item, i) => (i === index ? { ...item, extraDescription } : item)),
    )
  }

  const subtotal = cart.reduce(
    (total, product) => total + product.price * product.quantity - product.discount,
    0,
  )

  const total = subtotal - additionalDiscount - giftCardAmount

  const { metodosPago } = useQueryMetodosPago()
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [otrosAnchorEl, setOtrosAnchorEl] = React.useState<HTMLDivElement | null>(null)

  const handleClick = (metodo: MetodoPagoProp) => () => {
    setSelectedId(metodo.codigoClasificador)
    setValue('metodoPago', metodo.codigoClasificador)
    setOtrosAnchorEl(null)

    // Abrir el diálogo de tarjeta si el código es 2 (tarjeta)
    if (metodo.codigoClasificador === 2) {
      setOpenDialogCard(true)
    }
  }

  const handleOtrosClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setOtrosAnchorEl(event.currentTarget)
  }

  const renderMetodoPago = (metodo: MetodoPagoProp) => {
    // Condicional para reemplazar el nombre si coincide con "DEBITO AUTOMATICO - TRANSFERENCIA BANCARIA"
    const descripcion =
      metodo.descripcion === 'DEBITO AUTOMATICO -  TRANSFERENCIA BANCARIA'
        ? 'QR'
        : metodo.descripcion

    console.log('descripcion', metodo.descripcion)
    return (
      <Tooltip title={descripcion}>
        <Grid item xs={3} key={metodo.codigoClasificador}>
          <MetodoPagoButton
            text={truncateName(descripcion, 10)} // Usar la descripción actualizada
            icon={React.createElement(
              ICONS[descripcion.toUpperCase() as keyof typeof ICONS] || Pix,
              { fontSize: 'small' },
            )}
            selected={selectedId === metodo.codigoClasificador}
            onClick={handleClick(metodo)}
          />
        </Grid>
      </Tooltip>
    )
  }

  const [tiposPedidos, setTiposPedidos] = useState<string | null>(null)
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false)
  const handleTipoPedidoButtonClick = (buttonText: string) => {
    setSelectedButtonTipoPedido(buttonText)
    let tipoPedido
    switch (buttonText) {
      case 'C. Interno':
        tipoPedido = null
        break
      case 'Para Llevar':
        tipoPedido = 'LLEVAR'
        break
      case 'Delivery':
        tipoPedido = 'DELIVERY'
        setOpenDeliveryDialog(true)
        break
      default:
        tipoPedido = buttonText.toUpperCase()
    }
    setValue('tipoPedido', tipoPedido)
    setTiposPedidos(tipoPedido)
  }

  const tiposPedido = ['C. Interno', 'Para Llevar', 'Delivery']

  const { data, refetch } = useQuery<any[]>({
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

  // FUNCIONES PARA MESAS

  // Genera un arreglo de mesas basado en el número proporcionado
  const generarMesas = (nroMesas: number, descripcion: string) => {
    const mesas = [] as string[]
    for (let i = 1; i <= nroMesas; i++) {
      mesas.push(descripcion ? `${descripcion} ${i}` : `${i}`)
    }
    return mesas
  }

  // Obtener la ubicación seleccionada del localStorage
  const ubicacionSeleccionada = JSON.parse(localStorage.getItem('ubicacion') || '{}')

  // Descripción de la ubicación y número de mesas
  const descripcion = ubicacionSeleccionada?.descripcion || ''
  const nroMesas = ubicacionSeleccionada?.nroMesas || 50

  const options = useMemo(() => {
    const result: {
      value: number
      nroPedido: number | null
      nroOrden: number | null
      mesa: string
      state: string
      cliente: ClienteProps | null
      tipoPedido: string | null
    }[] = []

    const seenValues = new Set<string>()
    const mesas = generarMesas(nroMesas, descripcion)

    mesas.forEach((mesa) => {
      const mesaNumber = Number(mesa.split(' ').pop())

      const pedidoEncontrado = data?.find((pedido) => {
        return (
          pedido.mesa.nombre === mesa &&
          !['FINALIZADO', 'FACTURADO', 'ANULADO'].includes(pedido.state.toUpperCase())
        )
      })

      if (pedidoEncontrado) {
        const { numeroPedido, numeroOrden, mesa: mesaPedido, state } = pedidoEncontrado
        if (!seenValues.has(mesa)) {
          result.push({
            value: mesaNumber,
            nroPedido: numeroPedido,
            nroOrden: numeroOrden,
            mesa: mesaPedido.nombre,
            state,
            cliente: pedidoEncontrado.cliente || null,
            tipoPedido: pedidoEncontrado.tipo || null,
          })
          seenValues.add(mesa)
        }
      } else {
        if (!seenValues.has(mesa)) {
          result.push({
            value: mesaNumber,
            nroPedido: null,
            nroOrden: null,
            mesa,
            state: 'Libre',
            cliente: null,
            tipoPedido: null,
          })
          seenValues.add(mesa)
        }
      }
    })

    // Asegurarse de que todas las mesas estén presentes
    mesas.forEach((mesa, index) => {
      if (!seenValues.has(mesa)) {
        result.push({
          value: index + 1,
          nroPedido: null,
          nroOrden: null,
          mesa,
          state: 'Libre',
          cliente: null,
          tipoPedido: null,
        })
      }
    })

    // Ordenar los resultados por el valor
    result.sort((a, b) => a.value - b.value)

    return result
  }, [data, espacios, ubicacionSeleccionada])

  const [itemEliminados, setItemEliminados] = useState([] as any)
  const [dataDelivery, setDataDelivery] = useState<any>(null)

  useEffect(() => {
    const updateCart = () => {
      if (selectedOption?.nroPedido) {
        const pedidoEncontrado = data?.find(
          (pedido) => pedido.numeroPedido === selectedOption.nroPedido,
        )
        setClienteSeleccionado(pedidoEncontrado?.cliente || null)
        // si el cliente es null llamamos a cliente por defecto
        setValue('cliente', pedidoEncontrado?.cliente || null)
        setValue('emailCliente', pedidoEncontrado?.cliente?.email || '')
        setValue('razonSocial', pedidoEncontrado?.cliente?.razonSocial || '')
        setValue('telefono', pedidoEncontrado?.cliente?.telefono || '')
        setItemEliminados(pedidoEncontrado?.productosEliminados || [])

        // obtenemos el tipo para el pedido y marcamos automaticamente los botones
        const tipoPedido = pedidoEncontrado?.tipo || null
        const tipoPedidoButton =
          tipoPedido === null
            ? 'C. Interno'
            : tipoPedido === 'LLEVAR'
              ? 'Para Llevar'
              : tipoPedido === 'DELIVERY'
                ? 'Delivery'
                : tipoPedido || 'C. Interno'
        handleTipoPedidoButtonClick(tipoPedidoButton)

        if (pedidoEncontrado && pedidoEncontrado.productos) {
          setItemEliminados(pedidoEncontrado?.productosEliminados || [])
          const delivery = {
            atributo1: pedidoEncontrado.atributo1,
            atributo2: pedidoEncontrado.atributo2,
            atributo3: pedidoEncontrado.atributo3,
            atributo4: pedidoEncontrado.atributo4,
            direccionEntrega: pedidoEncontrado.direccionEntrega,
            fechaEntrega: pedidoEncontrado.fechaEntrega,
            terminos: pedidoEncontrado.terminos,
            fromDatabase: true,
          }
          setDataDelivery(delivery)

          // const codigoAlmacen = producto.almacen ? producto.almacen.codigoAlmacen : null
          const mappedProducts: Product[] = pedidoEncontrado.productos.map(
            (producto: any): Product => ({
              imagen: '',
              sigla: producto.articuloPrecio.monedaPrecio.moneda.sigla,
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
            }),
          )
          setCart(mappedProducts)
        } else {
          setDataDelivery(null)
          console.error('No se encontró el pedido')
          setCart([])
        }
      } else {
        setCart([])
        setDataDelivery(null)
        handleTipoPedidoButtonClick('C. Interno')
      }
    }
    updateCart()
  }, [selectedOption, data])

  // useefct para  selectCategoria
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].name)
    }
  }, [categories, selectedCategory])

  useEffect(() => {
    if (metodosPago && metodosPago.length > 0) {
      const efectivoMetodo = metodosPago.find(
        (metodo) => metodo.descripcion.toUpperCase() === 'EFECTIVO',
      )
      if (efectivoMetodo) {
        setSelectedId(efectivoMetodo.codigoClasificador)
        setValue('metodoPago', efectivoMetodo.codigoClasificador)
      }
    }
  }, [metodosPago])

  const registrarPedido = () => {
    restPedidoExpressRegistro(
      cart,
      puntoVenta,
      sucursal,
      selectedOption?.mesa || '',
      () => {
        setCart([])
        refetch()
      },
      tiposPedidos,
      clienteSeleccionado || null,
      getValues(),
      isCreatingNewClient,
    )
      .then(async (response) => {
        if (response.restPedidoExpressRegistro) {
          const { numeroPedido, numeroOrden, mesa, state } =
            response.restPedidoExpressRegistro
          setPermitirSeleccionMultiple(false)
          // const numberValue = Number(mesa.nombre.split('-')[0]) -> Funconn si hay mesas unidas , sirve para separarlas, la logica es la misma, te explico tnemeos una variable mesa que es un string, la cual tiene el valor de "1-2-3" y queremos obtener el valor de 1, entonces usamos el metodo split que nos devuelve un array con los valores separados por el guion, en este caso [1,2,3] y luego accedemos al primer valor con el indice 0
          // const numberValue = mesa.nombre.split('-')[0] || mesa.nombre
          const numberValue =
            Number(mesa.nombre.split('-')[0]) || Number(mesa.nombre.split(' ').pop())
          setSelectedOption({
            value: numberValue,
            nroPedido: numeroPedido,
            nroOrden: numeroOrden,
            mesa: mesa.nombre,
            state,
          })
          setMesasSeleccionadas([
            {
              value: numberValue,
              nroPedido: numeroPedido,
              nroOrden: numeroOrden,
              mesa: mesa.nombre,
              state,
            },
          ])

          // Leer la configuración de impresión automática del local storage
          const printerSettings = JSON.parse(localStorage.getItem('printers') || '{}')
          const impresionAutomatica = printerSettings.impresionAutomatica || {}

          // Si la impresión automática de comanda está activada, generar e imprimir la comanda
          if (impresionAutomatica.comanda) {
            generarComandaPDF(
              cart,
              usuario,
              selectedOption?.value?.toString(),
              numeroOrden.toString(),
              itemEliminados,
              tiposPedidos,
              clienteSeleccionado,
            )
          }
          setIsCreatingNewClient(false)
          eliminarCliente()
        }
      })
      .catch((error) => {
        console.error('Error al registrar el pedido:', error)
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al registrar el pedido',
          icon: 'error',
        })
      })
  }

  const actualizarPedido = async () => {
    if (!selectedOption?.nroPedido) {
      toast.error('No se puede actualizar un pedido sin número de pedido')
      return
    }

    try {
      let productosEliminados = itemEliminados // Usar itemEliminados por defecto

      // Actualizar items del pedido
      const responseActualizar = await actualizarItemPedido(
        puntoVenta,
        sucursal,
        Number(selectedOption.nroPedido),
        deletedProducts,
        cart,
      )

      let { numeroPedido, numeroOrden, mesa, state } =
        //@ts-ignore
        responseActualizar.restPedidoActualizarItem

      const value = mesa.nombre.split(' ').pop()

      let updatedOption = {
        value: Number(value),
        nroPedido: numeroPedido,
        nroOrden: numeroOrden,
        mesa: mesa.nombre,
        state,
      }

      // Verificar si hay productos nuevos en el carrito
      const hasNonDatabaseProduct = cart.some((producto) => !producto.fromDatabase)

      if (hasNonDatabaseProduct) {
        // Adicionar items nuevos al pedido
        const responseAdicionar = await adicionarItemPedido(
          puntoVenta,
          sucursal,
          Number(selectedOption.nroPedido),
          deletedProducts,
          cart,
        )

        ;({ numeroPedido, numeroOrden, mesa, state } =
          //@ts-ignore
          responseAdicionar.restPedidoAdicionarItem)

        const value = mesa.nombre.split(' ').pop()

        updatedOption = {
          value: Number(value),
          nroPedido: numeroPedido,
          nroOrden: numeroOrden,
          mesa: mesa.nombre,
          state,
        }
      }

      // Si hay productos eliminados, eliminarlos del pedido
      if (deletedProducts.length > 0) {
        const responseEliminar = await eliminarPedido(
          puntoVenta,
          sucursal,
          Number(selectedOption.nroPedido),
          deletedProducts,
        )

        ;({ numeroPedido, numeroOrden, mesa, state, productosEliminados } =
          responseEliminar.restPedidoEliminarItem)

        const value = mesa.nombre.split(' ').pop()

        updatedOption = {
          value: Number(value),
          nroPedido: numeroPedido,
          nroOrden: numeroOrden,
          mesa: mesa.nombre,
          state,
        }
      }

      // Actualizar el estado con los nuevos datos
      setSelectedOption(updatedOption)
      setMesasSeleccionadas([updatedOption])
      setDeletedProducts([])
      setItemEliminados(productosEliminados)

      // Verificar si la impresión automática está activada
      const printerSettings = JSON.parse(localStorage.getItem('printers') || '{}')
      const impresionAutomatica = printerSettings.impresionAutomatica || {}

      // Imprimir la comanda solo si la impresión automática está activada
      if (impresionAutomatica.comanda) {
        generarComandaPDF(
          cart,
          usuario,
          updatedOption.value.toString(),
          updatedOption.nroOrden.toString(),
          productosEliminados,
          tiposPedidos,
          clienteSeleccionado,
        )
      }
    } catch (error) {
      console.error('Error al actualizar el pedido:', error)
    } finally {
      refetch()
    }
  }

  const finalizarOrden = () => {
    const tarjetaId =
      metodosPago?.find((m) => m.descripcion.toUpperCase() === 'TARJETA')
        ?.codigoClasificador ?? 2

    if (
      selectedId === tarjetaId &&
      (getValues('numeroTarjeta') === '' ||
        getValues('numeroTarjeta') === null ||
        getValues('numeroTarjeta') === undefined)
    ) {
      toast.error('Debe ingresar el número de tarjeta')
      return
    }

    finalizarPedido(
      getValues(),
      puntoVenta,
      sucursal,
      selectedOption?.nroPedido ? Number(selectedOption.nroPedido) : undefined,
      additionalDiscount,
      refetch,
      isCreatingNewClient,
    )
      .then(async (response) => {
        if (response.restPedidoFinalizar) {
          const { mesa } = response.restPedidoFinalizar
          const mesaNombre = mesa.nombre.split('-')[0]
          const NumberValue = Number(mesa.nombre.split(' ').pop())

          setSelectedOption({
            value: NumberValue,
            nroPedido: null,
            nroOrden: null,
            mesa: mesaNombre,
            state: 'Libre',
          })

          setMesasSeleccionadas([
            {
              value: NumberValue,
              nroPedido: null,
              nroOrden: null,
              mesa: mesaNombre,
              state: 'Libre',
            },
          ])

          eliminarCliente()
          setIsCreatingNewClient(false)
          setValue('cliente', null)
          const efectivoId =
            metodosPago?.find((m) => m.descripcion.toUpperCase() === 'EFECTIVO')
              ?.codigoClasificador ?? 1
          setSelectedId(efectivoId)
          setValue('metodoPago', efectivoId)
          setValue('numeroTarjeta', '')
          setEnviaDatos(true)
          setSelectedCategory(categories[0].name || null)

          // Leer la configuración de impresión automática del local storage
          const printerSettings = JSON.parse(localStorage.getItem('printers') || '{}')
          const impresionAutomatica = printerSettings.impresionAutomatica || {}

          // Si la impresión automática de estado de cuenta está activada, generar e imprimir el recibo
          if (impresionAutomatica.estadoDeCuenta) {
            generarReciboPDF(
              cart,
              usuario,
              total,
              selectedOption?.value?.toString(),
              selectedOption?.nroOrden?.toString(),
              printDescuentoAdicional.toString(),
            )
          }
        }
      })
      .catch((error) => {
        console.error('Error al finalizar el pedido:', error)
      })
  }

  const eliminarCliente = () => {
    setValue('cliente', null)
    setValue('emailCliente', '')
    setValue('razonSocial', '')
    setValue('numeroDocumento', '')
    setValue('sinTipoDocumento', null)
    setValue('complemento', '')
    setValue('telefono', '')
  }

  const handleFacturar = () => {
    if (clienteSeleccionado === null || clienteSeleccionado === undefined) {
      toast.error('Debe seleccionar un cliente')
      return
    }
    // Mnesjae de mesa no seleccionada
    if (selectedOption === null) {
      toast.error('Debe seleccionar una mesa')
      return
    }
    const tarjetaId =
      metodosPago?.find((m) => m.descripcion.toUpperCase() === 'TARJETA')
        ?.codigoClasificador ?? 2

    if (
      selectedId === tarjetaId &&
      (getValues('numeroTarjeta') === '' ||
        getValues('numeroTarjeta') === null ||
        getValues('numeroTarjeta') === undefined)
    ) {
      toast.error('Debe ingresar el número de tarjeta')
      return
    }

    finalizarPedido(
      getValues(),
      puntoVenta,
      sucursal,
      // @ts-ignore
      selectedOption?.nroPedido ?? 0,
      additionalDiscount,
      refetch,
      isCreatingNewClient,
      true,
    )
      .then((response) => {
        if (response.restPedidoFinalizar) {
          const { numeroPedido, mesa } = response.restPedidoFinalizar
          const value = Number(mesa.nombre.split(' ').pop())
          setSelectedOption({
            value,
            nroPedido: null,
            nroOrden: null,
            mesa: mesa.nombre,
            state: 'Libre',
          })
          setMesasSeleccionadas([
            {
              value,
              nroPedido: null,
              nroOrden: null,
              mesa: mesa.nombre,
              state: 'Libre',
            },
          ])
          setSelectedCategory(categories[0].name || null)

          // Aquí llamamos a facturarPedido dentro del then de finalizarPedido
          facturarPedido(
            getValues(),
            puntoVenta,
            sucursal,
            numeroPedido,
            usuario,
            refetch,
          )
            .then(async (response) => {
              if (response) {
                setIsCreatingNewClient(false)
                //@ts-ignore
                const { representacionGrafica, numeroFactura, createdAt, cliente } =
                  response.factura

                // Leer la configuración de impresión automática del local storage
                const printerSettings = JSON.parse(
                  localStorage.getItem('printers') || '{}',
                )
                const impresionAutomatica = printerSettings.impresionAutomatica || {}

                if (impresionAutomatica.facturar) {
                  if (tipoRepresentacionGrafica === 'pdf') {
                    printJS(representacionGrafica.pdf)
                  } else if (tipoRepresentacionGrafica === 'rollo') {
                    const pdfUrl = representacionGrafica.rollo
                    const selectedPrinter = printerSettings.facturar || ''

                    if (selectedPrinter) {
                      fetch('http://localhost:7777/printPDF', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          pdf_url: pdfUrl,
                          printer: selectedPrinter,
                        }),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          if (data.message) {
                            toast.success('Impresión iniciada')
                          } else {
                            toast.error('Error al iniciar la impresión')
                          }
                        })
                        .catch((error) => {
                          console.error('Error al imprimir el PDF:', error)
                          toast.error('Error al imprimir el PDF')
                        })
                    } else {
                      printJS({
                        printable: pdfUrl,
                        type: 'pdf',
                        style:
                          '@media print { @page { size: 100%; margin: 0mm; } body { width: 100%; } }',
                      })
                    }
                  }
                }

                Swal.fire({
                  title: 'Pedido Facturado',
                  text: 'El pedido ha sido facturado con éxito',
                  icon: 'success',
                })

                const efectivoId =
                  metodosPago?.find((m) => m.descripcion.toUpperCase() === 'EFECTIVO')
                    ?.codigoClasificador ?? 1
                setSelectedId(efectivoId)
                setValue('metodoPago', efectivoId)
                setEnviaDatos(true)

                if (whatsappEnabled) {
                  const mensaje = `Estimado Sr(a) ${cliente?.razonSocial || ''},\n\nSe ha generado el presente documento fiscal de acuerdo al siguiente detalle:\n\n*FACTURA COMPRA/VENTA*\n\n*Razón Social:* ${cliente?.razonSocial || ''}\n*NIT/CI/CEX:* ${clienteSeleccionado?.codigoCliente || ''}\n*Número Factura:* ${numeroFactura}\n*Fecha Emisión:* ${createdAt}\n\nSi recibiste este mensaje por error o tienes alguna consulta acerca de su contenido, por favor comunícate con el remitente.\n\nAgradecemos tu preferencia.\n\nPara descargar el archivo XML de tu documento fiscal, haz clic en este link: ${representacionGrafica.xml}`

                  const telefono = cliente.telefono || ''
                  const documentUrl = representacionGrafica.pdf
                  const documentFileName = 'Factura.pdf'

                  if (telefono) {
                    try {
                      await sendWhatsappMessage(
                        telefono,
                        mensaje,
                        documentUrl,
                        documentFileName,
                      )
                      console.log('Mensaje de WhatsApp enviado con éxito')
                    } catch (error) {
                      console.error('Error al enviar mensaje de WhatsApp:', error)
                    }
                  } else {
                    console.error('Número de teléfono no disponible')
                  }
                }
              }

              const efectivoId =
                metodosPago?.find((m) => m.descripcion.toUpperCase() === 'EFECTIVO')
                  ?.codigoClasificador ?? 1
              setSelectedId(efectivoId)
              setValue('metodoPago', efectivoId)
              setValue('numeroTarjeta', '')
            })
            .catch((error) => {
              console.error('Error al facturar el pedido:', error)
            })
        }
      })
      .catch((error) => {
        console.error('Error al finalizar el pedido:', error)
      })
  }

  const handleRegisterAndFinalize = async () => {
    // toast q se necesita seleccionar una mesa y cliente
    if (clienteSeleccionado === null || clienteSeleccionado === undefined) {
      toast.error('Debe seleccionar un cliente')
      return
    }
    if (selectedOption === null) {
      toast.error('Debe seleccionar una mesa')
      return
    }
    const tarjetaId =
      metodosPago?.find((m) => m.descripcion.toUpperCase() === 'TARJETA')
        ?.codigoClasificador ?? 2

    if (
      selectedId === tarjetaId &&
      (getValues('numeroTarjeta') === '' ||
        getValues('numeroTarjeta') === null ||
        getValues('numeroTarjeta') === undefined)
    ) {
      toast.error('Debe ingresar el número de tarjeta')
      return
    }

    restPedidoExpressRegistro(
      cart,
      puntoVenta,
      sucursal,
      selectedOption?.mesa || '',
      () => {
        setCart([])
        refetch()
      },
      tiposPedidos,
      clienteSeleccionado || null,
      getValues(),
      isCreatingNewClient,
    )
      .then((response) => {
        if (response.restPedidoExpressRegistro) {
          const { numeroPedido, numeroOrden, mesa, state } =
            response.restPedidoExpressRegistro

          const value = Number(mesa.nombre.split(' ').pop())
          setSelectedOption({
            value,
            nroPedido: numeroPedido,
            nroOrden: numeroOrden,
            mesa: mesa.nombre,
            state,
          })
          finalizarPedido(
            getValues(),
            puntoVenta,
            sucursal,
            numeroPedido,
            additionalDiscount,
            refetch,
            false,
            false,
          )
            .then((response) => {
              if (response.restPedidoFinalizar) {
                const { mesa } = response.restPedidoFinalizar
                setSelectedOption({
                  value,
                  nroPedido: null,
                  nroOrden: null,
                  mesa: mesa.nombre,
                  state: 'Libre',
                })
                eliminarCliente()
                setIsCreatingNewClient(false)
                const efectivoId =
                  metodosPago?.find((m) => m.descripcion.toUpperCase() === 'EFECTIVO')
                    ?.codigoClasificador ?? 1
                setSelectedId(efectivoId)
                setValue('metodoPago', efectivoId)
                setValue('numeroTarjeta', '')
                setEnviaDatos(true)
                setSelectedCategory(categories[0].name || null)
              }
              const printerSettings = JSON.parse(localStorage.getItem('printers') || '{}')
              const impresionAutomatica = printerSettings.impresionAutomatica || {}
              if (impresionAutomatica.comanda) {
                generarComandaPDF(
                  cart,
                  usuario,
                  mesa.nombre,
                  numeroOrden.toString(),
                  itemEliminados,
                  tiposPedidos,
                  clienteSeleccionado,
                )
              }
              setSelectedCategory(categories[0].name || null)
            })
            .catch((error) => {
              console.error('Error al finalizar el pedido:', error)
            })
        }
      })
      .catch((error) => {
        console.error('Error al registrar el pedido:', error)
      })
  }

  const eliminarTodoPedido = () => {
    eliminarPedidoTodo(
      puntoVenta,
      sucursal,
      selectedOption?.nroPedido ? Number(selectedOption.nroPedido) : 0,
      () => {
        setCart([])
        refetch()
      },
    )
  }

  useEffect(() => {
    const clienteSeleccionado = getValues('cliente')
    setClienteSeleccionado(clienteSeleccionado)
  }, [watch('cliente')])

  useEffect(() => {
    setPrintDescuentoAdicional(additionalDiscount)
  }, [additionalDiscount])

  useEffect(() => {
    setDeletedProducts([])
    setAdditionalDiscount(0)
    // setInputValues([])
    // setDiscountTypes([])
    setGiftCardAmount(0)
    setMontoRecibido(0)
    // setNuevoCliente(false)
    setIsCreatingNewClient(false)
    setEnviaDatos((prevState) => !prevState)
    // cambiamos el tipo a null

    if (selectedOption?.state === 'Libre') {
      setValue('tipoPedido', null)
      setItemEliminados([])
    }
  }, [selectedOption])

  const IMG = styled('img')(() => ({
    width: '100%',
    // maxHeight: '90px',
  }))

  useEffect(() => {
    const savedView = localStorage.getItem('selectedView')
    if (savedView) {
      setSelectedView(savedView)
    }

    const enabled = localStorage.getItem('whatsappEnabled') === 'true'
    setWhatsappEnabled(enabled)

    const savedUbicacion = localStorage.getItem('ubicacion')
    if (savedUbicacion) {
      const x = JSON.parse(savedUbicacion)
      setSelectedUbicacion(x.descripcion)
    } else {
      setSelectedUbicacion(null)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('selectedView', selectedView)
  }, [selectedView])

  useEffect(() => {
    const setClientePorDefecto = async () => {
      const clientePorDefecto = {
        codigoCliente: '00',
        apellidos: 'Sin Apellidos',
        complemento: null,
        numeroDocumento: '00',
        razonSocial: 'Sin Razón Social',
        state: 'ELABORADO',
        nombres: 'Sin Nombre',
        email: miEmpresa.emailFake,
        tipoDocumentoIdentidad: {
          codigoClasificador: '1',
          descripcion: 'CI - CEDULA DE IDENTIDAD',
        },
        telefono: '',
      }
      if (clientePorDefecto) {
        setValue('cliente', clientePorDefecto)
        setValue('emailCliente', genReplaceEmpty(clientePorDefecto.email, ''))
        setValue('razonSocial', genReplaceEmpty(clientePorDefecto.razonSocial, ''))
        setValue('telefono', genReplaceEmpty(clientePorDefecto.telefono, ''))
      }
    }

    if (selectedOption?.state === 'Libre') {
      setClientePorDefecto()
    }
  }, [selectedOption])

  /**
   * Función para manejar el cambio de precio de un producto
   * @param index Índice del producto en el carrito
   * @param arg1  Nuevo precio del producto
   */

  const handlePriceChange = (index: number, arg1: number) => {
    const newPrice = arg1
    setCart((prevCart) =>
      prevCart.map((item, i) => (i === index ? { ...item, price: newPrice } : item)),
    )
  }
  const [mesasSeleccionadas, setMesasSeleccionadas] = useState<Option[]>([])
  const [permitirSeleccionMultiple, setPermitirSeleccionMultiple] =
    useState<boolean>(false)

  const manejarPresionTecla = (evento: React.KeyboardEvent<HTMLDivElement>) => {
    if ((evento.metaKey || evento.ctrlKey) && evento.key !== 'Control') {
      setPermitirSeleccionMultiple((prevState) => !prevState)
    }
  }

  const manejarCambioSeleccion = (opcionesSeleccionadas: Option | Option[] | null) => {
    const mesasSeleccionadas = opcionesSeleccionadas
      ? Array.isArray(opcionesSeleccionadas)
        ? opcionesSeleccionadas
        : [opcionesSeleccionadas]
      : []

    const mesasLibresSeleccionadas = permitirSeleccionMultiple
      ? mesasSeleccionadas.filter((opcion) => opcion.state === 'Libre')
      : mesasSeleccionadas

    if (permitirSeleccionMultiple) {
      setMesasSeleccionadas(mesasLibresSeleccionadas)
      setSelectedOption(mesasLibresSeleccionadas[0])

      let newMesasSeleccionadas = [] as string[]
      mesasLibresSeleccionadas.forEach((mesa) => {
        newMesasSeleccionadas.push(mesa.value.toString())
      })

      let mesasCombinadas = {
        // value: newMesasSeleccionadas.join('-'),
        value: Number(newMesasSeleccionadas[0]),
        nroPedido: null,
        nroOrden: null,
        mesa: newMesasSeleccionadas.join('-'),
        state: 'Libre',
      }
      setSelectedOption(mesasCombinadas)
    } else {
      setMesasSeleccionadas(mesasLibresSeleccionadas)
      setSelectedOption(mesasLibresSeleccionadas[0])
    }
  }

  const truncateName = (name: string, maxLength: number) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...'
    }
    return name
  }

  function toCamelCase(str: string) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const { tiposDocumentoIdentidad, tdiLoading } = useQueryTipoDocumentoIdentidad()
  const [isCheckedExecpcion, setIsCheckedExecpcion] = useState(false)
  const [currentEspacio, setCurrentEspacio] = useState(null)
  useEffect(() => {
    setValue('codigoExcepcion', 0)
  }, [])

  const handleOpenUbicacionEditar = () => {
    const ubicacionStr = localStorage.getItem('ubicacion')
    if (ubicacionStr) {
      const ubicacion = JSON.parse(ubicacionStr)
      setCurrentEspacio(ubicacion)
    }
    setDialogEspacioOpen(true)
  }

  const handleOpenUbicacionCrear = () => {
    setCurrentEspacio(null)
    setDialogEspacioOpen(true)
    setAnchorEl(null)
  }

  const TotalBox = styled(Box)(({ theme }) => ({
    position: 'sticky',
    bottom: 0,
    backgroundColor: '#f3f3f3',
    color: 'white',
    zIndex: 1000,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: '12px 12px 0 0', // Bordes redondeados en la parte superior
    transition: 'background-color 0.3s, color 0.3s',
    // sombra ancha
    boxShadow: '0px -15px 10px -10px rgba(0,0,0,0.1)',
    // contorno en la parte superior
    borderTop: '1px solid rgba(0,0,0,0.1)',

    '&:hover': {
      backgroundColor: '#f9f9f9',
      color: 'white',
    },
  }))

  function getColorSuffix(hexColor: any, adjustment: { r: any; g: any; b: any }) {
    // const adjustment = { r: 186 - 0, g: 225 - 87, b: 187 - 82 }
    // Convertir el color hexadecimal a valores RGB
    let r = parseInt(hexColor.slice(1, 3), 16)
    let g = parseInt(hexColor.slice(3, 5), 16)
    let b = parseInt(hexColor.slice(5, 7), 16)

    // Ajustar el brillo y la saturación del color
    r = Math.min(255, Math.max(0, r + adjustment.r))
    g = Math.min(255, Math.max(0, g + adjustment.g))
    b = Math.min(255, Math.max(0, b + adjustment.b))

    // Convertir los componentes a hexadecimal y concatenar
    return `#${r.toString(16).padStart(2, '0').toUpperCase()}${g.toString(16).padStart(2, '0').toUpperCase()}${b.toString(16).padStart(2, '0').toUpperCase()}`
  }

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  console.log('options', options)

  return (
    <Grid container spacing={1}>
      {selectedView === 'mosaico' ? (
        <div style={{ overflowX: 'auto', padding: '1px' }}>
          <div style={{ display: 'flex' }}>
            {options.map((option, index) => (
              <div key={index} style={{ marginRight: '8px' }}>
                <Card
                  sx={{
                    width: 110,
                    height: 75,
                    // backgroundColor: option.state === 'Libre' ? theme.palette.primary.main : '#EF9999',
                    backgroundColor:
                      option.state === 'Libre'
                        ? getColorSuffix(theme.palette.primary.main, {
                            r: 186 - 0,
                            g: 225 - 87,
                            b: 187 - 82,
                          })
                        : '#EF9999',
                    // backgroundColor: getBackgroundColor(
                    //   theme.palette.primary.main,
                    //   option.state,
                    // ),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative', // Needed to osition the top line
                    // Change background color on hover
                    '&:hover': {
                      backgroundColor:
                        option.state === 'Libre'
                          ? getColorSuffix(theme.palette.primary.main, {
                              r: 140 - 5,
                              g: 207 - 87,
                              b: 155 - 82,
                            })
                          : '#E57373',
                    },
                    overflow: 'hidden',
                  }}
                  onClick={() => setSelectedOption(option)}
                >
                  {/* Add a yellow line at the top if option.state is "DELIVERY" */}
                  {option.tipoPedido === 'DELIVERY' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: '#F4E790',
                        color: '#333',
                        padding: '2px 5px',
                        fontSize: '0.7rem',
                        transform: 'rotate(45deg) translate(15%, -50%)',
                      }}
                    >
                      DELIVERY
                    </div>
                  )}

                  {/* Add a green line at the top if option.state is "PARA LLEVAR" */}
                  {option.tipoPedido === 'LLEVAR' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: '#C2F490',
                        color: '#333',
                        padding: '2px 5px',
                        fontSize: '0.7rem',
                        transform: 'rotate(-45deg) translate(-15%, -50%)',
                      }}
                    >
                      LLEVAR
                    </div>
                  )}
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6" component="h2">
                        {`M.: ${option.value}`}
                      </Typography>
                    </div>
                    {option.nroOrden && (
                      <Tooltip
                        title={
                          option.cliente ? toCamelCase(option.cliente.razonSocial) : ''
                        }
                        placement="top"
                        key="tooltip"
                      >
                        <Typography color="textSecondary">
                          {`Ped.: ${option.nroOrden}`}
                          <br />
                          <span>
                            {option.cliente
                              ? truncateName(toCamelCase(option.cliente.razonSocial), 7)
                              : ''}
                          </span>
                        </Typography>
                      </Tooltip>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}

      <Grid item xs={12} md={6} lg={8}>
        <Grid container spacing={2} paddingBottom={2} sx={{ userSelect: 'none' }}>
          <Grid item xs={7}>
            <Typography variant="h4">Categorías</Typography>
          </Grid>
          <Grid item xs={5} container alignItems="center">
            <Grid item xs={11}>
              <FormTextField
                label="Buscar Producto por Nombre"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                margin="normal"
                style={{ width: '100%' }}
                InputProps={{ endAdornment: <Search /> }}
              />
            </Grid>
            <Grid item xs={1} container justifyContent="flex-end">
              <IconButton
                style={{
                  padding: '0px',
                  color: 'primary.main',
                  backgroundColor: 'transparent',
                }}
                aria-label="more"
                aria-controls="submenu"
                aria-haspopup="true"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                size="large"
              >
                <MoreVert />
              </IconButton>
              <Menu
                id="submenu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClick={(event) => {
                  const selectedOption = (event.target as HTMLElement).textContent
                  if (selectedOption === 'Vista mosaico') {
                    setSelectedView('mosaico')
                  } else if (selectedOption === 'Vista en lista') {
                    setSelectedView('lista')
                  }
                  setAnchorEl(null)
                }}
              >
                <MenuItem
                  onClick={() => setSelectedView('mosaico')}
                  selected={selectedView === 'mosaico'}
                >
                  <ListItemIcon>
                    <ViewModule fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="inherit">Vista mosaico</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => setSelectedView('lista')}
                  selected={selectedView === 'lista'}
                >
                  <ListItemIcon>
                    <ViewList fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="inherit">Vista en lista</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    localStorage.removeItem('ubicacion')
                    setSelectedUbicacion(null)
                    setAnchorEl(null)
                  }}
                  selected={selectedUbicacion === null}
                >
                  <ListItemIcon>
                    <Home fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="inherit">Salón principal</Typography>
                </MenuItem>
                {espacios &&
                  espacios.map((espacio: any) => (
                    <MenuItem
                      key={espacio._id}
                      onClick={() => {
                        localStorage.setItem('ubicacion', JSON.stringify(espacio))
                        setSelectedUbicacion(espacio.descripcion)
                        setAnchorEl(null)
                      }}
                      selected={selectedUbicacion === espacio.descripcion}
                    >
                      <ListItemIcon>
                        <Room fontSize="small" />
                      </ListItemIcon>
                      <Typography variant="inherit">{espacio.descripcion}</Typography>
                    </MenuItem>
                  ))}
                <Divider />
                <MenuItem onClick={handleOpenUbicacionCrear}>
                  <ListItemIcon>
                    <Add fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="inherit">Crear nuevo</Typography>
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
          sx={{
            mb: 2,
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            overflowX: isMobile ? 'auto' : 'initial',
            '&::-webkit-scrollbar': {
              height: isMobile ? '8px' : 0,
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.primary.main,
              borderRadius: '8px',
            },
            backgroundColor: 'F3F3F3',
          }}
        >
          {categories.length === 0
            ? [1, 2, 3, 4, 5, 6].map((item) => (
                <Grid key={item} item xs={6} sm={4} md={3} sx={{ userSelect: 'none' }}>
                  <Skeleton variant="rectangular" height={60} animation="wave" />
                </Grid>
              ))
            : categories.map((category) => (
                <Grid
                  item
                  key={category.name}
                  xs={6}
                  sm={4}
                  md={3}
                  lg={2}
                  sx={{ userSelect: 'none' }}
                >
                  <Card
                    elevation={3}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor:
                        selectedCategory === category.name
                          ? theme.palette.primary.main
                          : theme.palette.common.white,
                      color:
                        selectedCategory === category.name ? 'common.white' : 'inherit',
                      '&:hover': {
                        backgroundColor:
                          selectedCategory === category.name
                            ? theme.palette.primary.dark
                            : theme.palette.action.hover,
                      },
                    }}
                    onClick={() => {
                      setSelectedCategory(category.name)
                    }}
                  >
                    <Tooltip
                      title={category.name}
                      placement="top"
                      disableFocusListener
                      disableTouchListener
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {truncateName(category.name, 15)}
                      </Typography>
                    </Tooltip>
                  </Card>
                </Grid>
              ))}
        </Grid>

        <Divider />
        <Grid container spacing={2} sx={{ mt: 2, position: 'relative' }}>
          {!selectedCategory ? (
            <IMG
              src={logo}
              alt="Logo"
              style={{
                opacity: 0.2,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 'auto',
                maxWidth: '50%',
                maxHeight: '50%',
              }}
            />
          ) : (
            categories
              .find((category) => category.name === selectedCategory)
              ?.products.map((product) => (
                <Grid
                  item
                  key={product.codigoArticulo}
                  xs={6}
                  sm={3}
                  md={2}
                  sx={{ userSelect: 'none', textAlign: 'center' }}
                >
                  <Card
                    onClick={() => handleAddToCart(product)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    {product.imagen && product.imagen.variants ? (
                      <CardMedia
                        component="img"
                        height="130"
                        image={product.imagen.variants.medium}
                        alt={product.name}
                        sx={{
                          objectFit: 'cover',
                          display: 'block',
                          margin: '0 auto',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.common.white,
                        }}
                      ></Box>
                    )}
                    <CardContent>
                      <Tooltip title={product.name} placement="top">
                        <Typography variant="body1" gutterBottom fontWeight="bold">
                          {truncateName(product.name, 18)}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body1" fontWeight="inherit">
                        {product.price.toFixed(2)} {product.sigla}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
          )}
        </Grid>
      </Grid>

      <Grid item xs={12} md={6} lg={4} sx={{ userSelect: 'none' }}>
        <Paper elevation={3} sx={{ p: 2 }}>
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
                  position: 'relative', // Establecer posición relativa para alinear el ícono
                }}
              >
                {/* Ícono de cierre */}
                {selectedOption.state === 'ELABORADO' && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      color: 'red',
                    }}
                    onClick={eliminarTodoPedido}
                  >
                    <Close sx={{ fontSize: 18 }} /> {/* Ajustar el tamaño del ícono */}
                  </IconButton>
                )}

                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography
                      onClick={handleOpenUbicacionEditar}
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                          '& .editIcon': {
                            visibility: 'visible',
                          },
                        },
                        fontWeight: 'bold',
                      }}
                    >
                      {(() => {
                        const ubicacionStr = localStorage.getItem('ubicacion')
                        if (ubicacionStr) {
                          try {
                            const ubicacion = JSON.parse(ubicacionStr)
                            return (
                              <>
                                {ubicacion.descripcion || 'Ubicación'}
                                <Edit
                                  className="editIcon"
                                  sx={{ marginLeft: 0.1, visibility: 'hidden' }}
                                  style={{ fontSize: 16 }}
                                />
                              </>
                            )
                          } catch (e) {
                            console.error('Error al parsear la ubicación:', e)
                            return 'Ubicación'
                          }
                        }
                        return 'Salón Principal'
                      })()}
                    </Typography>

                    <Typography variant="h6">
                      {selectedOption.nroPedido !== null
                        ? `Pedido: ${selectedOption.nroOrden}`
                        : `Mesa: ${selectedOption.value}`}
                    </Typography>
                    <Typography variant="body1">
                      {selectedOption.nroPedido !== null
                        ? `Mesa: ${selectedOption.value}`
                        : ``}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" sx={{ padding: 1 }}>
                      {selectedOption.state !== null
                        ? `Estado: ${selectedOption.state}`
                        : `Estado: Libre`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Fin Visual  */}

          {selectedView === 'lista' || selectedView === null || selectedView === '' ? (
            <>
              <Grid item xs={12}>
                <Select
                  styles={reactSelectStyle(Boolean(errors.mesa))}
                  name={'mesa'}
                  placeholder={'Seleccione una mesa'}
                  menuPosition={'fixed'}
                  value={mesasSeleccionadas}
                  // solo se permite el isclearable si se permite seleccion multiple
                  // isClearable={!permitirSeleccionMultiple}
                  isClearable={true}
                  onChange={manejarCambioSeleccion}
                  onKeyDown={manejarPresionTecla}
                  options={options}
                  isMulti={permitirSeleccionMultiple}
                  getOptionValue={(opcion) => opcion.value.toString()}
                  getOptionLabel={(opcion) =>
                    opcion.nroOrden
                      ? `Mesa: ${opcion.mesa} - Pedido: ${opcion.nroOrden} - Estado: ${opcion.state}`
                      : `Mesa: ${opcion.mesa} - Estado: ${opcion.state}`
                  }
                />
              </Grid>
            </>
          ) : (
            <></>
          )}

          <Grid container spacing={0}>
            {/* Cliente */}
            <Grid item xs={9}>
              <Controller
                name="cliente"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.cliente)}>
                    <AsyncSelect
                      {...field}
                      cacheOptions={false}
                      defaultOptions={true}
                      styles={reactSelectStyle(Boolean(errors.cliente))}
                      menuPosition={'fixed'}
                      name="clientes"
                      placeholder={'Buscar Cliente'}
                      loadOptions={fetchClientes}
                      isClearable={true}
                      value={field.value || null}
                      getOptionValue={(item) => item.codigoCliente}
                      getOptionLabel={(item) =>
                        `${item.numeroDocumento}${item.complemento || ''} - ${item.razonSocial}`
                      }
                      onChange={(cliente: SingleValue<ClienteProps>) => {
                        field.onChange(cliente)
                        setValue('emailCliente', genReplaceEmpty(cliente?.email, ''))
                        setValue('razonSocial', genReplaceEmpty(cliente?.razonSocial, ''))
                        setValue('telefono', genReplaceEmpty(cliente?.telefono, ''))
                        if (cliente?.state === 'REGISTRO') {
                          setValue('emailCliente', genReplaceEmpty(cliente?.email, ''))
                          setValue(
                            'razonSocial',
                            genReplaceEmpty(cliente?.razonSocial, ''),
                          )
                          setValue(
                            'numeroDocumento',
                            genReplaceEmpty(cliente?.numeroDocumento, ''),
                          )
                          setValue('sinTipoDocumento', cliente?.tipoDocumentoIdentidad)
                          setValue(
                            'complemento',
                            genReplaceEmpty(cliente?.complemento, '') || '',
                          )
                          setIsCreatingNewClient(true)
                        } else {
                          setIsCreatingNewClient(false)
                        }
                      }}
                      onBlur={field.onBlur}
                      noOptionsMessage={() =>
                        'Ingrese al menos 3 caracteres para buscar un cliente'
                      }
                      loadingMessage={() => 'Buscando...'}
                    />
                  </FormControl>
                )}
              />
            </Grid>

            {/* Agregamos 3 iconos: explorar, nuevo cliente, nuevo cliente excepcion */}
            <Grid item xs={1}>
              <Tooltip title="Explorar Cliente">
                <IconButton
                  aria-label="expand"
                  color="primary"
                  onClick={() => setExplorarCliente(true)}
                  size="small"
                >
                  <Search />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={1}>
              <Tooltip title="Nuevo Cliente">
                <IconButton
                  aria-label="expand"
                  color="primary"
                  onClick={() => setNuevoCliente(true)}
                  size="small"
                >
                  <PersonAdd />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={1}>
              <Tooltip title="Cliente 99001">
                <IconButton
                  aria-label="expand"
                  color="primary"
                  onClick={() => setCliente99001(true)}
                  size="small"
                >
                  <NineK />
                </IconButton>
              </Tooltip>
            </Grid>

            {clienteSeleccionado && (
              <Grid container>
                <Grid item xs={6}>
                  <Controller
                    name="emailCliente"
                    control={control}
                    render={({ field }) => (
                      <FormTextField
                        {...field}
                        label="Email"
                        placeholder="Ingrese el Email"
                        name="emailCliente"
                        id="emailCliente"
                        fullWidth
                        margin="normal"
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} sx={{ px: 1 }}>
                  <Controller
                    name="razonSocial"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Razón Social"
                        placeholder="Ingrese la Razón Social"
                        name="razonSocial"
                        id="razonSocial"
                        margin="normal"
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // quitamos espacio de arriba
                    marginTop: '-15px',
                  }}
                >
                  {whatsappEnabled && (
                    <Controller
                      name="telefono"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Teléfono"
                          placeholder="Ingrese el Teléfono - Whatsapp"
                          name="telefono"
                          id="telefono"
                          margin="normal"
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                  )}
                </Grid>
                {isCreatingNewClient && (
                  <>
                    <Grid item xs={8}>
                      <Controller
                        name="numeroDocumento"
                        control={control}
                        render={({ field }) => (
                          <FormTextField
                            {...field}
                            label="Número de Documento"
                            placeholder="Ingrese el Número de Documento"
                            fullWidth
                            margin="normal"
                            size="small"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} sx={{ px: 1 }}>
                      <Controller
                        name="complemento"
                        control={control}
                        render={({ field }) => (
                          <FormTextField
                            {...field}
                            label="Complemento"
                            placeholder="Ingrese el Complemento"
                            fullWidth
                            margin="normal"
                            size="small"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      {tdiLoading ? (
                        <AlertLoading />
                      ) : (
                        <Controller
                          render={({ field }) => (
                            <FormControl
                              fullWidth
                              error={Boolean(errors.sinTipoDocumento)}
                              required
                            >
                              <MyInputLabel shrink>Tipo Documento Identidad</MyInputLabel>
                              <Select<SinTipoDocumentoIdentidadProps>
                                menuPosition={'fixed'}
                                styles={reactSelectStyle(
                                  Boolean(errors.sinTipoDocumento),
                                )}
                                name={'sinTipoDocumento'}
                                placeholder={'Seleccione el tipo documento identidad'}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                isSearchable={false}
                                options={tiposDocumentoIdentidad}
                                getOptionValue={(item) =>
                                  item.codigoClasificador.toString()
                                }
                                getOptionLabel={(item) => `${item.descripcion}`}
                                required
                              />
                            </FormControl>
                          )}
                          name={'sinTipoDocumento'}
                          control={control}
                        />
                      )}
                    </Grid>
                  </>
                )}
                <Grid item lg={12} xs={12} md={12}>
                  <Checkbox
                    checked={isCheckedExecpcion}
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                    style={{ marginRight: '0px' }}
                    onClick={() => {
                      setIsCheckedExecpcion((prev) => !prev) // Cambia el estado al valor opuesto
                      setValue('codigoExcepcion', isCheckedExecpcion ? 0 : 1) // Envía 1 si está marcado, 0 si está desmarcado
                    }}
                  />
                  <span
                    style={{
                      marginLeft: '8px',
                      marginRight: '8px',
                    }}
                  >
                    Facturación con NIT inválido
                  </span>
                </Grid>
                {isCheckedExecpcion && (
                  <Typography variant="body2" style={{ color: 'red', marginTop: '8px' }}>
                    <strong>Nota:</strong> Se permitirá la facturación aunque el NIT esté
                    inválido
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>

          {/* 3 Botones de 1. Para Aca, Para LLevar y Delibery */}
          <Grid container spacing={1}>
            {tiposPedido.map((tipo) => (
              <Grid item xs={4} key={tipo}>
                <Button
                  fullWidth
                  variant={selectedButtonTipoPedido === tipo ? 'contained' : 'outlined'}
                  onClick={() => handleTipoPedidoButtonClick(tipo)}
                >
                  {tipo}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            {cart.length === 0 ? (
              <Box alignItems="center">
                <Grid container direction="column" alignItems="center">
                  {/* CENTRAR  */}
                  <Grid item>
                    <IconButton disabled>
                      <ShoppingCartOutlined sx={{ fontSize: 100 }} />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      No hay productos en el carrito
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ) : (
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
                      sx={{ mb: 0.5 }}
                      onClick={(event) => event.stopPropagation()}
                      style={{ backgroundColor: '#EEF5FB', borderRadius: 5 }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{ backgroundColor: '#EEF5FB', borderRadius: 2 }}
                      >
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Tooltip title={product.name} placement="top">
                              <Typography variant="body2">
                                {truncateName(product.name, 15)}
                              </Typography>
                            </Tooltip>
                            <Typography variant="body2">
                              {product.price.toFixed(2)} {product.sigla}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleQuantityChange(index, 'subtract')}
                            >
                              <Remove />
                            </IconButton>
                            <Typography variant="body2">{product.quantity}</Typography>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleQuantityChange(index, 'add')}
                            >
                              <Add />
                            </IconButton>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                mr: 1,
                              }}
                            >
                              {product.discount > 0 && (
                                <Typography
                                  variant="caption"
                                  sx={{ textDecoration: 'line-through', color: 'gray' }}
                                >
                                  {(product.price * product.quantity).toFixed(2)}{' '}
                                  {product.sigla}
                                </Typography>
                              )}
                              <Typography variant="body2">
                                {(
                                  product.price * product.quantity -
                                  product.discount
                                ).toFixed(2)}{' '}
                                {product.sigla}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveFromCart(index)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 1 }}>
                        <Grid container spacing={1}>
                          <Grid item xs={7}>
                            <FormControl fullWidth size="small">
                              <InputLabel htmlFor="precio">Precio</InputLabel>
                              <OutlinedInput
                                id="precio"
                                label="Precio"
                                size="small"
                                value={product.price}
                                onChange={(e) =>
                                  handlePriceChange(index, parseFloat(e.target.value))
                                }
                                onBlur={() =>
                                  handlePriceChange(index, product.price || 0)
                                }
                                inputComponent={NumeroFormat as any}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={5} key={index}>
                            <FormControl fullWidth size="small">
                              <InputLabel htmlFor={`descuento-${index}`}>
                                Descuento
                              </InputLabel>
                              <OutlinedInput
                                id={`descuento-${index}`}
                                label="Descuento"
                                size="small"
                                value={getDisplayValue(product, index)}
                                onChange={(e) =>
                                  handleDiscountChange(
                                    index,
                                    e.target.value,
                                    discountTypes[index],
                                  )
                                }
                                onBlur={(e) => handleBlur(index, e.target.value)}
                                inputComponent={NumeroFormat as any}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle discount type"
                                      onClick={() => toggleDiscountType(index)}
                                      edge="end"
                                    >
                                      {discountTypes[index] ? (
                                        <PercentOutlined />
                                      ) : (
                                        <Typography style={{ fontSize: '1rem' }}>
                                          BOB
                                        </Typography>
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <FormTextField
                              label="Notas"
                              value={product.extraDescription}
                              onChange={(e) =>
                                handleExtraDescriptionChange(index, e.target.value)
                              }
                              multiline
                              rows={2}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Zoom>
                ))}
                <hr />
                <Grid container spacing={1} style={{ marginTop: '5px' }}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      onClick={
                        selectedOption?.state === 'COMPLETADO'
                          ? actualizarPedido
                          : registrarPedido
                      }
                      style={{ height: '50px' }}
                    >
                      {selectedOption?.state === 'COMPLETADO'
                        ? 'Actualizar'
                        : 'Registrar'}
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      onClick={finalizarOrden}
                      variant="contained"
                      color="secondary"
                      style={{ height: '50px' }}
                      startIcon={<Done />}
                      disabled={selectedOption?.state === 'Libre'}
                    >
                      Finalizar
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() =>
                        generarComandaPDF(
                          cart,
                          usuario,
                          selectedOption?.value.toString(),
                          selectedOption?.nroOrden?.toString(),
                          itemEliminados,
                          tiposPedidos,
                          clienteSeleccionado,
                        )
                      }
                      endIcon={<Print />}
                      style={{ height: '50px', backgroundColor: '#6e7b8c' }}
                      disabled={selectedOption?.state === 'Libre'}
                    >
                      Comanda
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      style={{ height: '50px', backgroundColor: '#b69198' }}
                      endIcon={<AttachMoney />}
                      disabled={selectedOption?.state === 'Libre'}
                      onClick={() =>
                        generarReciboPDF(
                          cart,
                          usuario,
                          total,
                          selectedOption?.value.toString(),
                          selectedOption?.nroOrden?.toString(),
                          printDescuentoAdicional.toString(),
                        )
                      }
                    >
                      Cuenta
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      onClick={handleRegisterAndFinalize}
                      variant="contained"
                      color="secondary"
                      style={{ height: '50px' }}
                      disabled={selectedOption?.state === 'COMPLETADO'}
                      endIcon={<DoneAll />}
                    >
                      Reg. y Fin.
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      onClick={handleFacturar}
                      variant="contained"
                      endIcon={<Receipt />}
                      // color="secondary"
                      disabled={selectedOption?.state !== 'COMPLETADO'}
                      style={{ height: '50px', backgroundColor: '#f0ad4e' }}
                    >
                      Facturar
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* <Grid item xs={12}> */}
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
                      onChange={(e) => setGiftCardAmount(parseFloat(e.target.value) || 0)}
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

            <TotalBox>
              <List>
                <ListItem
                  style={{ padding: 0 }}
                  secondaryAction={
                    <Typography
                      gutterBottom
                      sx={{ fontWeight: 'bold', fontSize: '1.6em' }}
                    >
                      <span
                        className="total-amount"
                        style={{ fontWeight: 'bold', color: 'green' }}
                      >
                        {numberWithCommas(total, {})}
                        <span> BOB</span>
                      </span>
                    </Typography>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography
                        color="error"
                        style={{ fontWeight: 'bold', fontSize: '1.6em' }}
                      >
                        Total
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </TotalBox>
            {/* <Grid container spacing={2} alignItems="center">
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
            </Grid> */}

            <hr />
            {/* {selectedOption?.state === 'COMPLETADO' && ( */}
            <Grid
              container
              spacing={1}
              justifyContent={metodosPago?.length ? 'flex-start' : 'center'}
              alignItems="center"
              direction="row"
            >
              {metodosPago && metodosPago.length > 0 ? (
                <>
                  {metodosPago.slice(0, 3).map(renderMetodoPago)}
                  {metodosPago.length > 3 && (
                    <>
                      <Grid item xs={3}>
                        <MetodoPagoButton
                          text="Otros"
                          icon={<MoreHoriz fontSize="small" />}
                          selected={false}
                          onClick={handleOtrosClick}
                        />
                      </Grid>
                      <Popover
                        sx={{ p: 20 }}
                        open={Boolean(otrosAnchorEl)}
                        anchorEl={otrosAnchorEl}
                        onClose={() => setOtrosAnchorEl(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      >
                        <Grid container spacing={1} sx={{ p: 2 }}>
                          {metodosPago.slice(3).map(renderMetodoPago)}
                        </Grid>
                      </Popover>
                    </>
                  )}
                </>
              ) : (
                <Grid item xs={12} container justifyContent="center">
                  <Typography variant="body2" color="textSecondary">
                    Habilite los métodos de pago en el administrador.
                  </Typography>
                </Grid>
              )}
            </Grid>
            {/* )} */}
          </Grid>
        </Paper>
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
              setValue('razonSocial', value.razonSocial)
              await fetchClientes(value.codigoCliente || '')
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
              setValue('razonSocial', value.razonSocial)
              setValue('telefono', value.telefono)
              await fetchClientes(value.codigoCliente || '')
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
              setValue('razonSocial', value.razonSocial)
              setValue('telefono', value.telefono)
              await fetchClientes(value?.codigoCliente || '')
              setNuevoCliente(false)
            } else {
              setNuevoCliente(false)
            }
          }}
        />
      </>
      <>
        <CreditCardDialog
          open={openDialogCard}
          onClose={() => setOpenDialogCard(false)}
          cliente={clienteSeleccionado}
          form={form}
          metodoPago={enviaDatos}
        />
      </>
      <>
        <DeliveryDialog
          open={openDeliveryDialog}
          onClose={() => setOpenDeliveryDialog(false)}
          form={form}
          dataDelivery={dataDelivery || {}}
        />
      </>
      <NuevoEspacioDialog
        open={dialogEspacioOpen}
        onClose={() => setDialogEspacioOpen(false)}
        entidad={{
          codigoSucursal: sucursal.codigo,
          codigoPuntoVenta: puntoVenta.codigo,
        }}
        onSuccess={() => {
          // Recaragamos la llamda a la api de usequery
          // @ts-ignore
          queryClient.invalidateQueries('espaciosListado')
        }}
        onEspacioCreado={() => {
          //@ts-ignore
          queryClient.invalidateQueries('espaciosListado')
        }}
        espacio={currentEspacio}
      />
    </Grid>
  )
}

export default PedidoGestion
