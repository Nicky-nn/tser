import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {Chip, IconButton} from "@mui/material";
import {Edit} from "@mui/icons-material";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {ProductoProps} from "../../interfaces/producto.interface";
import {PAGE_DEFAULT, PAGE_INFO_DEFAULT, PageProps} from "../../../../interfaces";
import {swalException} from "../../../../utils/swal";
import {apiProductos} from "../../api/producto.api";
import MaterialReactTable, {MRT_ColumnDef} from 'material-react-table';
import type {PaginationState,} from '@tanstack/react-table';
import {sumBy} from "lodash";
import AuditIconButton from "../../../../base/components/Auditoria/AuditIconButton";
import {useNavigate} from "react-router-dom";
import {productosRouteMap} from "../../ProductosRoutesMap";

interface OwnProps {
}

type Props = OwnProps;

const ProductosListado: FunctionComponent<Props> = (props) => {
    const navigate = useNavigate()
    const [data, setData] = useState<ProductoProps[]>([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGE_INFO_DEFAULT.page,
        pageSize: PAGE_INFO_DEFAULT.limit
    });
    const [rowCount, setRowCount] = useState(0);
    const [pageInfo, setPageInfo] = useState<PageProps>(PAGE_DEFAULT);

    useEffect(() => {
        const fetchData = async () => {
            if (!data.length) {
                setIsLoading(true);
            } else {
                setIsRefetching(true);
            }
            const resp = await apiProductos(pageInfo).catch((err: Error) => swalException(err));
            if (resp) {
                setData(resp.docs)
                setRowCount(resp.pageInfo.totalDocs)
                setIsLoading(false)
                setIsRefetching(false);
            }
        };
        fetchData().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        pagination.pageIndex,
        pagination.pageSize,
    ]);
    const columns = useMemo(
        () =>
            [
                {
                    accessorKey: 'titulo',
                    header: 'PRODUCTO',
                }, {
                accessorFn: (row) => (<Chip label={row.state} color={"success"}/>),
                id: 'state',
                header: 'ESTADO',
            }, {
                accessorFn: (row) => {
                    if (row.incluirCantidad) {
                        const cantidad = sumBy(row.variantes, (item) => {
                            return sumBy(item.inventario, (inv) => inv.stock)
                        })
                        if (!row.varianteUnica) {
                            return <Chip label={`${cantidad} items para ${row.variantes.length}`} color={"default"}/>
                        }
                        return <Chip label={`${cantidad} items`} color={"default"}/>
                    }
                    return <Chip label={"Stock Ilimitado"} color={"secondary"}/>
                },
                id: 'inventario',
                header: 'INVENTARIO',
            }, {
                accessorKey: 'tipo',
                id: 'tipo',
                header: 'TIPO',
            }, {
                accessorKey: 'proveedor',
                id: 'proveedor',
                header: 'PROVEEDOR',
            },
                //column definitions...
            ] as MRT_ColumnDef<ProductoProps>[],
        [],
    );

    return (<>
        <SimpleCard>
            <MaterialReactTable
                columns={columns}
                data={data}
                manualPagination
                muiTableToolbarAlertBannerProps={
                    isError
                        ? {
                            color: 'error',
                            children: 'Error loading data',
                        }
                        : undefined
                }
                onPaginationChange={setPagination}
                rowCount={rowCount}
                state={{
                    isLoading,
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isRefetching,
                    density: 'compact',
                    showGlobalFilter: true
                }}
                enableDensityToggle={false}
                positionGlobalFilter={'left'}
                muiSearchTextFieldProps={{
                    variant: 'outlined',
                    placeholder: 'Ingrese',
                    label: 'Busqueda',
                    InputLabelProps: {shrink: true},
                    size: 'small'
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
            />
        </SimpleCard>
    </>);
};

export default ProductosListado;
