import {Dialog, DialogProps, DialogTitle} from "@mui/material";
import {FC} from "react";

type Props = DialogProps & {
    title: string,
};
const style = {
    position: 'absolute',
    width: 400,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 5,
    p: 4,
};


// ✔️ create the dialog you want to use
const SimpleDialog: FC<Props> = ({title, ...props}) => (
    <Dialog {...props}>
        <DialogTitle>{title}</DialogTitle>
    </Dialog>
);

export default SimpleDialog;