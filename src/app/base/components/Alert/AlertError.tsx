import React, {FunctionComponent} from 'react';
import {Alert, AlertTitle, Container, Grid} from "@mui/material";
import {genReplaceEmpty} from "../../../utils/helper";

interface OwnProps {
    mensaje: string
    tipo?: 'error' | 'warning' | 'info' | 'success'
}

type Props = OwnProps;

const tipos = {error: 'Error', warning: "Alerta", info: 'Información', success: 'Satisfactorio'}

const AlertError: FunctionComponent<Props> = (props) => {
    const {mensaje, tipo} = props
    const alertTitle = genReplaceEmpty(tipos[tipo || 'error'], 'Error')
    return (
        <>
            <Container>
                <Grid container spacing={0} mt={2}>
                    <Grid item lg={12} md={12} xs={12}>
                        <Alert severity="error">
                            <AlertTitle>{alertTitle}</AlertTitle>
                            {mensaje}
                        </Alert>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
};

export default AlertError;
