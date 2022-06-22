import React, {FunctionComponent, useState} from 'react';
import {Delete, DocumentScanner, Home, KeyboardArrowDown} from "@mui/icons-material";
import {useAppSelector} from "../../../../hooks";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import parse from 'html-react-parser';
import {Box, Button, Divider} from "@mui/material";
import SimpleMenu, {StyledMenuItem} from "../../../../base/components/MyMenu/SimpleMenu";
import FacturaDetalleExtraDialog from "./DetalleExtra/FacturaDetalleExtraDialog";
import {
    setFacturaDescuentoAdicional,
    setFacturaDetalleExtra,
    setFacturaMontoPagar
} from "../../slices/facturacion/factura.slice";
import {useDispatch} from "react-redux";

interface OwnProps {
}

type Props = OwnProps;

const FacturaDetalleExtra: FunctionComponent<Props> = (props) => {
    const factura = useAppSelector(state => state.factura);
    const [openDetalleExtra, setOpenDetalleExtra] = useState(false);
    const dispatch = useDispatch();
    const handleDetalleExtra = (event: any) => {
        setOpenDetalleExtra(true);
    }
    const handleCloseDetalleExtra = (newValue?: string) => {
        setOpenDetalleExtra(false);
        if (newValue) {
            dispatch(setFacturaDetalleExtra(newValue))
        }
    };
    return (
        <>
            <SimpleCard title="Detalle Extra" Icon={<Home/>}>
                <Box sx={{alignItems: 'right', textAlign: 'right'}}>
                    <SimpleMenu
                        menuButton={
                            <>
                                <Button
                                    id="demo-customized-button"
                                    aria-haspopup="true"
                                    variant="contained"
                                    disableElevation
                                    size={'small'}
                                    endIcon={<KeyboardArrowDown/>}
                                >
                                    Opciones
                                </Button>
                            </>

                        }
                    >
                        <StyledMenuItem onClick={handleDetalleExtra}>
                            <DocumentScanner/>Crear / Editar
                        </StyledMenuItem>
                        <Divider sx={{my: 0.5}}/>
                        <StyledMenuItem onClick={() => dispatch(setFacturaDetalleExtra(null))}>
                            <Delete/>Eliminar
                        </StyledMenuItem>
                    </SimpleMenu>
                    <FacturaDetalleExtraDialog
                        id="ringtone-menu"
                        keepMounted
                        open={openDetalleExtra}
                        onClose={handleCloseDetalleExtra}
                        value={factura.detalleExtra || ''}
                    />
                </Box>

                <Divider sx={{my: 1, mt: 1}}/>
                <div>
                    {
                        factura.detalleExtra ? parse(factura.detalleExtra || 'no se ha encontrado ') : 'SIN DETALLE EXTRA'
                    }
                </div>

            </SimpleCard>
        </>
    );
};

export default FacturaDetalleExtra;
