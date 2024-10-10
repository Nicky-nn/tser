import {
  LayersClear,
  LibraryAddCheck,
  MenuOpen,
  RecentActors,
  SaveAs,
  ThumbUpOffAlt,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  Typography,
} from '@mui/material'
import {
  MRT_ColumnDef,
  MRT_Table,
  MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import AuditIconButton from '../../../../base/components/Auditoria/AuditIconButton'
import { FormTextField } from '../../../../base/components/Form'
import SimpleMenu, { SimpleMenuItem } from '../../../../base/components/MyMenu/SimpleMenu'
import useAuth from '../../../../base/hooks/useAuth'
import { MuiTableBasicOptionsProps } from '../../../../utils/muiTable/materialReactTableUtils'
import { swalException } from '../../../../utils/swal'
import AnularDocumentoDialog from '../../../ventas/view/VentaGestion/AnularDocumentoDialog'
import { restPedidoAnularApi } from '../../api/anularPedido.api'
import { restPedidoFinalizarApi } from '../../api/finalizarPedido.api'
import { generarComandaPDF } from '../../Pdf/Comanda'
import { generarReciboPDF } from '../../Pdf/Recibo'

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
  restablecerStock: boolean
  isSelected: boolean
}

interface OwnProps {
  row: any
  openModal: any
  refetch: () => any
}

type Props = OwnProps

