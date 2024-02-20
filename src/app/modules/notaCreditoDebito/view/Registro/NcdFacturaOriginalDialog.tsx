import { FileOpen, MenuOpen, PictureAsPdf } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table'
import React, { FunctionComponent, useMemo, useState } from 'react'

import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import SimpleMenu, { SimpleMenuItem } from '../../../../base/components/MyMenu/SimpleMenu'
import { PAGE_DEFAULT, PageProps } from '../../../../interfaces'
import { genApiQuery, openInNewTab } from '../../../../utils/helper'
import { MuiToolbarAlertBannerProps } from '../../../../utils/muiTable/materialReactTableUtils'
import { MuiTableAdvancedOptionsProps } from '../../../../utils/muiTable/muiTableAdvancedOptionsProps'
import { fetchFacturaListado } from '../../../ventas/api/factura.listado.api'
import { FacturaProps } from '../../../ventas/interfaces/factura'

const tableColumns: MRT_ColumnDef<FacturaProps>[] = [
  {
    header: 'Número',
    accessorKey: 'numeroFactura',
    size: 120,
  },
  {
    accessorKey: 'fechaEmision',
    header: 'Fecha Emisión',
    id: 'fechaEmision',
    size: 150,
    enableColumnFilter: false,
  },
  {
    header: 'Importe',
    accessorKey: 'montoTotal',
    muiTableBodyCellProps: {
      align: 'right',
    },
    Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
    size: 100,
    enableColumnFilter: false,
  },
  {
    header: 'Razon Social',
    id: 'cliente.razonSocial',
    accessorKey: 'cliente.razonSocial',
    maxSize: 180,
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
  },
  {
    accessorKey: 'cuf',
    id: 'cuf',
    header: 'C.U.F.',
  },
  {
    accessorKey: 'state',
    id: 'state',
    header: 'ESTADO',
  },
]

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: FacturaProps) => void
}

type Props = OwnProps

/**
 * @description Dialogo para seleccionar la factura original
 * @param props
 * @constructor
 */
const NcdFacturaOriginalDialog: FunctionComponent<Props> = (props) => {
  const theme = useTheme()
  const { onClose, open, ...other } = props

  const handleCancel = () => {
    onClose()
  }

  // ESTADO DATATABLE
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: 5,
  })
  const [rowCount, setRowCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  // FIN ESTADO DATATABLE

  const { data, isError, isLoading, refetch, isRefetching } = useQuery<FacturaProps[]>({
    queryKey: [
      'NcdGestionFacturas',
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      const query = genApiQuery(columnFilters, ['state=VALIDADA'])
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
  })
  const columns = useMemo(() => tableColumns, [])

  const setNotaCreditoDebito = (factura: FacturaProps) => {
    onClose(factura)
  }

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 650 } }}
        maxWidth="lg"
        open={open}
        {...other}
      >
        <DialogTitle>Seleccione su factura</DialogTitle>
        <DialogContent dividers>
          <MaterialReactTable
            {...(MuiTableAdvancedOptionsProps as MRT_TableOptions<FacturaProps>)}
            columns={columns}
            data={data ?? []}
            initialState={{
              showColumnFilters: true,
              columnVisibility: { cuf: false, state: false },
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
              <>
                <SimpleMenu
                  menuButton={
                    <>
                      <IconButton aria-label="delete">
                        <MenuOpen />
                      </IconButton>
                    </>
                  }
                >
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
                <Button
                  size={'small'}
                  variant={'contained'}
                  color={'info'}
                  onClick={() => setNotaCreditoDebito(row.original)}
                >
                  Seleccionar
                </Button>
              </>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            size={'small'}
            variant={'contained'}
            onClick={handleCancel}
            sx={{ mr: 2 }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default NcdFacturaOriginalDialog
