import { Delete, Edit } from '@mui/icons-material'
import { Box, Button, Chip, IconButton } from '@mui/material'
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
import { PAGE_DEFAULT, PageProps } from '../../../../interfaces'
import { genApiQuery, genReplaceEmpty } from '../../../../utils/helper'
import { localization } from '../../../../utils/localization'
import {
  DisplayColumnDefOptions,
  MuiSearchTextFieldProps,
  MuiTableHeadCellFilterTextFieldProps,
  MuiTableProps,
  MuiToolbarAlertBannerProps,
} from '../../../../utils/materialReactTableUtils'
import { notSuccess } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiGiftCardEliminar } from '../../api/giftCardEliminar.api'
import { giftCardRouteMap } from '../../GiftCardRoutesMap'
import { GiftCardProps, GiftCardVarianteProps } from '../../interfaces/giftCard.interface'
import { apiGiftCardVariantes } from '../../api/giftCardVariantes.api'
import { apiGiftCardVarianteEliminar } from '../../api/giftCardVarianteEliminar.api'

interface OwnProps {}

type Props = OwnProps

const tableColumns: MRT_ColumnDef<GiftCardVarianteProps>[] = [
  {
    accessorKey: 'codigoProducto',
    header: 'Código',
    id: 'codigoProducto',
  },
  {
    accessorKey: 'giftCard.titulo',
    header: 'Tarjeta Regalo',
    id: 'titulo',
  },
  {
    accessorKey: 'titulo',
    header: 'Título',
    id: 'titulo',
  },
  {
    accessorKey: 'precio',
    header: 'Precio',
    id: 'precio',
  },
  {
    accessorFn: (row) => <Chip size={'small'} label={row.state} color={'success'} />,
    id: 'state',
    header: 'Estado',
  },
]

const GiftCardVariantesListado: FunctionComponent<Props> = (props) => {
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
    GiftCardVarianteProps[]
  >(
    [
      'giftCardTableData',
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
      const { pageInfo, docs } = await apiGiftCardVariantes(fetchPagination)
      setRowCount(pageInfo.totalDocs)
      return docs
    },
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  const columns = useMemo(() => tableColumns, [])

  const handleDeleteData = async (row: GiftCardVarianteProps) => {
    await swalAsyncConfirmDialog({
      text: 'Confirma que desea eliminar los registros seleccionados y sus respectivas variantes, esta operación no se podra revertir',
      preConfirm: () => {
        return apiGiftCardVarianteEliminar(row._id).catch((err) => {
          swalException(err)
          return false
        })
      },
    }).then((resp) => {
      if (resp.isConfirmed) {
        notSuccess()
        setRowSelection({})
        refetch()
      }
    })
  }
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
            <IconButton
              onClick={() =>
                navigate(`${giftCardRouteMap.modificar.path}/${row.original._id}`)
              }
              color={'primary'}
              aria-label="delete"
            >
              <Edit />
            </IconButton>
            <AuditIconButton row={row.original} />
          </div>
        )}
        muiTableHeadCellFilterTextFieldProps={MuiTableHeadCellFilterTextFieldProps}
        enableRowSelection
        onRowSelectionChange={setRowSelection}
        muiTableProps={MuiTableProps}
        displayColumnDefOptions={DisplayColumnDefOptions}
      />
    </>
  )
}

export default GiftCardVariantesListado
