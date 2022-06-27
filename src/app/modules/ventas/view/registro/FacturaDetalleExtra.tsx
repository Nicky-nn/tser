import React, {FunctionComponent, useState} from 'react';
import {Delete, DocumentScanner, KeyboardArrowDown} from "@mui/icons-material";
import {useAppSelector} from "../../../../hooks";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import parse from 'html-react-parser';
import {Box, Button, Divider} from "@mui/material";
import SimpleMenu, {StyledMenuItem} from "../../../../base/components/MyMenu/SimpleMenu";
import FacturaDetalleExtraDialog from "./DetalleExtra/FacturaDetalleExtraDialog";
import {setFacturaDetalleExtra} from "../../slices/facturacion/factura.slice";
import {useDispatch} from "react-redux";
import {Editor} from "@tinymce/tinymce-react";

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
            <SimpleCard title="Detalle Extra">
                <Box sx={{alignItems: 'right', textAlign: 'left'}}>
                    <Editor
                        apiKey='niud727ae46xgl3s5morxk4v03hq6rrv7lpkvustyt2ilp2k'
                        value={factura.detalleExtra || ''}
                        onInit={(evt, editor) => {
                            console.log(editor.getContent({format: 'text'}));
                        }}
                        onEditorChange={(newValue, editor) => {
                            dispatch(setFacturaDetalleExtra(editor.getContent()))
                            console.log(editor.getContent({format: 'text'}));
                        }}
                        init={{
                            plugins: 'table template code',
                            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | table | template | code',
                            menubar: false,
                            table_default_attributes: {
                                border: '0'
                            },
                            min_height: 150,
                            height: 150,
                            max_height: 500,
                        }}
                    />
                </Box>
            </SimpleCard>
            <FacturaDetalleExtraDialog
                id="ringtone-menu"
                keepMounted
                open={openDetalleExtra}
                onClose={handleCloseDetalleExtra}
                value={factura.detalleExtra || ''}
            />
        </>
    );
};

export default FacturaDetalleExtra;
