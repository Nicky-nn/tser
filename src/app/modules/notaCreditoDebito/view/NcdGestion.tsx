import {
  DocumentScanner,
  FileOpen,
  LayersClear,
  MenuOpen,
  PictureAsPdf,
} from '@mui/icons-material'
import { Box, Button, Chip, Grid, IconButton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table'
import { FC, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import AuditIconButton from '../../../base/components/Auditoria/AuditIconButton'
import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import SimpleMenu, { SimpleMenuItem } from '../../../base/components/MyMenu/SimpleMenu'
import StackMenu from '../../../base/components/MyMenu/StackMenu'
import StackMenuActionTable, {
  StackMenuItem,
} from '../../../base/components/MyMenu/StackMenuActionTable'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import useAuth from '../../../base/hooks/useAuth'
import { apiEstado, PAGE_DEFAULT, PageProps } from '../../../interfaces'
import { genApiQuery, openInNewTab } from '../../../utils/helper'
import {
  muiTableApiEstado,
  MuiToolbarAlertBannerProps,
} from '../../../utils/muiTable/materialReactTableUtils'
import { MuiTableAdvancedOptionsProps } from '../../../utils/muiTable/muiTableAdvancedOptionsProps'
import { apiNotasCreditoDebito } from '../api/ncd.api'
import { NcdProps } from '../interfaces/ncdInterface'
import { ncdRouteMap } from '../NotaCreditoDebitoRoutesMap'
import AnularNcdDialog from './gestion/AnularNcdDialog'

const tableColumns: MRT_ColumnDef<NcdProps>[] = [
  {
    header: 'Nro. Factura',
    accessorKey: 'numeroFactura',
    size: 140,
  },
  {
    accessorKey: 'fechaEmisionFactura',
    header: 'Fecha FCV',
    id: 'fechaEmisionFactura',
    size: 180,
  },
  {
    accessorKey: 'fechaEmision',
    header: 'Fecha NCD',
    id: 'fechaEmision',
    size: 180,
  },
  {
    header: 'Número NCD',
    accessorKey: 'numeroNotaCreditoDebito',
    size: 140,
  },
  {
    header: 'Razon Social',
    id: 'cliente.razonSocial',
    accessorKey: 'cliente.razonSocial',
    maxSize: 250,
    minSize: 200,
  },
  {
    id: 'cliente.numeroDocumento',
    header: 'Nro. Documento',
    accessorFn: (row) => (
      <span>
        {row.cliente.numeroDocumento}{' '}
        {row.cliente.complemento ? `-${row.cliente.complemento}` : ''}
      </span>
    ),
    filterFn: (row, id, filterValue) =>
      row.original.cliente.numeroDocumento.startsWith(filterValue),
    size: 155,
  },
  {
    accessorKey: 'cuf',
    id: 'cuf',
    header: 'C.U.F.',
  },
  {
    accessorKey: 'montoTotalOriginal',
    header: 'Monto.Original',
    Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
    muiTableBodyCellProps: {
      align: 'right',
    },
  },
  {
    accessorKey: 'montoTotalDevuelto',
    header: 'Monto.Devuelto',
    Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
    muiTableBodyCellProps: {
      align: 'right',
    },
  },
  {
    accessorKey: 'state',
    header: 'Estado',
    accessorFn: (row) => (
      <Chip
        color={
          row.state === apiEstado.validada
            ? 'success'
            : row.state === apiEstado.pendiente
              ? 'warning'
              : 'error'
        }
        label={row.state}
        size={'small'}
      />
    ),
    filterVariant: 'select',
    filterSelectOptions: muiTableApiEstado,
    filterFn: (row, id, filterValue) =>
      row.original.state.toLowerCase().startsWith(filterValue.toLowerCase()),
  },
]

const NcdGestion: FC<any> = () => {
  const [openAnularNcd, setOpenAnularNcd] = useState<{
    open: boolean
    row: NcdProps | null
  }>({ open: false, row: null })

  // DATA TABLE
  const [rowCount, setRowCount] = useState(0)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  })
  // eslint-disable-next-line no-unused-vars
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  // FIN DATA TABLE
  const {
    user: { sucursal, puntoVenta },
  } = useAuth()

  const {
    data: gestionProductos,
    isError,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<NcdProps[]>({
    queryKey: [
      'gestionNotas',
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
      const { pageInfo, docs } = await apiNotasCreditoDebito(
        fetchPagination,
        sucursal.codigo,
        puntoVenta.codigo,
      )
      setRowCount(pageInfo.totalDocs)
      return docs
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
  const columns = useMemo(() => tableColumns, [])

  const table = useMaterialReactTable({
    ...(MuiTableAdvancedOptionsProps as MRT_TableOptions<NcdProps>),
    columns,
    data: gestionProductos ?? [],
    initialState: {
      showColumnFilters: true,
      columnVisibility: {
        cuf: false,
        fechaEmisionFactura: false,
        fechaEmision: false,
      },
    },
    muiToolbarAlertBannerProps: MuiToolbarAlertBannerProps(isError),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: rowCount,
    state: {
      isLoading,
      columnFilters,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      density: 'compact',
      columnPinning: { right: ['actions'] },
      rowSelection,
    },
    renderRowActions: ({ row }) => (
      <Box>
        <SimpleMenu
          menuButton={
            <>
              <IconButton aria-label="Menu">
                <MenuOpen />
              </IconButton>
            </>
          }
        >
          <SimpleMenuItem
            onClick={() => {
              setOpenAnularNcd({
                open: true,
                row: row.original,
              })
            }}
            disabled={row.original.state !== apiEstado.validada}
          >
            <LayersClear /> Anular Documento
          </SimpleMenuItem>

          <SimpleMenuItem
            onClick={() => {
              openInNewTab(row.original.representacionGrafica.pdf)
            }}
          >
            <PictureAsPdf /> Pdf Medio Oficio
          </SimpleMenuItem>

          <SimpleMenuItem
            onClick={() => {
              openInNewTab(row.original.representacionGrafica.xml)
            }}
          >
            <FileOpen /> Xml
          </SimpleMenuItem>

          <SimpleMenuItem
            onClick={() => {
              openInNewTab(row.original.representacionGrafica.sin)
            }}
          >
            <FileOpen /> Url S.I.N.
          </SimpleMenuItem>
        </SimpleMenu>
        <AuditIconButton row={row.original} />
      </Box>
    ),
    renderTopToolbarCustomActions: () => {
      return <StackMenuActionTable refetch={refetch} />
    },
  })

  return (
    <>
      <SimpleContainer>
        <Breadcrumb routeSegments={[ncdRouteMap.gestion]} />

        <StackMenu asideSidebarFixed>
          <StackMenuItem>
            <Button
              startIcon={<DocumentScanner />}
              variant={'contained'}
              component={RouterLink}
              to={ncdRouteMap.nuevo.path}
            >
              {ncdRouteMap.nuevo.name}
            </Button>
          </StackMenuItem>
        </StackMenu>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MaterialReactTable table={table} />
          </Grid>
        </Grid>
      </SimpleContainer>
      <AnularNcdDialog
        keepMounted
        factura={openAnularNcd.row!}
        id={'anularFactura'}
        open={openAnularNcd.open}
        onClose={async (resp: boolean) => {
          setOpenAnularNcd({
            open: false,
            row: null,
          })
          if (resp) {
            await refetch()
          }
        }}
      />
    </>
  )
}

export default NcdGestion
