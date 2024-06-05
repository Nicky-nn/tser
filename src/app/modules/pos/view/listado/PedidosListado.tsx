import { Button, Chip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_RowSelectionState,
  MRT_SortingState,
  MRT_TableOptions,
} from 'material-react-table'
import { FunctionComponent, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import StackMenuActionTable from '../../../../base/components/MyMenu/StackMenuActionTable'
import useAuth from '../../../../base/hooks/useAuth'
import { PAGE_DEFAULT, PageProps } from '../../../../interfaces'
import { genApiQuery } from '../../../../utils/helper'
import { MuiToolbarAlertBannerProps } from '../../../../utils/muiTable/materialReactTableUtils'
import { MuiTableAdvancedOptionsProps } from '../../../../utils/muiTable/muiTableAdvancedOptionsProps'
import { obtenerListadoPedidos } from '../../api/pedidosListado.api'
import ModalPedidoFacturar from './ModalPedidoFacturarDialog'
import PedidosMenu from './PedidosMenu'
import TotalesTabla from './TotalesTabla'

interface OwnProps {}

type Props = OwnProps

// Define las columnas de la tabla
const tableColumns: MRT_ColumnDef<any>[] = [
  {
    accessorFn: (row) => row.numeroPedido,
    header: 'Pedido',
    id: 'numeroPedido',
    size: 85,
  },
  {
    accessorFn: (row) => row.numeroOrden,
    header: 'Orden',
    id: 'numeroOrden',
    size: 100,
  },
  {
    accessorKey: 'productos',
    header: 'Productos',
    id: 'productos',
    accessorFn: (row) => {
      return row.productos
        .map((item: any) => `${item.nombreArticulo} - (x${item.articuloPrecio.cantidad})`)
        .join(', ')
    },
  },
  {
    accessorKey: 'razonSocial',
    header: 'Razón Social',
    id: 'razonSocial',
    accessorFn: (row) =>
      row.cliente ? row.cliente.razonSocial ?? 'Sin cliente' : 'Sin cliente',
  },
  {
    accessorKey: 'numeroDocumento',
    header: 'Nro. Documento',
    id: 'numeroDocumento',
    accessorFn: (row) =>
      row.cliente ? row.cliente.numeroDocumento ?? 'Sin documento' : 'Sin documento',
  },
  {
    accessorKey: 'fechaDocumento',
    header: 'Fecha',
    id: 'fechaCreacion',
    accessorFn: (row) => row.fechaDocumento,
  },
  {
    accessorKey: 'montoTotal',
    header: 'Monto Total',
    id: 'MontoTotal',
    muiTableBodyCellProps: {
      align: 'right',
    },
    accessorFn: (row) => <span> {numberWithCommas(row.montoTotal, {})}</span>,
    size: 150,
  },
  {
    accessorKey: 'usuario',
    header: 'Usuario',
    id: 'usuario',
    accessorFn: (row) => row.usucre,
    size: 95,
  },

  {
    accessorFn: (row) => {
      let label
      let color

      if (row.state === 'ANULADO') {
        label = row.state
        color = 'error'
      } else if (row.state === 'COMPLETADO') {
        label = row.state
        color = 'warning'
      } else {
        label = row.state
        color = 'success'
      }

      // @ts-ignore
      return <Chip label={label} color={color} />
    },
    header: 'Estado',
    id: 'state',
    size: 100,
  },
  {
    accessorKey: 'tipoDocumento',
    header: 'Tipo Documento',
    id: 'tipoDocumento',
    accessorFn: (row) => row.tipoDocumento,
  },
]

/**
 * @description Tabla listado de productos
 * @param props
 * @constructor
 */
const PedidosListado: FunctionComponent<Props> = () => {
  const form = useForm<any>({})

  // ESTADO DATATABLE
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  })
  const [rowCount, setRowCount] = useState(0)
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})

  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState(null)

  const {
    user: { sucursal, puntoVenta },
  } = useAuth()

  const handleOpenModal = (row: any) => {
    setModalData(row)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalData(null)
    refetch()
  }

  // FIN ESTADO DATATABLE

  const { data, isError, isLoading, refetch, isRefetching } = useQuery<any[]>({
    queryKey: [
      'pedidos',
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      const query = genApiQuery(columnFilters)
      const fetchPagination: PageProps = {
        ...PAGE_DEFAULT,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        reverse: sorting.length <= 0,
        query,
      }
      const entidad = {
        codigoSucursal: sucursal.codigo,
        codigoPuntoVenta: puntoVenta.codigo,
      }
      const { pageInfo, docs } = await obtenerListadoPedidos(fetchPagination, entidad)
      setRowCount(pageInfo.totalDocs)
      return docs
    },
    refetchOnWindowFocus: false,
  })

  // Calcular los totales agrupados por sigla
  const totalesPorSigla = useMemo(() => {
    const totales: Record<string, number> = {}
    data?.forEach((row) => {
      const sigla = row.moneda.sigla
      if (!totales[sigla]) {
        totales[sigla] = 0
      }
      totales[sigla] += row.montoTotal
    })
    return totales
  }, [data])

  // Calcular los totales agrupados por tipoDocumento, state y sigla de moneda
  const totalesPorTipoDocumentoStateYSigla = useMemo(() => {
    const totales: Record<string, Record<string, Record<string, number>>> = {}

    data?.forEach((row) => {
      const tipoDocumento = row.tipoDocumento
      const state = row.state
      const siglaMoneda = row.moneda?.sigla

      if (!totales[tipoDocumento]) {
        totales[tipoDocumento] = {}
      }

      if (!totales[tipoDocumento][state]) {
        totales[tipoDocumento][state] = {}
      }

      if (!totales[tipoDocumento][state][siglaMoneda]) {
        totales[tipoDocumento][state][siglaMoneda] = 0
      }

      totales[tipoDocumento][state][siglaMoneda] += row.montoTotal
    })

    return totales
  }, [data])

  const columns = useMemo(() => tableColumns, [])
  const [mostrarTotales, setMostrarTotales] = useState(false)

  const handleMostrarTotales = () => {
    setMostrarTotales(!mostrarTotales)
  }

  return (
    <>
      <Button
        onClick={handleMostrarTotales}
        variant="text"
        color="primary"
        style={{
          marginBottom: '10px',
        }}
      >
        {mostrarTotales ? 'Ocultar Totales' : 'Ver Totales'}
      </Button>
      {mostrarTotales && (
        <TotalesTabla
          totalesPorTipoDocumentoYState={totalesPorTipoDocumentoStateYSigla}
        />
      )}
      <MaterialReactTable
        {...(MuiTableAdvancedOptionsProps as MRT_TableOptions<any>)}
        columns={columns}
        data={data ?? []}
        initialState={{
          showColumnFilters: true,
          columnVisibility: {
            numeroPedido: false,
          },
        }}
        muiToolbarAlertBannerProps={MuiToolbarAlertBannerProps(isError)}
        onColumnFiltersChange={setColumnFilters}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        rowCount={rowCount}
        state={{
          isLoading,
          columnFilters,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
          density: 'compact',
          sorting,
          rowSelection,
        }}
        renderRowActions={({ row }) => (
          <PedidosMenu row={row.original} openModal={handleOpenModal} refetch={refetch} />
        )}
        renderBottomToolbarCustomActions={() => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Object.entries(totalesPorSigla).map(([sigla, total]) => (
              <div key={sigla} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div>
                  Total {numberWithCommas(total, {})} {sigla}
                </div>
              </div>
            ))}
          </div>
        )}
        onRowSelectionChange={setRowSelection}
        renderTopToolbarCustomActions={() => {
          return (
            <>
              <StackMenuActionTable refetch={refetch}></StackMenuActionTable>
            </>
          )
        }}
      />

      {showModal && (
        <ModalPedidoFacturar
          data={modalData}
          onClose={handleCloseModal}
          form={form}
          // Otros props necesarios para el modal
        />
      )}
    </>
  )
}

export default PedidosListado
