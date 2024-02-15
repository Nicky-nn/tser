import { ImportExport } from '@mui/icons-material'
import { Box, Button, Chip, Grid, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table'
import React, { FC, useMemo, useState } from 'react'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import StackMenu from '../../../base/components/MyMenu/StackMenu'
import StackMenuActionTable, {
  StackMenuItem,
} from '../../../base/components/MyMenu/StackMenuActionTable'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import { apiEstado, PAGE_DEFAULT, PageProps } from '../../../interfaces'
import { genApiQuery } from '../../../utils/helper'
import {
  DCDO,
  DcdoProps,
  MuiFilterTextFieldProps,
  MuiSearchTextFieldProps,
  MuiTableAdvancedOptionsProps,
  muiTableApiEstado,
  MuiTableBasicOptionsProps,
  MuiTableProps,
  MuiToolbarAlertBannerProps,
} from '../../../utils/materialReactTableUtils'
import { fetchFacturaListado } from '../api/factura.listado.api'
import { FacturaProps } from '../interfaces/factura'
import AnularDocumentoDialog from './VentaGestion/AnularDocumentoDialog'
import MisVentasDialog from './VentaGestion/MisVentasDialog'
import ReenviarEmailsDialog from './VentaGestion/ReenviarEmailsDialog'
import VentaGestionExportarDetalleDialog from './VentaGestion/VentaGestionExportarDetalleDialog'
import VentaGestionExportarDialog from './VentaGestion/VentaGestionExportarDialog'
import VentaGestionMenu from './VentaGestion/VentaGestionMenu'

const tableColumns: MRT_ColumnDef<FacturaProps>[] = [
  {
    header: 'Nro. Factura',
    accessorKey: 'numeroFactura',
    size: 130,
  },
  {
    accessorKey: 'fechaEmision',
    header: 'Fecha Emisión',
    id: 'fechaEmision',
    enableColumnFilter: false,
    size: 160,
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
    maxSize: 150,
  },
  {
    header: 'Importe',
    accessorKey: 'montoTotal',
    muiTableBodyCellProps: {
      align: 'right',
    },
    Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
    size: 150,
    enableColumnFilter: false,
  },
  {
    header: 'Monto Moneda',
    accessorKey: 'montoTotalMoneda',
    muiTableBodyCellProps: {
      align: 'right',
    },
    accessorFn: (row) => <span> {numberWithCommas(row.montoTotalMoneda, {})}</span>,
    size: 150,
    enableColumnFilter: false,
  },
  {
    header: 'Moneda',
    accessorKey: 'moneda.descripcion',
    accessorFn: (row) => <strong>{row.moneda.descripcion}</strong>,
    size: 110,
    enableColumnFilter: false,
  },
  {
    header: 'Tipo Cambio',
    accessorKey: 'tipoCambio',
    size: 130,
    muiTableBodyCellProps: {
      align: 'right',
    },
    accessorFn: (row) => <span> {numberWithCommas(row.tipoCambio, {})}</span>,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'cuf',
    id: 'cuf',
    header: 'C.U.F.',
  },
  {
    accessorKey: 'usuario',
    id: 'usuario',
    header: 'Usuario',
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

const VentaGestion: FC<any> = () => {
  const theme = useTheme()
  const [openAnularDocumento, setOpenAnularDocumento] = useState(false)
  const [factura, setFactura] = useState<FacturaProps | null>(null)
  const [openExport, setOpenExport] = useState(false)
  const [openExportDetalle, setOpenExportDetalle] = useState(false)
  const [openReenviarEmails, setOpenReenviarEmails] = useState(false)
  const [openMisVentas, setOpenMisVentas] = useState(false)
  // DATA TABLE
  const [rowCount, setRowCount] = useState(0)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  // FIN DATA TABLE

  const {
    data: gestionProductos,
    isError,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<FacturaProps[]>({
    queryKey: [
      'gestionFacturas',
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
      const { pageInfo, docs } = await fetchFacturaListado(fetchPagination)
      setRowCount(pageInfo.totalDocs)
      return docs
    },
    refetchOnWindowFocus: false,
  })

  const columns = useMemo(() => tableColumns, [])

  return (
    <>
      <SimpleContainer>
        <div className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              { name: 'Ventas', path: '/ventas/gestion' },
              { name: 'Gestión de Ventas' },
            ]}
          />
        </div>

        <StackMenu>
          <StackMenuItem>
            <Button
              size={'small'}
              startIcon={<ImportExport />}
              onClick={() => setOpenMisVentas(true)}
              variant={'outlined'}
            >
              MIS VENTAS
            </Button>
          </StackMenuItem>
          <StackMenuItem>
            <Button
              size={'small'}
              startIcon={<ImportExport />}
              onClick={() => setOpenExport(true)}
              variant={'outlined'}
            >
              EXPORTAR
            </Button>
          </StackMenuItem>
          <StackMenuItem>
            <Button
              size={'small'}
              startIcon={<ImportExport />}
              onClick={() => setOpenExportDetalle(true)}
              variant={'outlined'}
            >
              EXPORTAR DETALLES
            </Button>
          </StackMenuItem>
        </StackMenu>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MaterialReactTable
              {...(MuiTableAdvancedOptionsProps(theme) as MRT_TableOptions<FacturaProps>)}
              columns={columns} //must be memoized
              data={gestionProductos || []} //must be memoized
              initialState={{
                showColumnFilters: true,
                columnVisibility: {
                  cuf: false,
                  montoTotal: false,
                  tipoCambio: false,
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
                sorting,
                density: 'compact',
                columnPinning: { right: ['actions'] },
                rowSelection,
              }}
              displayColumnDefOptions={DCDO as DcdoProps<FacturaProps>}
              renderRowActions={({ row }) => (
                <VentaGestionMenu
                  row={row.original}
                  refetch={refetch}
                  setOpenReenviarEmails={setOpenReenviarEmails}
                  setOpenAnularDocumento={setOpenAnularDocumento}
                  setFactura={setFactura}
                />
              )}
              renderTopToolbarCustomActions={({ table }) => {
                return <StackMenuActionTable refetch={refetch} />
              }}
              muiTableProps={MuiTableProps}
            />
          </Grid>
        </Grid>
        <Box py="12px" />
      </SimpleContainer>

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

      <VentaGestionExportarDialog
        id={'ventaGestionExportar'}
        keepMounted={true}
        open={openExport}
        onClose={() => {
          setOpenExport(false)
        }}
      />

      <VentaGestionExportarDetalleDialog
        id={'ventaGestionExportarDetalle'}
        keepMounted={true}
        open={openExportDetalle}
        onClose={() => {
          setOpenExportDetalle(false)
        }}
      />

      <MisVentasDialog
        id={'misVentasDialog'}
        keepMounted={false}
        open={openMisVentas}
        onClose={() => {
          setOpenMisVentas(false)
        }}
      />

      <ReenviarEmailsDialog
        id={'reenviarEmails'}
        keepMounted={true}
        open={openReenviarEmails}
        onClose={() => {
          setFactura(null)
          setOpenReenviarEmails(false)
        }}
        factura={factura}
      />
    </>
  )
}

export default VentaGestion
