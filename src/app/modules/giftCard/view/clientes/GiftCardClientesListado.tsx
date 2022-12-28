import { Edit } from '@mui/icons-material'
import { Box, Button, Chip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
} from '@tanstack/react-table'
import { SortingState } from '@tanstack/react-table'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import React, { FunctionComponent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AuditIconButton from '../../../../base/components/Auditoria/AuditIconButton'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import { PAGE_DEFAULT, PageProps } from '../../../../interfaces'
import { genApiQuery } from '../../../../utils/helper'
import { localization } from '../../../../utils/localization'
import {
  DisplayColumnDefOptions,
  MuiSearchTextFieldProps,
  MuiTableHeadCellFilterTextFieldProps,
  MuiTableProps,
  MuiToolbarAlertBannerProps,
} from '../../../../utils/materialReactTableUtils'
import { apiGiftCardClientes } from '../../api/giftCardsClientes.api'
import { GiftCardClienteProps } from '../../interfaces/giftCardCliente.interface'

interface OwnProps {}

type Props = OwnProps

const tableColumns: MRT_ColumnDef<GiftCardClienteProps>[] = [
  {
    accessorKey: 'codigoProducto',
    header: 'Código',
    id: 'codigoProducto',
    size: 150,
  },
  {
    accessorKey: 'titulo',
    header: 'Titulo',
    id: 'titulo',
    size: 400,
  },
  {
    accessorKey: 'cliente.razonSocial',
    header: 'Cliente',
    id: 'cliente.razonSocial',
    size: 250,
  },
  {
    accessorKey: 'precio',
    header: 'Monto Carga',
    muiTableBodyCellProps: {
      align: 'right',
    },
    id: 'precio',
    Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'saldo',
    header: 'Saldo',
    id: 'saldo',
    muiTableBodyCellProps: {
      align: 'right',
    },
    Cell: ({ cell }) => (
      <Chip
        size={'small'}
        label={numberWithCommas(cell.getValue() as number, {})}
        color={'info'}
      />
    ),
    enableColumnFilter: false,
  },

  {
    accessorFn: (row) => <Chip size={'small'} label={row.state} color={'success'} />,
    id: 'state',
    header: 'Estado',
  },
]

const GiftCardClientesListado: FunctionComponent<Props> = (props) => {
  const navigate = useNavigate()

  // ESTADO DATATABLE
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  })
  const [rowCount, setRowCount] = useState(0)
  const [isRefetching, setIsRefetching] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  // FIN ESTADO DATATABLE

  const { data, isError, isFetching, isLoading, refetch } = useQuery<
    GiftCardClienteProps[]
  >(
    [
      'giftCardClientesTableData',
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    async () => {
      const query = genApiQuery(columnFilters)
      const fetchPagination: PageProps = {
        ...PAGE_DEFAULT,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        reverse: sorting.length <= 0,
        query,
      }
      const { pageInfo, docs } = await apiGiftCardClientes(fetchPagination)
      setRowCount(pageInfo.totalDocs)
      return docs
    },
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  const columns = useMemo(() => tableColumns, [])

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data ?? []}
        initialState={{ showColumnFilters: true }}
        manualFiltering
        manualPagination
        manualSorting
        muiToolbarAlertBannerProps={MuiToolbarAlertBannerProps(isError)}
        onColumnFiltersChange={setColumnFilters}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        enableDensityToggle={false}
        enableGlobalFilter={false}
        rowCount={rowCount}
        localization={localization}
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
        muiSearchTextFieldProps={MuiSearchTextFieldProps}
        enableRowActions
        positionActionsColumn={'first'}
        renderRowActions={({ row }) => (
          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem', width: 100 }}>
            <AuditIconButton row={row.original} />
          </div>
        )}
        muiTableHeadCellFilterTextFieldProps={MuiTableHeadCellFilterTextFieldProps}
        enableRowSelection
        onRowSelectionChange={setRowSelection}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                color="info"
                onClick={() => console.log(table.getSelectedRowModel().flatRows)}
                startIcon={<Edit />}
                variant="contained"
                size={'small'}
                disabled={table.getSelectedRowModel().flatRows.length === 0}
              >
                Rectificar
              </Button>
            </Box>
          )
        }}
        muiTableProps={MuiTableProps}
        displayColumnDefOptions={DisplayColumnDefOptions}
      />
    </>
  )
}

export default GiftCardClientesListado
