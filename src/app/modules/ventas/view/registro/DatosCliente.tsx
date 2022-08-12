import React, {FunctionComponent} from 'react';
import {List, ListItem, ListItemText} from "@mui/material";
import {Home} from "@mui/icons-material";
import {useAppSelector} from "../../../../hooks";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";

interface OwnProps {
}

type Props = OwnProps;

const DatosCliente: FunctionComponent<Props> = (props) => {
    const factura = useAppSelector(state => state.factura);
    return (
        <>

        </>
    );
};

export default DatosCliente;
