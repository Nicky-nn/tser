import { Delete, PersonAddAltSharp } from '@mui/icons-material'
import { Box, Button, Chip, Stack } from '@mui/material'
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
import React, { FunctionComponent, useMemo, useState } from 'react'

import StackMenu from '../../../../base/components/MyMenu/StackMenu'
import { PAGE_DEFAULT, PageProps } from '../../../../interfaces'
import { genApiQuery } from '../../../../utils/helper'
import { MuiToolbarAlertBannerProps } from '../../../../utils/muiTable/materialReactTableUtils'
import { MuiTableAdvancedOptionsProps } from '../../../../utils/muiTable/muiTableAdvancedOptionsProps'
import { notDanger, notSuccess } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { fetchClienteListado } from '../../api/clienteListado.api'
import { apiClientesEliminar } from '../../api/clientesEliminar.api'
import { ClienteProps } from '../../interfaces/cliente'
import Cliente99001RegistroDialog from '../registro/Cliente99001RegistroDialog'
import ClienteRegistroDialog from '../registro/ClienteRegistroDialog'
import ClientesMenu from './ClientesMenu'

interface OwnProps {}

type Props = OwnProps

const tableColumns: MRT_ColumnDef<ClienteProps>[] = [
  {
    accessorKey: 'codigoCliente',
    header: 'Código Cliente',
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
  {
    accessorFn: (row) => <Chip size={'small'} label={row.state} color={'success'} />,
    id: 'state',
    header: 'Estado',
  },
]

const ClientesListado: FunctionComponent<Props> = (props) => {
  const [openClienteRegistro, setOpenClienteRegistro] = useState(false)
  const [openCliente99001Registro, setOpenCliente99001Registro] = useState(false)
  // DATA TABLE
  const [rowCount, setRowCount] = useState(0)
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  })
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})

  const {
    data: clientes,
    isError,
    isLoading,
    isFetching,
    refetch,
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
    refetchInterval: false,
  })
  const columns = useMemo(() => tableColumns, [])

  const handleDeleteData = async (original: any) => {
    const data = original.map((o: any) => o.original.codigoCliente)
    if (data.length === 0) {
      notDanger('No se ha seleccionado ningun registro, vuelva a intentar')
      return
    }
    await swalAsyncConfirmDialog({
      text: 'Confirma que desea eliminar los registros seleccionados y sus respectivas variantes, esta operación no se podra revertir',
      preConfirm: () => {
        return apiClientesEliminar(data).catch((err) => {
          swalException(err)
          return false
        })
      },
    }).then((resp) => {
      if (resp.isConfirmed) {
        notSuccess()
        setRowSelection({})
        refetch().then()
      }
    })
  }

  return (
    <>
      <StackMenu asideSidebarFixed>
        <Button
          size={'small'}
          variant="contained"
          onClick={() => setOpenClienteRegistro(true)}
          startIcon={<PersonAddAltSharp />}
          color={'primary'}
        >
          {' '}
          Nuevo Cliente
        </Button>
        <Button
          size={'small'}
          variant="contained"
          onClick={() => setOpenCliente99001Registro(true)}
          color={'secondary'}
        >
          Nuevo Cliente (99001)
        </Button>
      </StackMenu>

      <MaterialReactTable
        {...(MuiTableAdvancedOptionsProps as MRT_TableOptions<ClienteProps>)}
        columns={columns}
        data={clientes ?? []}
        initialState={{ showColumnFilters: false }}
        muiToolbarAlertBannerProps={MuiToolbarAlertBannerProps(isError)}
        onColumnFiltersChange={setColumnFilters}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        rowCount={rowCount}
        enableRowSelection={true}
        state={{
          isLoading,
          columnFilters,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isFetching,
          sorting,
          density: 'compact',
          rowSelection,
        }}
        renderRowActions={({ row }) => (
          <ClientesMenu row={row.original} refetch={refetch} />
        )}
        onRowSelectionChange={setRowSelection}
        muiSelectCheckboxProps={({ row }) => ({
          disabled: ['99003', '99002'].includes(row.getValue('numeroDocumento')),
        })}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                color="error"
                onClick={() => handleDeleteData(table.getSelectedRowModel().flatRows)}
                startIcon={<Delete />}
                variant="contained"
                size={'small'}
                disabled={table.getSelectedRowModel().flatRows.length === 0}
              >
                Eliminar
              </Button>
            </Box>
          )
        }}
      />
      <ClienteRegistroDialog
        id={'clienteRegistroDialgo'}
        keepMounted={false}
        open={openClienteRegistro}
        onClose={(resp?: ClienteProps) => {
          if (resp) {
            refetch().then()
          }
          setOpenClienteRegistro(false)
        }}
      />
      <Cliente99001RegistroDialog
        id={'cliente99001Registro'}
        keepMounted={false}
        open={openCliente99001Registro}
        onClose={(resp?: ClienteProps) => {
          setOpenCliente99001Registro(false)
          if (resp) {
            refetch().then()
          }
        }}
      />
    </>
  )
}
export default ClientesListado
