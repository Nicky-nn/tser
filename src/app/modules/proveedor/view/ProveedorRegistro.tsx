import React, {FunctionComponent} from 'react';
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";
import {Container} from "@mui/material";
import {Box} from "@mui/system";
import ProveedorForm from "./ProveedorForm";

interface OwnProps {
}

type Props = OwnProps;

const ProveedorRegistro: FunctionComponent<Props> = (props) => {


    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Ventas', path: '/ventas/registro'},
                        {name: 'Registrar Venta'},
                    ]}
                />
            </div>

            <ProveedorForm />
            <Box py="12px"/>
        </Container>
    )
};

export default ProveedorRegistro;
