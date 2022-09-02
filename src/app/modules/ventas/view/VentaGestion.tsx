import { FileOpen, LayersClear, MenuOpen, PictureAsPdf } from '@mui/icons-material';
import { Chip, Grid, IconButton } from '@mui/material';
import { Box, styled } from '@mui/system';
import { PaginationState, SortingState } from '@tanstack/react-table';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React, { FC, useEffect, useMemo, useState } from 'react';

import AlertError from '../../../base/components/Alert/AlertError';
import AuditIconButton from '../../../base/components/Auditoria/AuditIconButton';
import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput';
import SimpleMenu, { StyledMenuItem } from '../../../base/components/MyMenu/SimpleMenu';
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb';
import { apiEstado, PAGE_DEFAULT, PageProps } from '../../../interfaces';
import { isEmptyValue, openInNewTab } from '../../../utils/helper';
import { localization } from '../../../utils/localization';
import { swalException } from '../../../utils/swal';
import { fetchFacturaListado } from '../api/factura.listado.api';
import { FacturaProps } from '../interfaces/factura';
import AnularDocumentoDialog from './VentaGestion/AnularDocumentoDialog';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: {
    margin: '16px',
  },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '16px',
    },
  },
}));

const tableColumns: MRT_ColumnDef<FacturaProps>[] = [
  {
    header: 'Nro. Factura',
    accessorKey: 'numeroFactura',
    size: 50,
    muiTableBodyCellProps: {
      align: 'center',
    },
  },
  {
    accessorKey: 'fechaEmision',
    header: 'Fecha Emisión',
    id: 'fechaEmision',
  },
  {
    header: 'Importe',
    accessorKey: 'montoTotal',
    muiTableBodyCellProps: {
      align: 'center',
    },
    Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
    size: 50,
    enableColumnFilter: false,
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
    header: 'Razon Social',
    id: 'razonSocial',
    accessorFn: (row) => <span>{row.cliente.razonSocial}</span>,
    maxSize: 80,
    minSize: 20,
    size: 10,
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
    filterFn: (row, id, filterValue) =>
      row.original.state.toLowerCase().startsWith(filterValue.toLowerCase()),
  },
];

const VentaGestion: FC<any> = () => {
  const [remoteData, setRemoteData] = useState<FacturaProps[]>([]);
  const columns = useMemo(() => tableColumns, []);
  const [isLoading, setIsLoading] = useState(false);
  const [openAnularDocumento, setOpenAnularDocumento] = useState(false);
  const [factura, setFactura] = useState<FacturaProps | null>(null);
  const [isError, setIsError] = useState<any>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  });
  const [rowCount, setRowCount] = useState(0);
  const [isRefetching, setIsRefetching] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const fetchData = async () => {
    try {
      if (!remoteData.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
      setIsLoading(true);
      const fetchPagination: PageProps = {
        ...PAGE_DEFAULT,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        reverse: sorting.length <= 0,
        query: !isEmptyValue(globalFilter) ? `cliente.razonSocial=${globalFilter}` : '',
      };
      const response = await fetchFacturaListado(fetchPagination);
      const data = response.docs;
      const pageInfo = response.pageInfo;
      setRowCount(pageInfo.totalDocs);
      setRemoteData(data);
      setIsLoading(false);
      setIsError(null);
      setIsRefetching(false);
    } catch (e: any) {
      swalException(e);
      setIsError(e.message);
    }
  };

  useEffect(() => {
    fetchData().then();
  }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter]);

  if (isError) {
    return <AlertError mensaje={isError} />;
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Ventas', path: '/ventas/gestion' },
            { name: 'Gestión de Ventas' },
          ]}
        />
      </div>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} xs={12}>
          <MaterialReactTable
            columns={columns} //must be memoized
            data={remoteData} //must be memoized
            state={{
              isLoading,
              pagination,
              showAlertBanner: isError,
              showProgressBars: isRefetching,
              globalFilter,
              sorting,
            }}
            initialState={{
              density: 'compact',
            }}
            manualPagination
            manualSorting
            onSortingChange={setSorting}
            manualFiltering
            onGlobalFilterChange={setGlobalFilter}
            muiToolbarAlertBannerProps={
              isError ? { color: 'error', children: 'Error loading data' } : undefined
            }
            onPaginationChange={setPagination}
            rowCount={rowCount}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            positionGlobalFilter={'left'}
            muiSearchTextFieldProps={{
              variant: 'outlined',
              placeholder: 'Busqueda por Razon Social',
              InputLabelProps: { shrink: true },
              size: 'small',
            }}
            enableRowActions
            positionActionsColumn="last"
            localization={localization}
            renderRowActions={({ row }) => (
              <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
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
                </SimpleMenu>
                <AuditIconButton row={row.original} />
              </div>
            )}
            muiTableHeadCellFilterTextFieldProps={{
              sx: { m: '0.5rem 0', width: '95%' },
              variant: 'outlined',
              size: 'small',
            }}
          />
        </Grid>
      </Grid>
      <Box py="12px" />
      <AnularDocumentoDialog
        id={'anularDocumentoDialgo'}
        open={openAnularDocumento}
        keepMounted
        factura={factura}
        onClose={async (val) => {
          if (val) {
            await fetchData().then();
          }
          setOpenAnularDocumento(false);
        }}
      />
    </Container>
  );
};

export default VentaGestion;
