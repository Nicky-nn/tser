import { HowToReg } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table'
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table'
import React, { FunctionComponent, useMemo, useState } from 'react'

import { PAGE_DEFAULT, PageProps } from '../../../interfaces'
import { genApiQuery } from '../../../utils/helper'
import { MuiToolbarAlertBannerProps } from '../../../utils/muiTable/materialReactTableUtils'
import { MuiTableAdvancedOptionsProps } from '../../../utils/muiTable/muiTableAdvancedOptionsProps'
import { fetchClienteListado } from '../api/clienteListado.api'
import { ClienteProps } from '../interfaces/cliente'

const tableColumns: MRT_ColumnDef<ClienteProps>[] = [
  {
    accessorKey: 'codigoCliente',
    header: 'Código Cliente',
    size: 120,
  },
  {
    accessorKey: 'razonSocial',
    header: 'Razon Social',
  },
  {
    accessorFn: (row) =>
      `${row.numeroDocumento}${row.complemento ? `-${row.complemento}` : ''}`,
    id: 'numeroDocumento',
    header: 'Nro. Documento',
    size: 120,
  },
  {
    id: 'email',
    header: 'Correo',
    accessorKey: 'email',
  },
  {
    accessorKey: 'tipoDocumentoIdentidad.descripcion',
    id: 'tipoDocumentoIdentidad.descripcion',
    header: 'Tipo Documento',
  },
]

interface OwnProps {
  setRowCliente: React.Dispatch<React.SetStateAction<ClienteProps | null>>
}

type Props = OwnProps

const ClientesListadoDialog: FunctionComponent<Props> = (props) => {
  const { setRowCliente } = props
  // DATA TABLE
  const [rowCount, setRowCount] = useState(0)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  })
  // FIN DATA TABLE
  const {
    data: clientes,
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      'client',
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
      const { pageInfo, docs } = await fetchClienteListado(fetchPagination)
      setRowCount(pageInfo.totalDocs)
      return docs
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
  const columns = useMemo<MRT_ColumnDef<ClienteProps>[]>(() => tableColumns, [])

  return (
    <>
      <MaterialReactTable
        {...(MuiTableAdvancedOptionsProps as MRT_TableOptions<ClienteProps>)}
        columns={columns}
        data={clientes ?? []}
        initialState={{ showColumnFilters: true }}
        muiToolbarAlertBannerProps={MuiToolbarAlertBannerProps(isError)}
        onColumnFiltersChange={setColumnFilters}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        rowCount={rowCount ?? 0}
        state={{
          columnFilters,
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isFetching,
          sorting,
          density: 'compact',
        }}
        renderRowActions={({ row }) => (
          <div>
            <Button
              startIcon={<HowToReg />}
              variant="outlined"
              color="primary"
              size={'small'}
              onClick={() => {
                setRowCliente(row.original)
              }}
            >
              Utilizar
            </Button>
          </div>
        )}
      />
    </>
  )
}

export default ClientesListadoDialog
