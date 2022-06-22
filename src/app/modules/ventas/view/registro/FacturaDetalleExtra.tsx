import React, {FunctionComponent, useRef} from 'react';
import {Home} from "@mui/icons-material";
import {useAppSelector} from "../../../../hooks";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {Editor} from "@tinymce/tinymce-react";

interface OwnProps {
}

type Props = OwnProps;

const FacturaDetalleExtra: FunctionComponent<Props> = (props) => {
    const factura = useAppSelector(state => state.factura);
    const editorRef: any = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };
    return (
        <>
            <SimpleCard title="Detalle Extra" Icon={<Home/>}>
                <Editor
                    apiKey='niud727ae46xgl3s5morxk4v03hq6rrv7lpkvustyt2ilp2k'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue="<p>This is the initial content of the editor.</p>"
                    init={{
                        height: 'auto',
                        menubar: true,
                        plugins: ['table','template'],
                        toolbar: 'undo redo |' +
                            'bold italic | alignleft aligncenter ' +
                            'alignright alignjustify |' +
                            'removeformat',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
                <button onClick={log}>Log editor content</button>
            </SimpleCard>
        </>
    );
};

export default FacturaDetalleExtra;
