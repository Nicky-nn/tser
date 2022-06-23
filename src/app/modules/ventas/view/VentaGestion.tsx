import React, {FC, useEffect, useState} from 'react';
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";
import {Button, Divider, Grid, IconButton} from "@mui/material";
import {Box, styled} from "@mui/system";
import MaterialReactTable, {MRT_ColumnDef} from 'material-react-table';
import {FacturaProps} from "../interfaces/factura";
import {fetchFacturaListado} from "../api/factura.listado.api";
import {swalException} from "../../../utils/swal";
import {Delete, FileOpen, LayersClear, MenuOpen, PictureAsPdf, Visibility} from "@mui/icons-material";
import SimpleMenu, {StyledMenuItem} from "../../../base/components/MyMenu/SimpleMenu";
import {openInNewTab} from "../../../utils/helper";

const Container = styled('div')(({theme}) => ({
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
}))

const tableColumns: MRT_ColumnDef[] = [
    {
        header: 'Fecha Emisión',
        id: 'fechaEmision',
    },
    {
        header: 'Importe',
        id: 'montoTotal',
    },
    {
        header: 'Nro. Factura',
        id: 'numeroFactura',
    },
    {
        header: 'Nit',
        id: 'nit',
    },
    {
        header: 'Razon Social',
        id: 'razonSocial',
    },
    {
        header: 'Usuario',
        id: 'usucre',
    },
];

const VentaGestion: FC<any> = () => {
    const [remoteData, setRemoteData] = useState<FacturaProps[]>([]);
    const [columns, setColumns] = useState(tableColumns);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const response: any = await fetchFacturaListado().catch((err: Error) => swalException(err));
            const data = response.facturaCompraVentaAll.docs;
            setRemoteData(data.map((d: any) => ({
                ...d,
                nit: d.cliente.numeroDocumento,
                razonSocial: d.cliente.razonSocial
            })));
            setIsLoading(false);
        };
        fetchData().then();
    }, []);
    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Ventas', path: '/ventas/gestion'},
                        {name: 'Gestión de Ventas'},
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
                        }}
                        initialState={{
                            density: 'compact'
                        }}
                        enableDensityToggle={false}
                        enableRowNumbers
                        enableRowActions
                        positionActionsColumn="last"
                        renderRowActions={({row}: any) => (
                            <div style={{display: 'flex', flexWrap: 'nowrap', gap: '0.5rem'}}>
                                <SimpleMenu
                                    menuButton={
                                        <>
                                            <IconButton aria-label="delete">
                                                <MenuOpen/>
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <StyledMenuItem onClick={() => {
                                        openInNewTab(row.original.representacionGrafica.pdf)
                                        console.log('Pdf Medio Oficio', row.original);
                                    }}>
                                        <LayersClear/> Anular Documento
                                    </StyledMenuItem>

                                    <StyledMenuItem onClick={() => {
                                        openInNewTab(row.original.representacionGrafica.pdf)
                                        console.log('Pdf Medio Oficio', row.original);
                                    }}>
                                        <PictureAsPdf/> Pdf Medio Oficio
                                    </StyledMenuItem>

                                    <StyledMenuItem onClick={() => {
                                        openInNewTab(row.original.representacionGrafica.xml)
                                        console.log('Pdf Medio Oficio', row.original);
                                    }}>
                                        <FileOpen/> Xml
                                    </StyledMenuItem>
                                </SimpleMenu>

                                <IconButton aria-label="auditoria">
                                    <Visibility/>
                                </IconButton>
                            </div>
                        )}></MaterialReactTable>
                </Grid>
            </Grid>
            <Box py="12px"/>
        </Container>
    );
};

export default VentaGestion;
