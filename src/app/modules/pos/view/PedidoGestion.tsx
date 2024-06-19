import {
  Add,
  AttachMoney,
  Close,
  CreditCard,
  Delete,
  ExpandMore,
  HomeWork,
  LibraryAddCheck,
  MoreHoriz,
  MoreVert,
  NineK,
  PersonAdd,
  QrCode,
  Receipt,
  RecentActors,
  Remove,
  Save,
  Search,
  SendTimeExtension,
  ShoppingCartOutlined,
  TableRestaurant,
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
  Skeleton,
  styled,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import pdfMake from 'pdfmake/build/pdfmake'
import printJS from 'print-js'
import InputNumber from 'rc-input-number'
import {
  FunctionComponent,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select, { SingleValue } from 'react-select'
import AsyncSelect from 'react-select/async'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import AlertLoading from '../../../base/components/Alert/AlertLoading'
import { FormTextField } from '../../../base/components/Form'
import { NumeroFormat } from '../../../base/components/Mask/NumeroFormat'
import { MyInputLabel } from '../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import { reactSelectStyle } from '../../../base/components/MySelect/ReactSelect'
import RepresentacionGraficaUrls from '../../../base/components/RepresentacionGrafica/RepresentacionGraficaUrls'
import useAuth from '../../../base/hooks/useAuth'
import { SinTipoDocumentoIdentidadProps } from '../../../interfaces/sin.interface'
import { genReplaceEmpty } from '../../../utils/helper'
import { swalException } from '../../../utils/swal'
import { apiClienteBusqueda } from '../../clientes/api/clienteBusqueda.api'
import ClienteExplorarDialog from '../../clientes/components/ClienteExplorarDialog'
import { ClienteProps } from '../../clientes/interfaces/cliente'
import Cliente99001RegistroDialog from '../../clientes/view/registro/Cliente99001RegistroDialog'
import ClienteRegistroDialog from '../../clientes/view/registro/ClienteRegistroDialog'
import useQueryTipoDocumentoIdentidad from '../../sin/hooks/useQueryTipoDocumento'
import { apiListadoArticulos } from '../api/articulos.api'
import { obtenerListadoPedidos } from '../api/pedidosListado.api'
import { generarComandaPDF } from '../Pdf/Comanda'
import { facturarPedido } from '../Pdf/facturarPedido'
import { finalizarPedido } from '../Pdf/finalizarPedido'
import { generarReciboPDF } from '../Pdf/Recibo'
import MetodoPagoButton from '../utils/MetodoPagoButton'
import { actualizarItemPedido } from '../utils/Pedidos/actualizarItem'
import { adicionarItemPedido } from '../utils/Pedidos/adicionarItems'
import { eliminarPedido } from '../utils/Pedidos/pedidoEliminar'
import { restPedidoExpressRegistro } from '../utils/Pedidos/PedidoExpress'
import { eliminarPedidoTodo } from '../utils/Pedidos/pedidoTodoEliminar'
import CreditCardDialog from './CardDialog'
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
    user: { sucursal, puntoVenta, tipoRepresentacionGrafica, usuario },
  } = useAuth()

  const form = props.form
  const logo = import.meta.env.ISI_LOGO_FULL

  const [cart, setCart] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [additionalDiscount, setAdditionalDiscount] = useState<number>(0)
  const [giftCardAmount, setGiftCardAmount] = useState<number>(0)
  const [montoRecibido, setMontoRecibido] = useState<number>(0)
  const [selectedButton, setSelectedButton] = useState<string | null>('Efectivo')
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

  const mySwal = withReactContent(Swal)

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
              email: '',
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
      const query = ''
      const fetchPagination = {
        page: 1,
        limit: 100,
        reverse: true,
        query,
      }
      const { docs } = await apiListadoArticulos(fetchPagination)

      // Almacenar en caché las URL de las imágenes
      docs.forEach((producto) => {
        const imageUrl = producto.imagen // Suponiendo que la URL de la imagen está en la propiedad 'imagen' del producto
        const codigoArticulo = producto.codigoArticulo
        imageCache[codigoArticulo] = imageUrl
      })

      return docs
    },
    refetchOnWindowFocus: false,
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

    const existingProduct = cart.find((p) => p.name === product.name)
    if (existingProduct) {
      setCart((prevCart) =>
        prevCart.map((p) =>
          p.name === product.name ? { ...p, quantity: p.quantity + 1 } : p,
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

  const subtotal = cart.reduce(
    (total, product) => total + product.price * product.quantity - product.discount,
    0,
  )

  const total = subtotal - additionalDiscount - giftCardAmount

  const handleButtonClick = (buttonText: string) => {
    setSelectedButton(buttonText === selectedButton ? null : buttonText)
    if (buttonText === 'Efectivo') {
      setValue('metodoPago', 1)
    } else if (buttonText === 'Credito') {
      setValue('metodoPago', 2)
      setOpenDialogCard(true)
    } else if (buttonText === 'QR') {
      setValue('metodoPago', 7)
    } else if (buttonText === 'Otro') {
      setValue('metodoPago', 'Otro')
    }
  }

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
  /**
   * Genera un arreglo de mesas del 1 al 50
   */

  const mesas = [] as string[]
  for (let i = 1; i <= 50; i++) {
    mesas.push(`Mesa ${i}`)
  }
  /**
   * Genera un arreglo de opciones para el componente Select
   * @returns Un arreglo de objetos con las propiedades value, nroPedido, nroOrden, mesa y state
   *       de acuerdo a los pedidos encontrados en data
   *       o a las mesas libres si no se encontró un pedido
   */

  const options = useMemo(() => {
    const result: {
      value: number
      nroPedido: number | null
      nroOrden: number | null
      mesa: string
      state: string
    }[] = []

    const seenValues = new Set<number>()

    mesas.forEach((mesa) => {
      const mesaNumber = Number(mesa.split(' ')[1])

      const pedidoEncontrado = data?.find((pedido) => {
        const mesaNombres = pedido.mesa.nombre.split('-')
        return (
          mesaNombres.some((m: string) => m.trim() === `${mesaNumber}`) &&
          !['FINALIZADO', 'FACTURADO', 'ANULADO'].includes(pedido.state.toUpperCase())
        )
      })

      if (pedidoEncontrado) {
        const { numeroPedido, numeroOrden, mesa: mesaPedido, state } = pedidoEncontrado
        const mesasUnidas = mesaPedido.nombre.split('-').map((m: any) => `Mesa ${m}`)
        const numberValue = Number(mesasUnidas[0].split(' ')[1])

        if (!seenValues.has(numberValue)) {
          result.push({
            value: numberValue,
            nroPedido: numeroPedido,
            nroOrden: numeroOrden,
            mesa: mesaPedido.nombre,
            state,
          })
          mesasUnidas.forEach((m: string) => seenValues.add(Number(m.split(' ')[1])))
        }
      } else {
        if (!seenValues.has(mesaNumber)) {
          result.push({
            value: mesaNumber,
            nroPedido: null,
            nroOrden: null,
            mesa: `${mesaNumber}`,
            state: 'Libre',
          })
          seenValues.add(mesaNumber)
        }
      }
    })

    // Asegurarse de que todas las mesas del 1 al 50 estén presentes
    for (let i = 1; i <= 50; i++) {
      if (!seenValues.has(i)) {
        result.push({
          value: i,
          nroPedido: null,
          nroOrden: null,
          mesa: `${i}`,
          state: 'Libre',
        })
      }
    }

    // Ordenar los resultados por el valor
    result.sort((a, b) => a.value - b.value)

    return result
  }, [data])

  useEffect(() => {
    const updateCart = () => {
      if (selectedOption?.nroPedido) {
        const pedidoEncontrado = data?.find(
          (pedido) => pedido.numeroPedido === selectedOption.nroPedido,
        )

        if (pedidoEncontrado && pedidoEncontrado.productos) {
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
          setCart([])
        }
      } else {
        setCart([])
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
    )
      .then((response) => {
        if (response.restPedidoExpressRegistro) {
          const { numeroPedido, numeroOrden, mesa, state } =
            response.restPedidoExpressRegistro
          setPermitirSeleccionMultiple(false)
          const numberValue = Number(mesa.nombre.split('-')[0])
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
        }
      })
      .catch((error) => {
        console.error('Error al registrar el pedido:', error)
      })
  }

  const actualizarPedido = () => {
    if (selectedOption?.nroPedido === null || selectedOption?.nroPedido === undefined) {
      toast.error('No se puede actualizar un pedido sin número de pedido')
      return
    }

    actualizarItemPedido(
      puntoVenta,
      sucursal,
      selectedOption?.nroPedido ? Number(selectedOption.nroPedido) : 0,
      deletedProducts,
      cart,
      () => {
        refetch()
      },
    ).then((responseActualizar) => {
      const { numeroPedido, numeroOrden, mesa, state } =
        //@ts-ignore
        responseActualizar.restPedidoActualizarItem
      setSelectedOption({
        value: Number(mesa.nombre),
        nroPedido: numeroPedido,
        nroOrden: numeroOrden,
        mesa: mesa.nombre,
        state,
      })
      setMesasSeleccionadas([
        {
          value: Number(mesa.nombre),
          nroPedido: numeroPedido,
          nroOrden: numeroOrden,
          mesa: mesa.nombre,
          state,
        },
      ])

      // Verificamos si hay al menos un producto en el carrito que sea distinto de fromDatabase
      const hasNonDatabaseProduct = cart.some((producto) => !producto.fromDatabase)

      // Si hay productos nuevos en el carrito, llamamos a adicionarItemPedido
      if (hasNonDatabaseProduct) {
        adicionarItemPedido(
          puntoVenta,
          sucursal,
          selectedOption?.nroPedido ? Number(selectedOption.nroPedido) : 0,
          deletedProducts,
          cart,
          () => {
            refetch()
          },
        ).then((responseAdicionar) => {
          const { numeroPedido, numeroOrden, mesa, state } =
            //@ts-ignore
            responseAdicionar.restPedidoAdicionarItem

          setSelectedOption({
            value: Number(mesa.nombre),
            nroPedido: numeroPedido,
            nroOrden: numeroOrden,
            mesa: mesa.nombre,
            state,
          })
          setMesasSeleccionadas([
            {
              value: Number(mesa.nombre),
              nroPedido: numeroPedido,
              nroOrden: numeroOrden,
              mesa: mesa.nombre,
              state,
            },
          ])
          setSelectedCategory(null)

          // Verificamos si hay productos eliminados para llamar a eliminarPedido
          if (deletedProducts.length > 0) {
            eliminarPedido(
              puntoVenta,
              sucursal,
              selectedOption?.nroPedido ? Number(selectedOption.nroPedido) : 0,
              deletedProducts,
              () => {
                refetch()
              },
            ).then((responseEliminar) => {
              const { numeroPedido, numeroOrden, mesa, state } =
                responseEliminar.restPedidoEliminarItem
              setSelectedOption({
                value: Number(mesa.nombre),
                nroPedido: numeroPedido,
                nroOrden: numeroOrden,
                mesa: mesa.nombre,
                state,
              })
              setMesasSeleccionadas([
                {
                  value: Number(mesa.nombre),
                  nroPedido: numeroPedido,
                  nroOrden: numeroOrden,
                  mesa: mesa.nombre,
                  state,
                },
              ])
              setSelectedCategory(null)

              setDeletedProducts([])
            })
          }
        })
      } else {
        // Si no hay productos nuevos, simplemente llamamos a eliminarPedido si hay elementos en deletedProducts
        if (deletedProducts.length > 0) {
          eliminarPedido(
            puntoVenta,
            sucursal,
            selectedOption?.nroPedido ? Number(selectedOption.nroPedido) : 0,
            deletedProducts,
            () => {
              refetch()
            },
          ).then((responseEliminar) => {
            const { numeroPedido, numeroOrden, mesa, state } =
              responseEliminar.restPedidoEliminarItem
            setSelectedOption({
              value: Number(mesa.nombre),
              nroPedido: numeroPedido,
              nroOrden: numeroOrden,
              mesa: mesa.nombre,
              state,
            })
            setMesasSeleccionadas([
              {
                value: Number(mesa.nombre),
                nroPedido: numeroPedido,
                nroOrden: numeroOrden,
                mesa: mesa.nombre,
                state,
              },
            ])
            setSelectedCategory(null)

            setDeletedProducts([])
          })
        }
      }
    })
  }

  const finalizarOrden = () => {
    finalizarPedido(
      getValues(),
      puntoVenta,
      sucursal,
      selectedOption?.nroPedido ? Number(selectedOption.nroPedido) : undefined,
      additionalDiscount,
      refetch,
      isCreatingNewClient,
    )
      .then((response) => {
        if (response.restPedidoFinalizar) {
          const { mesa } = response.restPedidoFinalizar
          const mesaNombre = mesa.nombre.split('-')[0] // Tomar el primer número antes del guion

          setSelectedOption({
            value: Number(mesaNombre),
            nroPedido: null,
            nroOrden: null,
            mesa: mesaNombre,
            state: 'Libre',
          })

          setMesasSeleccionadas([
            {
              value: Number(mesaNombre),
              nroPedido: null,
              nroOrden: null,
              mesa: mesaNombre,
              state: 'Libre',
            },
          ])
          // Eliinar cliente seleccionado
          eliminarCliente()
          setIsCreatingNewClient(false)
          setValue('cliente', null)
          setSelectedButton('Efectivo')
          setEnviaDatos(true)
          setSelectedCategory(categories[0].name || null)
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
    if (
      selectedButton === 'Credito' &&
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
      false,
    )
      .then((response) => {
        if (response.restPedidoFinalizar) {
          const { numeroPedido, mesa } = response.restPedidoFinalizar
          setSelectedOption({
            value: Number(mesa.nombre),
            nroPedido: null,
            nroOrden: null,
            mesa: mesa.nombre,
            state: 'Libre',
          })
          setMesasSeleccionadas([
            {
              value: Number(mesa.nombre),
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
            .then((response) => {
              if (response) {
                setIsCreatingNewClient(false)
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
                setSelectedButton('Efectivo')
                setEnviaDatos(true)
              }

              setValue('metodoPago', 1)
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
    restPedidoExpressRegistro(
      cart,
      puntoVenta,
      sucursal,
      selectedOption?.mesa || '',
      () => {
        setCart([])
        refetch()
      },
    )
      .then((response) => {
        if (response.restPedidoExpressRegistro) {
          const { numeroPedido, numeroOrden, mesa, state } =
            response.restPedidoExpressRegistro
          setSelectedOption({
            value: Number(mesa.nombre),
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
            isCreatingNewClient,
          )
            .then((response) => {
              if (response.restPedidoFinalizar) {
                const { mesa } = response.restPedidoFinalizar
                setSelectedOption({
                  value: Number(mesa.nombre),
                  nroPedido: null,
                  nroOrden: null,
                  mesa: mesa.nombre,
                  state: 'Libre',
                })
                eliminarCliente()
                setIsCreatingNewClient(false)
                setSelectedButton('Efectivo')
                setEnviaDatos(true)
                setSelectedCategory(categories[0].name || null)
              }
              generarComandaPDF(
                cart,
                usuario,
                selectedOption?.mesa,
                selectedOption?.nroOrden?.toString(),
              )
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

  const handleSearchChange = (event: { target: { value: SetStateAction<string> } }) => {
    setSearchTerm(event.target.value)
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.products.some((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  useEffect(() => {
    const clienteSeleccionado = getValues('cliente')
    setClienteSeleccionado(clienteSeleccionado)
  }, [watch('cliente')])

  //useefect para metodo de pago al cargar la pagina
  useEffect(() => {
    setValue('metodoPago', 1)
  }, [])

  useEffect(() => {
    setPrintDescuentoAdicional(additionalDiscount)
  }, [additionalDiscount])

  useEffect(() => {
    setDeletedProducts([])
    setAdditionalDiscount(0)
    setGiftCardAmount(0)
    setMontoRecibido(0)
    setValue('cliente', null)
    eliminarCliente()
    setValue('emailCliente', '')
    setEnviaDatos((prevState) => !prevState)
  }, [selectedOption])

  const IMG = styled('img')(() => ({
    width: '100%',
    // maxHeight: '90px',
  }))

  useEffect(() => {
    // Obtiene el valor de selectedView del localStorage y lo asigna a selectedView
    const selectedView = localStorage.getItem('selectedView')
    if (selectedView) {
      setSelectedView(selectedView)
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
        email: 'Sin Email',
        tipoDocumentoIdentidad: {
          codigoClasificador: '1',
          descripcion: 'CI - CEDULA DE IDENTIDAD',
        },
      }
      if (clientePorDefecto) {
        setValue('cliente', clientePorDefecto)
        setValue('emailCliente', genReplaceEmpty(clientePorDefecto.email, ''))
      }
    }

    setClientePorDefecto()
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

  const { tiposDocumentoIdentidad, tdiLoading } = useQueryTipoDocumentoIdentidad()
  const [isCheckedExecpcion, setIsCheckedExecpcion] = useState(false)
  useEffect(() => {
    setValue('codigoExcepcion', 0)
  }, [])

  return (
    <Grid container spacing={3}>
      {selectedView === 'mosaico' ? (
        <div style={{ overflowX: 'auto', padding: '10px' }}>
          <div style={{ display: 'flex' }}>
            {options.map((option, index) => (
              <div key={index} style={{ marginRight: '8px' }}>
                <Card
                  sx={{
                    width: 110,
                    height: 110,
                    backgroundColor: option.state === 'Libre' ? '#AFE3B7' : '#EF9999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    // al pasar el mouse por encima, cambia el color de fondo
                    '&:hover': {
                      backgroundColor: option.state === 'Libre' ? '#8CCF9B' : '#E57373',
                    },
                  }}
                  onClick={() => setSelectedOption(option)}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6" component="h2">
                        {`M.: ${option.mesa}`}
                      </Typography>
                    </div>
                    {option.nroOrden && (
                      <Typography color="textSecondary">
                        {`Ped.: ${option.nroOrden}`}
                      </Typography>
                    )}
                    <TableRestaurant sx={{ marginRight: '8px' }} />
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
        <Grid
          container
          alignItems="center"
          spacing={2}
          paddingBottom={2}
          sx={{ userSelect: 'none' }}
        >
          <Grid item xs={3}>
            {/* Si filteredCategories está vacío y searchTerm está vacío, muestra un skeleton, de lo contrario, muestra el texto */}
            {filteredCategories.length === 0 && searchTerm.trim() === '' ? (
              <Skeleton variant="text" width={150} height={40} animation="wave" />
            ) : (
              <Typography variant="h4">Categorías</Typography>
            )}
          </Grid>
          <Grid container justifyContent="right" item xs={9}>
            {/* Si filteredCategories está vacío, muestra un skeleton, de lo contrario, muestra el TextField */}
            {filteredCategories.length === 0 && searchTerm.trim() === '' ? (
              <Skeleton variant="rectangular" width={300} height={56} animation="wave" />
            ) : (
              <>
                <FormTextField
                  label="Buscar categorías y productos"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  fullWidth
                  margin="normal"
                  style={{ width: '50%' }}
                  InputProps={{
                    endAdornment: <Search />,
                  }}
                />
                <IconButton
                  style={{
                    padding: '0px', // Reduced the padding
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
                </Menu>
              </>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Primero, verifica si hay categorías filtradas */}
          {filteredCategories.length === 0 && searchTerm.trim() === '' ? (
            // Si no hay categorías filtradas y el término de búsqueda está vacío, muestra skeletons para las tarjetas
            [1, 2, 3, 4, 5, 6].map((item) => (
              <Grid key={item} item xs={6} sm={4} md={3} sx={{ userSelect: 'none' }}>
                <Skeleton variant="rectangular" height={80} animation="wave" />
              </Grid>
            ))
          ) : filteredCategories.some((category) =>
              category.name.toLowerCase().includes(searchTerm.toLowerCase()),
            ) ? (
            // Si hay coincidencias con el término de búsqueda, muestra las tarjetas normalmente
            filteredCategories.map((category) => (
              <Grid
                item
                key={category.name}
                xs={6}
                sm={4}
                md={3}
                sx={{ userSelect: 'none' }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor:
                      selectedCategory === category.name ? 'primary.main' : 'inherit',
                    color:
                      selectedCategory === category.name ? 'common.white' : 'inherit',
                  }}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <Typography variant="body1">{category.name}</Typography>
                </Paper>
              </Grid>
            ))
          ) : (
            // Si no hay coincidencias, muestra un mensaje en lugar de skeletons
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                No se encontraron resultados
              </Typography>
            </Grid>
          )}
        </Grid>
        <Divider />
        <Grid container spacing={2} sx={{ mt: 2, position: 'relative' }}>
          {!selectedCategory ? (
            <IMG
              src={logo}
              alt="Logo"
              style={{
                opacity: 0.2, // Reducir la opacidad
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 'auto', // Centrar la imagen horizontalmente
                maxWidth: '50%', // Limitar el ancho máximo al 50% del contenedor
                maxHeight: '50%', // Limitar la altura máxima al 50% del contenedor
              }}
            />
          ) : (
            categories
              .find((category) => category.name === selectedCategory)
              ?.products.map((product) => (
                <Grid
                  item
                  key={product.name}
                  xs={6}
                  sm={3}
                  md={2}
                  sx={{ userSelect: 'none', textAlign: 'center' }}
                >
                  <Card
                    onClick={() => handleAddToCart(product)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {product.imagen && product.imagen.variants ? (
                      <CardMedia
                        component="img"
                        height="194"
                        image={product.imagen.variants.medium}
                        alt={product.name}
                        sx={{
                          objectFit: 'cover',
                          display: 'block',
                          margin: '0 auto',
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
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
          {/* Incio Visual  */}
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
                {selectedOption.state !== 'Libre' && (
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
                  <Typography variant="body1">No hay productos en el carrito</Typography>
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
                            {product.price.toFixed(2)} {product.sigla}
                          </Typography>
                          {/* <Typography variant="body2">{product.description}</Typography> */}
                          {/* <Typography variant="body2">
                          Subtotal: ${product.price * product.quantity - product.discount}
                        </Typography> */}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            color="primary"
                            onClick={() => handleQuantityChange(index, 'subtract')}
                          >
                            <Remove />
                          </IconButton>
                          <Typography variant="h6">{product.quantity}</Typography>
                          <IconButton
                            color="primary"
                            onClick={() => handleQuantityChange(index, 'add')}
                          >
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
                                {(product.price * product.quantity).toFixed(2)}{' '}
                                {product.sigla}
                              </Typography>
                            )}
                            <Typography variant="body1">
                              {(
                                product.price * product.quantity -
                                product.discount
                              ).toFixed(2)}{' '}
                              {product.sigla}
                            </Typography>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: 'flex' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={7}>
                          <FormControl fullWidth size="small">
                            <InputLabel htmlFor="precio">Precio</InputLabel>
                            <OutlinedInput
                              id="precio"
                              label="Precio"
                              size="small"
                              value={product.price}
                              onChange={(e) =>
                                handlePriceChange(index, parseFloat(e.target.value) || 0)
                              }
                              onBlur={() => handlePriceChange(index, product.price)}
                              inputComponent={NumeroFormat as any}
                              inputProps={{}}
                              sx={{ width: '100%' }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                          <FormControl fullWidth size="small">
                            <InputLabel htmlFor="descuento">Descuento</InputLabel>
                            <OutlinedInput
                              id="descuento"
                              label="Descuento"
                              size="small"
                              value={product.discount}
                              onChange={(e) =>
                                handleDiscountChange(
                                  index,
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              inputComponent={NumeroFormat as any}
                              inputProps={{}}
                              sx={{ width: '100%' }}
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
                            sx={{ width: '100%' }}
                            multiline
                          />
                        </Grid>

                        {/* <Grid item xs={12}>
                          <TextField
                            label="Detalle Extra"
                            value={product.extraDetalle}
                            onChange={(e) =>
                              handleDetalleExtraChange(index, e.target.value)
                            }
                            sx={{ width: '100%' }}
                          />
                        </Grid> */}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Zoom>
              ))}

              <hr />
              <Grid container spacing={2} style={{ marginTop: '10px' }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={
                      selectedOption?.state === 'COMPLETADO'
                        ? actualizarPedido
                        : registrarPedido
                    }
                    style={{ color: 'white', height: '60px' }}
                    endIcon={<Save />}
                  >
                    {selectedOption?.state === 'COMPLETADO'
                      ? 'Actualizar Pedido'
                      : 'Registrar Pedido'}
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    startIcon={<Receipt />}
                    fullWidth
                    onClick={finalizarOrden}
                    variant="contained"
                    color="secondary"
                    style={{ color: 'white', height: '60px' }}
                    disabled={selectedOption?.state === 'Libre'}
                  >
                    Finalizar Pedido
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    startIcon={<LibraryAddCheck />}
                    fullWidth
                    variant="contained"
                    onClick={() =>
                      generarComandaPDF(
                        cart,
                        usuario,
                        selectedOption?.mesa,
                        selectedOption?.nroOrden?.toString(),
                      )
                    }
                    style={{
                      color: 'white',
                      height: '60px',
                      backgroundColor: '#6e7b8c',
                    }}
                  >
                    Comanda
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    startIcon={<RecentActors />}
                    fullWidth
                    variant="contained"
                    style={{
                      color: 'white',
                      height: '60px',
                      backgroundColor: '#b69198',
                    }}
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
                  >
                    Estado de Cuenta
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    startIcon={<SendTimeExtension />}
                    fullWidth
                    onClick={handleRegisterAndFinalize}
                    variant="contained"
                    color="secondary"
                    style={{ color: 'white', height: '60px' }}
                    disabled={selectedOption?.state === 'COMPLETADO'}
                  >
                    Registrar, Finalizar y Comanda
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Grid item xs={12}>
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
                          setValue(
                            'razonSocial',
                            genReplaceEmpty(cliente?.razonSocial, ''),
                          )
                          // setValue(
                          //   'numeroDocumento',
                          //   genReplaceEmpty(cliente?.numeroDocumento, ''),
                          // )
                          // setValue('sinTipoDocumento', cliente?.tipoDocumentoIdentidad)
                          // setValue(
                          //   'complemento',
                          //   genReplaceEmpty(cliente?.complemento, '') || '',
                          // )
                          // console.log(getValues('cliente'))
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
              {/* <Grid item xs={12}>
                <ColoredSVG
                  name={clienteSeleccionado?.razonSocial || ''}
                  nit={clienteSeleccionado?.numeroDocumento || ''}
                  email={clienteSeleccionado?.email || ''}
                  form={form}
                />
              </Grid> */}
            </Grid>

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
                    <Typography variant="h6" color="error" style={{ fontWeight: 'bold' }}>
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

            <hr />
            {/* Metodos de Pago 1. Efectivo, 2. Credito, Qr, Otro */}
            {selectedOption?.state === 'COMPLETADO' && (
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant="h6">Método de Pago</Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={3}>
                  <MetodoPagoButton
                    text="Efectivo"
                    icon={<AttachMoney />}
                    selected={selectedButton === 'Efectivo'}
                    onClick={() => handleButtonClick('Efectivo')}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={3}>
                  <MetodoPagoButton
                    text="Crédito"
                    icon={<CreditCard />}
                    selected={selectedButton === 'Credito'}
                    onClick={() => handleButtonClick('Credito')}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={3}>
                  <MetodoPagoButton
                    text="QR"
                    icon={<QrCode />}
                    selected={selectedButton === 'QR'}
                    onClick={() => handleButtonClick('QR')}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={3}>
                  <MetodoPagoButton
                    text="Otro"
                    icon={<MoreHoriz />}
                    selected={selectedButton === 'Otro'}
                    onClick={() => handleButtonClick('Otro')}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              endIcon={<HomeWork />}
              fullWidth
              onClick={handleFacturar}
              variant="contained"
              disabled={selectedOption?.state !== 'COMPLETADO'}
              style={{ color: 'white', height: '60px' }}
            >
              Facturar
            </Button>
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
    </Grid>
  )
}

export default PedidoGestion