const PedidosMenu: React.FC<Props> = (props) => {
  const { row, openModal, refetch } = props
  const {
    user: { usuario, sucursal, puntoVenta },
  } = useAuth()
  const [cart, setCart] = useState<Product[]>([])
  const [motivo, setMotivo] = useState('')
  const [openAnularModal, setOpenAnularModal] = useState(false)
  const [selectAllItems, setSelectAllItems] = useState(true)
  const [selectAllStock, setSelectAllStock] = useState(true)
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [openAnularDocumento, setOpenAnularDocumento] = useState(false)

  const [factura, setFactura] = useState<any | null>(null)

  useEffect(() => {
    const mappedProducts = row.productos.map((producto: any) => ({
      imagen: '',
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
      restablecerStock: true, // Seleccionado por defecto
      isSelected: true, // Seleccionado por defecto
    }))

    setCart(mappedProducts)

    const selectedItems = mappedProducts.map((item: any) => ({
      nroItem: item.nroItem,
      restablecerStock: item.restablecerStock,
    }))
    setSelectedItems(selectedItems)
  }, [row])

  const mesa = row.mesa.nombre
  const nroOrden = row.numeroOrden

  const handleAnularPedido = () => {
    setFactura({
      numeroFactura: row.refNroDocumento,
      cuf: row.refDocumento,
      cliente: {
        apellidos: row.cliente.apellidos,
        razonSocial: row.cliente.razonSocial,
        complemento: row.cliente.complemento,
        email: row.cliente.email,
        nombres: row.cliente.nombres,
        numeroDocumento: row.cliente.numeroDocumento,
        codigoCliente: row.cliente.codigoCliente,
      },
      fechaEmision: row.fechaDocumento,
    })
    setOpenAnularModal(true)
  }

  const handleCloseAnularModal = () => {
    setOpenAnularModal(false)
    setSelectedItems([])
    setMotivo('')
  }

  const handleConfirmAnular = async () => {
    const entidad = {
      codigoSucursal: row.sucursal.codigo,
      codigoPuntoVenta: row.puntoVenta.codigo,
    }

    try {
      if (motivo === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe ingresar un motivo de anulación',
        })
        return
      }

      const response = await restPedidoAnularApi(
        entidad,
        row.numeroPedido,
        true,
        motivo,
        selectedItems,
      )

      if (response) {
        Swal.fire({
          icon: 'success',
          title: 'Pedido Anulado',
          text: `El pedido ${row.numeroPedido} ha sido anulado correctamente`,
        })
        refetch()
        handleCloseAnularModal()
        // Abrimos dialogo de anulación de documento
        setOpenAnularDocumento(true)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al anular el pedido',
        })
      }
    } catch (error) {
      console.error('error', error)
      swalException(error)
    }
  }

  const columns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'isSelected',
      header: 'Seleccionar',
      size: 100,
      Cell: ({ row }) => (
        <Checkbox
          checked={row.original.isSelected}
          onChange={(e) => {
            const updatedCart = cart.map((item) =>
              item.nroItem === row.original.nroItem
                ? { ...item, isSelected: e.target.checked }
                : item,
            )
            setCart(updatedCart)

            const updatedSelectedItems = updatedCart
              .filter((item) => item.isSelected)
              .map((item) => ({
                nroItem: item.nroItem,
                restablecerStock: item.restablecerStock,
              }))
            setSelectedItems(updatedSelectedItems)
          }}
        />
      ),
    },
    {
      accessorKey: 'nroItem',
      header: 'Item Number',
      size: 55,
    },
    {
      accessorKey: 'codigoArticulo',
      header: 'Codigo Articulo',
      size: 100,
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'quantity',
      header: 'Cantidad',
      size: 100,
    },
    {
      accessorKey: 'restablecerStock',
      header: 'Restablecer Stock',
      Cell: ({ row }) => (
        <Checkbox
          checked={row.original.restablecerStock}
          onChange={(e) => {
            const updatedCart = cart.map((item) =>
              item.nroItem === row.original.nroItem
                ? { ...item, restablecerStock: e.target.checked }
                : item,
            )
            setCart(updatedCart)
          }}
        />
      ),
    },
  ]

  const table = useMaterialReactTable({
    ...(MuiTableBasicOptionsProps as MRT_TableOptions<any>),
    columns,
    data: cart,
    enableTableHead: true,
  })

  const handleSelectAllItems = (checked: boolean) => {
    setSelectAllItems(checked)
    const updatedCart = cart.map((item) => ({ ...item, isSelected: checked }))
    setCart(updatedCart)

    const updatedSelectedItems = updatedCart
      .filter((item) => item.isSelected)
      .map((item) => ({
        nroItem: item.nroItem,
        restablecerStock: item.restablecerStock,
      }))
    setSelectedItems(checked ? updatedSelectedItems : [])
  }

  const handleSelectAllStock = (checked: boolean) => {
    setSelectAllStock(checked)
    const updatedCart = cart.map((item) => ({ ...item, restablecerStock: checked }))
    setCart(updatedCart)
  }

  const finalizarPedido = async (row: any) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas finalizar el pedido ${row.numeroPedido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const entidad = {
          codigoSucursal: sucursal.codigo,
          codigoPuntoVenta: puntoVenta.codigo,
        }
        const cliente = {
          codigoCliente: row.cliente.codigoCliente,
          email: row.cliente.email,
          razonSocial: row.cliente.razonSocial,
          telefono: row.cliente.telefono,
        }
        const numeroPedido = row.numeroPedido
        const input = {
          codigoMetodoPago: 1,
          descuentoAdicional: row.descuentoAdicional,
          numeroTarjeta: null,
          montoGiftCard: 0,
          codigoMoneda: 1,
          otrosCostos: 0,
          descripcionOtrosCostos: null,
          montoTotal: 0,
        }

        const response = await restPedidoFinalizarApi(
          entidad,
          cliente,
          numeroPedido,
          input,
        )
        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Pedido Finalizado',
            text: `El pedido ${row.numeroPedido} ha sido finalizado correctamente`,
          })
          refetch()
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al finalizar el pedido',
          })
        }
      }
    })
  }

  return (
    <>
      <Box>
        <SimpleMenu
          menuButton={
            <IconButton aria-label="menu">
              <MenuOpen />
            </IconButton>
          }
        >
          <SimpleMenuItem onClick={() => openModal(row)}>
            <SaveAs /> Facturar
          </SimpleMenuItem>
          <SimpleMenuItem
            onClick={() => finalizarPedido(row)}
            disabled={row.state === 'FINALIZADO'}
          >
            <ThumbUpOffAlt /> Finalizar
          </SimpleMenuItem>
          <SimpleMenuItem
            onClick={() => generarComandaPDF(cart, usuario, mesa, nroOrden)}
          >
            <LibraryAddCheck /> Generar Comanda
          </SimpleMenuItem>
          <SimpleMenuItem
            onClick={() =>
              generarReciboPDF(
                cart,
                usuario,
                row.montoTotal,
                mesa,
                nroOrden?.toString(),
                row.descuentoAdicional,
              )
            }
          >
            <RecentActors />
            Generar E. de Cuenta
          </SimpleMenuItem>
          <SimpleMenuItem onClick={handleAnularPedido} disabled={row.state === 'ANULADO'}>
            <LayersClear /> Anular
          </SimpleMenuItem>
        </SimpleMenu>
        <AuditIconButton row={row} />
      </Box>
      <Modal open={openAnularModal} onClose={handleCloseAnularModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '70vh',
            width: '90vw',
            maxWidth: '800px',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Anular Pedido {row.numeroPedido}
          </Typography>
          <FormTextField
            label="Motivo de Anulación"
            fullWidth
            margin="normal"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAllItems}
                    onChange={(e) => handleSelectAllItems(e.target.checked)}
                  />
                }
                label="Seleccionar Todos los Ítems"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAllStock}
                    onChange={(e) => handleSelectAllStock(e.target.checked)}
                  />
                }
                label="Seleccionar Todos para Restablecer Stock"
              />
            </Grid>
          </Grid>
          <MRT_Table table={table} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseAnularModal} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleConfirmAnular}>
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>
      <>
        <AnularDocumentoDialog
          id={'anularDocumentoDialog'}
          open={openAnularDocumento}
          keepMounted
          factura={factura}
          onClose={async (val) => {
            if (val) {
              await refetch()
            }
            setFactura(null)
            setOpenAnularDocumento(false)
          }}
        />
      </>
    </>
  )
}

export default PedidosMenu
