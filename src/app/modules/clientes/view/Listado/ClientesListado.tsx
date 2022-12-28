import { Delete, Edit, PersonAddAltSharp } from '@mui/icons-material'
import { Box, Button, Chip, IconButton, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import React, { FunctionComponent, useMemo, useState } from 'react'

import AuditIconButton from '../../../../base/components/Auditoria/AuditIconButton'
import { PAGE_DEFAULT, PageProps } from '../../../../interfaces'
import { genApiQuery } from '../../../../utils/helper'
import { localization } from '../../../../utils/localization'
import { notDanger, notSuccess } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { fetchClienteListado } from '../../api/clienteListado.api'
import { apiClientesEliminar } from '../../api/clientesEliminar.api'
import { ClienteProps } from '../../interfaces/cliente'
import ClienteModificarDialog from '../ClienteModificarDialog'
import ClienteRegistroDialog from '../ClienteRegistroDialog'

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
  const [open, setOpen] = useState(false)
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
  const [openDialog, setOpenDialog] = useState(false)
  const [cliente, setCliente] = useState<ClienteProps | null>(null)

  const {
    data: clientes,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    ['client', columnFilters, pagination.pageIndex, pagination.pageSize, sorting],
    async () => {
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
    { keepPreviousData: true },
  )
  const columns = useMemo(() => tableColumns, [])

  const handleDeleteData = async (original: any) => {
    const data = Object.keys(rowSelection)
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
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        justifyContent="right"
        sx={{ marginBottom: 3 }}
      >
        <Button
          size={'small'}
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<PersonAddAltSharp />}
          color={'primary'}
        >
          {' '}
          Nuevo Cliente
        </Button>
        <Button
          size={'small'}
          variant="contained"
          onClick={() => notDanger('Opcion aun no disponible')}
          color={'primary'}
        >
          Nuevo Cliente Extranjero
        </Button>
      </Stack>

      <MaterialReactTable
        columns={columns}
        data={clientes ?? []}
        initialState={{ showColumnFilters: false }}
        manualFiltering
        manualPagination
        manualSorting
        enableDensityToggle={false}
        enableGlobalFilter={false}
        localization={localization}
        enableRowNumbers={true}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: 'error',
                children: 'Error loading data',
              }
            : undefined
        }
        onColumnFiltersChange={setColumnFilters}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        rowCount={rowCount}
        state={{
          columnFilters,
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isFetching,
          sorting,
          density: 'compact',
          rowSelection,
        }}
        enableRowActions
        positionActionsColumn={'last'}
        renderRowActions={({ row }) => {
          return (
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
              {!['99002', '99003'].includes(row.original.numeroDocumento) && (
                <IconButton
                  onClick={() => {
                    setCliente(row.original)
                    setOpenDialog(true)
                  }}
                  color={'primary'}
                  aria-label="delete"
                >
                  <Edit />
                </IconButton>
              )}
              <AuditIconButton row={row.original} />
            </div>
          )
        }}
        muiTableHeadCellFilterTextFieldProps={{
          sx: { m: '0.5rem 0', width: '95%' },
          variant: 'outlined',
          size: 'small',
        }}
        getRowId={(row) => row.codigoCliente}
        onRowSelectionChange={setRowSelection}
        enableRowSelection
        enableSelectAll={false}
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

      {cliente && (
        <ClienteModificarDialog
          id={'clienteModificar'}
          keepMounted
          open={openDialog}
          cliente={cliente!}
          onClose={(value?: ClienteProps) => {
            if (value) {
              refetch().then()
            }
            setCliente(null)
            setOpenDialog(false)
          }}
        />
      )}

      <ClienteRegistroDialog
        id={'clienteRegistroDialog'}
        keepMounted
        open={open}
        onClose={(value?: ClienteProps) => {
          if (value) {
            refetch().then()
          }
          setOpen(false)
        }}
      />
    </>
  )
}
export default ClientesListado
