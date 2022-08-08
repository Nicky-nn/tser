import React, {FunctionComponent} from 'react';
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {Key} from "@mui/icons-material";
import {Button, FormControl, Grid, TextField} from "@mui/material";

interface OwnProps {
}

type Props = OwnProps;

const CuentaPassword: FunctionComponent<Props> = (props) => {

    return (<>
        <SimpleCard title={'CAMBIAR CONTRASEÑA'} childIcon={<Key/>}>
            <Grid container spacing={2}>
                <Grid item lg={6} md={6} xs={12}>
                    <Grid container spacing={2} rowSpacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Ingrese su contraseña"
                                    value={'fasfsad'}
                                    variant="outlined"
                                    size="small"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Ingrese su nueva contraseña"
                                    value={'fasfsad'}
                                    variant="outlined"
                                    size="small"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Confirme su nueva contraseña"
                                    value={'fasfsad'}
                                    variant="outlined"
                                    size="small"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant={'contained'}>
                                Guardar Cambios
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>

                </Grid>
            </Grid>
        </SimpleCard>
    </>);
};

export default CuentaPassword;
