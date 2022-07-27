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
                <List style={{marginTop: -5, marginLeft: 12, padding: 0}}>
                    <ListItem style={{padding: 0}}>
                        <ListItemText>
                            <strong>Nombre/Razón Social:</strong>&nbsp;&nbsp; {factura.cliente?.razonSocial || ''}
                        </ListItemText>
                    </ListItem>
                    <ListItem style={{padding: 0}}>
                        <ListItemText>
                            <strong>NIT/CI/CEX:</strong>&nbsp;&nbsp; {factura.cliente?.numeroDocumento || ''} {factura.cliente?.complemento || ''}
                        </ListItemText>
                    </ListItem>
                    <ListItem style={{padding: 0}}>
                        <ListItemText>
                            <strong>Correo:</strong>&nbsp;&nbsp; {factura.emailCliente || ''}
                        </ListItemText>
                    </ListItem>
                </List>
        </>
    );
};

export default DatosCliente;
