import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import MaterialReactTable, {MRT_ColumnDef} from "material-react-table";
import {ProductoVarianteProps} from "../interfaces/producto.interface";
import {useQuery} from "@tanstack/react-query";
import {ColumnFiltersState, PaginationState, SortingState} from "@tanstack/react-table";
import {PAGE_DEFAULT, PageProps} from "../../../interfaces";
import {genApiQuery} from "../../../utils/helper";
import {apiProductosVariantes} from "../api/productosVariantes.api";
import {localization} from "../../../utils/localization";
import {numberWithCommas} from "../../../base/components/MyInputs/NumberInput";

const columnsMap: MRT_ColumnDef<ProductoVarianteProps>[] = [
    {
        accessorKey: 'codigoProducto',
        header: 'Código Producto',
    }, {
        accessorKey: 'nombre',
        header: 'Producto / Servicio',
    }, {
        accessorKey: 'precio',
        header: 'Precio',
        muiTableBodyCellProps: {
            align: 'right'
        },
        accessorFn: (row) => {
            return numberWithCommas(row.precio, {})
        },
        size: 150
    }, {
        accessorKey: 'precioComparacion',
        header: 'Precio Comparación',
        muiTableBodyCellProps: {
            align: 'right'
        },
        accessorFn: (row) => {
            return numberWithCommas(row.precioComparacion, {})
        },
        size: 150
    }, {
        accessorKey: 'unidadMedida.descripcion',
        header: 'Unidad Medida'
    }
];


interface OwnProps {
    codigoActividad: string,
    setProductosVariantes: React.Dispatch<React.SetStateAction<ProductoVarianteProps[]>>
}

type Props = OwnProps;

const ProductosVariantes: FunctionComponent<Props> = (props) => {
    const {setProductosVariantes} = props
    // DATA TABLE
    const [rowCount, setRowCount] = useState(0);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGE_DEFAULT.page,
        pageSize: PAGE_DEFAULT.limit
    });
    const [rowSelection, setRowSelection] = useState({});

    // FIN DATA TABLE
    const {data, isError, isFetching, isLoading} = useQuery<ProductoVarianteProps[]>(
        [
            'tableProductoVarianteDialog',
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
                query
            }
            const {pageInfo, docs} = await apiProductosVariantes(fetchPagination);
            setRowCount(pageInfo.totalDocs);
            return docs
        },
        {keepPreviousData: true},
    );
    useEffect(() => {
        if(rowSelection) {
            const p = Object.keys(rowSelection)
            if(data) {
                const pvs = data!.filter(item => p.includes(item._id))
                setProductosVariantes(pvs)
            }
        }
    }, [rowSelection]);

    const columns = useMemo<MRT_ColumnDef<ProductoVarianteProps>[]>(() => columnsMap, [],);
    return (<>
        <MaterialReactTable
            columns={columns}
            data={data ?? []}
            initialState={{showColumnFilters: true}}
            localization={localization}
            manualPagination
            manualFiltering
            manualSorting
            muiTableToolbarAlertBannerProps={
                isError
                    ? {
                        color: 'error',
                        children: 'Error loading data',
                    }
                    : undefined
            }
            enableDensityToggle={false}
            enableGlobalFilter={false}
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
                rowSelection
            }}
            muiTableHeadCellFilterTextFieldProps={{
                sx: {m: '0.5rem 0', width: '95%'},
                variant: 'outlined',
                size: 'small'
            }}
            enableRowSelection
            enableSelectAll={false}
            onRowSelectionChange={setRowSelection}
            getRowId={(row) => row._id}
            muiTableContainerProps={{
                sx: {
                    maxHeight: '650px',
                },
            }}
        />
    </>);
};

export default ProductosVariantes;
