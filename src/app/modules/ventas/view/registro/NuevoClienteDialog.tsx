import React, {FunctionComponent, useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {useFormik} from "formik";
import {clienteInputValidator} from "../../../clientes/validator/clienteInputValidator";
import {fetchSinTipoDocumentoIdentidad} from "../../../sin/api/sinTipoDocumentoIdentidad.api";
import {SinTipoDocumentoIdentidadProps} from "../../../sin/interfaces/sin.interface";
import {toast} from "react-toastify";
import {fetchClienteCreate} from "../../../clientes/api/clienteCreate.api";
import {swalException} from "../../../../utils/swal";

interface OwnProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: any) => void;
}

type Props = OwnProps;

const NuevoClienteDialog: FunctionComponent<Props> = (props: Props) => {
    const {onClose, open, ...other} = props;
    const [tiposDocumentoIdentidad, setTiposDocumentoIdentidad] = useState<SinTipoDocumentoIdentidadProps[]>([]);
    const clienteForm = useFormik({
        initialValues: {
            razonSocial: 'Sofia',
            numeroDocumento: '3352456',
            complemento: '',
            email: 'vergara@gmail.com',
            codigoTipoDocumentoIdentidad: 1,
            nombres: '',
            apellidos: ''
        },
        validationSchema: clienteInputValidator,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    const sinTiposDocumentoIdentidad = async (): Promise<void> => {
        await fetchSinTipoDocumentoIdentidad().then(res => {
            setTiposDocumentoIdentidad(res || [])
        });
    }

    useEffect(() => {
        if (open) {
            clienteForm.setValues(clienteForm.initialValues)
            if (tiposDocumentoIdentidad.length > 0) {
                clienteForm.setFieldValue('codigoTipoDocumentoIdentidad', tiposDocumentoIdentidad[0].codigoClasificador)
            }
        }
    }, [open]);

    useEffect(() => {
        sinTiposDocumentoIdentidad().then()
    }, []);

    const handleCancel = () => {
        onClose();
    };

    // REGISTRO Y VALIDACION DE DATOS
    const handleSubmit = async () => {
        if (clienteForm.isValid) {
            await fetchClienteCreate({
                ...clienteForm.values,
                codigoTipoDocumentoIdentidad: parseInt(clienteForm.values.codigoTipoDocumentoIdentidad.toString())
            }).then(cli => {
                toast.success('Cliente registrado correctamente')
                onClose(cli)
            }).catch(err => {
                swalException(err)
            })
            // console.log(clienteForm.values)
        } else {
            toast.error('Error en validacion de campos')
        }
    }

    return (
        <>
            <Dialog
                sx={{'& .MuiDialog-paper': {width: '80%', maxHeight: 435}}}
                maxWidth="sm"
                open={open}
                {...other}
            >
                <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                <DialogContent dividers>
                    <form>
                        <Grid container spacing={2}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{mt: 2}}>
                                <FormControl size="small" fullWidth
                                             error={clienteForm.touched.codigoTipoDocumentoIdentidad &&
                                                 Boolean(clienteForm.errors.codigoTipoDocumentoIdentidad)}
                                >
                                    <InputLabel>Tipo Documento Identidad</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="codigoTipoDocumentoIdentidad"
                                        name="codigoTipoDocumentoIdentidad"
                                        value={clienteForm.values.codigoTipoDocumentoIdentidad}
                                        label="Tipo Documento Identidad"
                                        onChange={clienteForm.handleChange}
                                        onBlur={clienteForm.handleBlur}
                                    >
                                        {tiposDocumentoIdentidad.map(value =>
                                            <MenuItem
                                                key={value.codigoClasificador}
                                                value={value.codigoClasificador}
                                            >
                                                {value.descripcion}
                                            </MenuItem>)
                                        }
                                    </Select>
                                    <FormHelperText>{clienteForm.touched.codigoTipoDocumentoIdentidad &&
                                        clienteForm.errors.codigoTipoDocumentoIdentidad}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item lg={12} md={12} xs={12}>
                                <TextField
                                    id="razonSocial"
                                    name="razonSocial"
                                    label="Razon Social"
                                    size="small"
                                    fullWidth
                                    value={clienteForm.values.razonSocial}
                                    onChange={clienteForm.handleChange}
                                    onBlur={clienteForm.handleBlur}
                                    error={clienteForm.touched.razonSocial && Boolean(clienteForm.errors.razonSocial)}
                                    helperText={clienteForm.touched.razonSocial && clienteForm.errors.razonSocial}
                                />
                            </Grid>
                            <Grid item lg={7} md={7} xs={12}>
                                <TextField
                                    id="numeroDocumento"
                                    name="numeroDocumento"
                                    label="Número de documento"
                                    size="small"
                                    fullWidth
                                    value={clienteForm.values.numeroDocumento}
                                    onChange={clienteForm.handleChange}
                                    onBlur={clienteForm.handleBlur}
                                    error={clienteForm.touched.numeroDocumento && Boolean(clienteForm.errors.numeroDocumento)}
                                    helperText={clienteForm.touched.numeroDocumento && clienteForm.errors.numeroDocumento}
                                />
                            </Grid>
                            <Grid item lg={5} md={5} xs={12}>
                                <TextField
                                    id="complemento"
                                    name="complemento"
                                    label="Complemento"
                                    size="small"
                                    fullWidth
                                    value={clienteForm.values.complemento}
                                    onChange={clienteForm.handleChange}
                                    onBlur={clienteForm.handleBlur}
                                    error={clienteForm.touched.complemento && Boolean(clienteForm.errors.complemento)}
                                    helperText={clienteForm.touched.complemento && clienteForm.errors.complemento}
                                />
                            </Grid>
                            <Grid item lg={12} md={12} xs={12}>
                                <TextField
                                    id="email"
                                    name="email"
                                    label="Correo Electrónico"
                                    size="small"
                                    fullWidth
                                    value={clienteForm.values.email}
                                    onChange={clienteForm.handleChange}
                                    onBlur={clienteForm.handleBlur}
                                    error={clienteForm.touched.email && Boolean(clienteForm.errors.email)}
                                    helperText={clienteForm.touched.email && clienteForm.errors.email}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus color={'error'} variant={'outlined'} onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} style={{marginRight: 15}} variant={'outlined'}>Registrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default NuevoClienteDialog;
