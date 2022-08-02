import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {Chip, IconButton} from "@mui/material";
import {Edit} from "@mui/icons-material";
import {ProductoProps} from "../../interfaces/producto.interface";
import {PAGE_DEFAULT, PageProps} from "../../../../interfaces";
import {swalException} from "../../../../utils/swal";
import {apiProductos} from "../../api/producto.api";
import MaterialReactTable, {MRT_ColumnDef} from 'material-react-table';
import type {ColumnFiltersState, PaginationState,} from '@tanstack/react-table';
import {SortingState} from "@tanstack/react-table";
import {sumBy} from "lodash";
import AuditIconButton from "../../../../base/components/Auditoria/AuditIconButton";
import {useNavigate} from "react-router-dom";
import {productosRouteMap} from "../../ProductosRoutesMap";
import {localization} from "../../../../utils/localization";
import {genApiQuery, genReplaceEmpty} from "../../../../utils/helper";

interface OwnProps {
}

type Props = OwnProps;

const tableColumns: MRT_ColumnDef<ProductoProps>[] = [
    {
        accessorKey: 'titulo',
        header: 'Producto',
    },
    {
        accessorFn: (row) => {
            const cantidad = sumBy(row.variantes, (item) => {
                return sumBy(item.inventario, (inv) => inv.stock!)
            })
            if (!row.varianteUnica) {
                return <Chip label={`${cantidad} items para ${row.variantes.length} variantes`}
                             color={"info"}/>
            }
            return <Chip label={`${cantidad} items`} color={"default"}/>

        },
        id: 'inventario',
        header: 'Inventario',
    }, {
        id: 'tipoProducto.descripcion',
        header: 'Tipo Producto',
        accessorFn: (row) => genReplaceEmpty(row.tipoProducto?.descripcion, '')
    }, {
        accessorKey: 'proveedor',
        id: 'proveedor',
        header: 'Proveedor',
        accessorFn: (row) => (<span>{row.proveedor?.nombre}</span>),
    },
    {
        accessorFn: (row) => (<Chip size={'small'} label={row.state} color={"success"}/>),
        id: 'state',
        header: 'Estado',
    },
]

const ProductosListado: FunctionComponent<Props> = (props) => {
    const navigate = useNavigate()
    const [data, setData] = useState<ProductoProps[]>([]);

    // ESTADO DATATABLE
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isError, setIsError] = useState<any>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGE_DEFAULT.page,
        pageSize: PAGE_DEFAULT.limit
    });
    const [rowCount, setRowCount] = useState(0);
    const [isRefetching, setIsRefetching] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    // FIN ESTADO DATATABLE

    const fetchData = async () => {
        try {
            if (!data.length) {
                setIsLoading(true);
            } else {
                setIsRefetching(true);
            }
            setIsLoading(true);
            const query = genApiQuery(columnFilters);
            const fetchPagination: PageProps = {
                ...PAGE_DEFAULT,
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                reverse: sorting.length <= 0,
                query
            }
            const {pageInfo, docs} = await apiProductos(fetchPagination);
            setRowCount(pageInfo.totalDocs);
            setData(docs);
            setIsLoading(false);
            setIsError(false);
            setIsRefetching(false);
        } catch (e: any) {
            swalException(e)
            setIsError(e.message)
        }

    }
    useEffect(() => {
        fetchData().then();
    }, [
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
        globalFilter,
        columnFilters
    ]);
    const columns = useMemo(() => tableColumns, []);

    return (<>
        <MaterialReactTable
            columns={columns}
            data={data}
            state={{
                isLoading,
                pagination,
                showAlertBanner: isError,
                showProgressBars: isRefetching,
                density: 'compact',
                sorting,
                columnFilters
            }}
            manualPagination
            manualSorting
            onSortingChange={setSorting}
            manualFiltering
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={setGlobalFilter}
            onPaginationChange={setPagination}
            localization={localization}
            muiTableToolbarAlertBannerProps={
                isError
                    ? {
                        color: 'error',
                        children: 'Error loading data',
                    }
                    : undefined
            }
            rowCount={rowCount}
            enableRowNumbers={true}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            positionGlobalFilter={'left'}
            muiSearchTextFieldProps={{
                variant: 'outlined',
                placeholder: 'Busqueda',
                InputLabelProps: {shrink: true},
                size: 'small',
            }}
            enableRowActions
            positionActionsColumn={'last'}
            renderRowActions={({row}) => (
                <div style={{display: 'flex', flexWrap: 'nowrap', gap: '0.5rem'}}>
                    <IconButton onClick={() => navigate(`${productosRouteMap.modificar}/${row.original._id}`)}
                                color={'primary'} aria-label="delete">
                        <Edit/>
                    </IconButton>
                    <AuditIconButton row={row.original}/>
                </div>
            )}
            muiTableHeadCellFilterTextFieldProps={{
                sx: {m: '0.5rem 0', width: '95%'},
                variant: 'outlined',
                size: 'small'
            }}
        />
    </>);
};

export default ProductosListado;
