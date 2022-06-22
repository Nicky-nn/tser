import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

interface OwnProps {
    id: string;
    keepMounted: boolean;
    value: string;
    open: boolean;
    onClose: (value?: string) => void;
}

type Props = OwnProps;

const FacturaDetalleExtraDialog: FunctionComponent<Props> = (props) => {
    const {onClose, value: valueProp, open, ...other} = props;
    const [value, setValue] = useState(valueProp);
    const inputRef = useRef<HTMLElement>(null);
    const editorRef: any = useRef(null);

    useEffect(() => {
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open])
    const handleCancel = () => {
        onClose();
    };
    const handleOk = () => {
        if (editorRef.current) {
            onClose(editorRef.current.getContent());
        } else {
            onClose(value);
        }
    };
    const handleEntering = () => {
        if (inputRef.current != null) {
            inputRef.current.focus();
        }
    };
    return (
        <>
            <Dialog
                sx={{'& .MuiDialog-paper': {width: '80%', maxHeight: 500}}}
                maxWidth="md"
                TransitionProps={{onEntering: handleEntering}}
                open={open}
                {...other}
            >
                <DialogTitle>Ingrese Descuento Adicional</DialogTitle>
                <DialogContent dividers>
                    <Editor
                        apiKey='niud727ae46xgl3s5morxk4v03hq6rrv7lpkvustyt2ilp2k'
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue={valueProp}
                        init={{
                            height: 300,
                            menubar: true,
                            plugins: ['table'],
                            toolbar: 'undo redo| bold italic|alignleft aligncenter|alignright alignjustify|removeformat',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button onClick={handleOk} style={{marginRight: 10}}>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FacturaDetalleExtraDialog;
