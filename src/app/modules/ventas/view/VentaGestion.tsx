import {
  FileOpen,
  ImportExport,
  LayersClear,
  MenuOpen,
  PictureAsPdf,
} from '@mui/icons-material';
import { Button, Chip, Grid, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React, { FC, useMemo, useState } from 'react';

import AuditIconButton from '../../../base/components/Auditoria/AuditIconButton';
import SimpleContainer from '../../../base/components/Container/SimpleContainer';
import { SimpleItem } from '../../../base/components/Container/SimpleItem';
import SimpleRowMenu from '../../../base/components/Container/SimpleRow';
import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput';
import SimpleMenu, { StyledMenuItem } from '../../../base/components/MyMenu/SimpleMenu';
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb';
import { apiEstado, PAGE_DEFAULT, PageProps } from '../../../interfaces';
import { genApiQuery, openInNewTab } from '../../../utils/helper';
import { localization } from '../../../utils/localization';
import {
  muiTableApiEstado,
  muiTableHeadCellFilterTextFieldProps,
} from '../../../utils/materialReactTableUtils';
import { fetchFacturaListado } from '../api/factura.listado.api';
import { FacturaProps } from '../interfaces/factura';
import AnularDocumentoDialog from './VentaGestion/AnularDocumentoDialog';
import VentaGestionExportarDialog from './VentaGestion/VentaGestionExportarDialog';
import VentaGestionExportarDetalleDialog from './VentaGestion/VentaGestionExportarDetalleDialog';

const tableColumns: MRT_ColumnDef<FacturaProps>[] = [
  {
    header: 'Nro. Factura',
    accessorKey: 'numeroFactura',
    size: 50,
  },
  {
    accessorKey: 'fechaEmision',
    header: 'Fecha Emisión',
    id: 'fechaEmision',
    enableColumnFilter: false,
  },
  {
    header: 'Razon Social',
    id: 'cliente.razonSocial',
    accessorKey: 'cliente.razonSocial',
    maxSize: 80,
    minSize: 20,
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
    header: 'Importe',
    accessorKey: 'montoTotal',
    muiTableBodyCellProps: {
      align: 'right',
    },
    Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
    size: 50,
    enableColumnFilter: false,
  },
  {
    header: 'Monto Moneda',
    accessorKey: 'montoTotalMoneda',
    muiTableBodyCellProps: {
      align: 'right',
    },
    accessorFn: (row) => <span> {numberWithCommas(row.montoTotalMoneda, {})}</span>,
    size: 50,
    enableColumnFilter: false,
  },
  {
    header: 'Moneda',
    accessorKey: 'moneda.descripcion',
    accessorFn: (row) => <strong>{row.moneda.descripcion}</strong>,
    size: 50,
    enableColumnFilter: false,
  },
  {
    header: 'Tipo Cambio',
    accessorKey: 'tipoCambio',
    size: 30,
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
];

const VentaGestion: FC<any> = () => {
  const [openAnularDocumento, setOpenAnularDocumento] = useState(false);
  const [factura, setFactura] = useState<FacturaProps | null>(null);
  const [openExport, setOpenExport] = useState(false);
  const [openExportDetalle, setOpenExportDetalle] = useState(false);
  // DATA TABLE
  const [rowCount, setRowCount] = useState(0);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  // FIN DATA TABLE

  const {
    data: gestionProductos,
    isError,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<FacturaProps[]>(
    [
      'gestionFacturas',
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    async () => {
      const query = genApiQuery(columnFilters);
      const fetchPagination: PageProps = {
        ...PAGE_DEFAULT,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        reverse: sorting.length <= 0,
        query,
      };
      const { pageInfo, docs } = await fetchFacturaListado(fetchPagination);
      setRowCount(pageInfo.totalDocs);
      return docs;
    },
  );
  const columns = useMemo(() => tableColumns, []);
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

        <SimpleRowMenu>
          <SimpleItem>
            <Button
              size={'small'}
              startIcon={<ImportExport />}
              onClick={() => setOpenExport(true)}
              variant={'outlined'}
            >
              EXPORTAR
            </Button>
          </SimpleItem>

          <SimpleItem>
            <Button
              size={'small'}
              startIcon={<ImportExport />}
              onClick={() => setOpenExportDetalle(true)}
              variant={'outlined'}
            >
              EXPORTAR DETALLES
            </Button>
          </SimpleItem>
        </SimpleRowMenu>

        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xs={12}>
            <MaterialReactTable
              columns={columns} //must be memoized
              data={gestionProductos ?? []} //must be memoized
              initialState={{
                showColumnFilters: true,
                columnVisibility: {
                  cuf: false,
                  montoTotal: false,
                },
              }}
              manualFiltering
              manualPagination
              manualSorting
              muiToolbarAlertBannerProps={
                isError
                  ? {
                      color: 'error',
                      children: 'Error Cargando Datos',
                    }
                  : undefined
              }
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
                sorting,
                density: 'compact',
                columnPinning: { right: ['actions'] },
                rowSelection,
              }}
              enableRowActions
              positionActionsColumn="first"
              renderRowActions={({ row }) => (
                <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
                  <AuditIconButton row={row.original} />

                  <SimpleMenu
                    menuButton={
                      <>
                        <IconButton aria-label="delete">
                          <MenuOpen />
                        </IconButton>
                      </>
                    }
                  >
                    <StyledMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenAnularDocumento(true);
                        setFactura(row.original);
                      }}
                    >
                      <LayersClear /> Anular Documento
                    </StyledMenuItem>

                    <StyledMenuItem
                      onClick={() => {
                        openInNewTab(row.original.representacionGrafica.pdf);
                      }}
                    >
                      <PictureAsPdf /> Pdf Medio Oficio
                    </StyledMenuItem>

                    <StyledMenuItem
                      onClick={() => {
                        openInNewTab(row.original.representacionGrafica.xml);
                      }}
                    >
                      <FileOpen /> Xml
                    </StyledMenuItem>

                    <StyledMenuItem
                      onClick={() => {
                        openInNewTab(row.original.representacionGrafica.sin);
                      }}
                    >
                      <FileOpen /> Url S.I.N.
                    </StyledMenuItem>
                  </SimpleMenu>
                </div>
              )}
              muiTableHeadCellFilterTextFieldProps={{
                ...muiTableHeadCellFilterTextFieldProps,
              }}
            />
          </Grid>
        </Grid>
        <Box py="12px" />
        <AnularDocumentoDialog
          id={'anularDocumentoDialog'}
          open={openAnularDocumento}
          keepMounted
          factura={factura}
          onClose={async (val) => {
            if (val) {
              await refetch();
            }
            setFactura(null);
            setOpenAnularDocumento(false);
          }}
        />
      </SimpleContainer>

      <VentaGestionExportarDialog
        id={'ventaGestionExportar'}
        keepMounted={true}
        open={openExport}
        onClose={() => {
          setOpenExport(false);
          console.log('saliendo');
        }}
      />

      <VentaGestionExportarDetalleDialog
        id={'ventaGestionExportarDetalle'}
        keepMounted={true}
        open={openExportDetalle}
        onClose={() => {
          setOpenExportDetalle(false);
          console.log('saliendo exportación detalle');
        }}
      />
    </>
  );
};

export default VentaGestion;
