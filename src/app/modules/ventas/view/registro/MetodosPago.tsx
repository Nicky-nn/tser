import React, {ChangeEvent, FunctionComponent} from 'react';
import {Home} from "@mui/icons-material";
import {useAppSelector} from "../../../../hooks";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    OutlinedInput,
    Radio,
    RadioGroup,
    Stack
} from "@mui/material";
import DatosCliente from "./DatosCliente";
import {useDispatch} from "react-redux";
import {
    setFacturaInputMontoPagar,
    setFacturaMetodoPago,
    setFacturaNroTarjeta
} from "../../slices/facturacion/factura.slice";
import {TarjetaMask} from "../../../../base/components/Mask/TarjetaMask";
import {replace} from "lodash";

interface OwnProps {
}

type Props = OwnProps;

const MetodosPago: FunctionComponent<Props> = (props) => {
    const factura = useAppSelector(state => state.factura);
    const dispatch = useDispatch();
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const metodoPago = parseInt(event.target.value)
        dispatch(setFacturaMetodoPago(metodoPago))
        if(metodoPago === 2){
            dispatch(setFacturaMetodoPago(metodoPago))
        }
        if(metodoPago === 1){
            dispatch(setFacturaInputMontoPagar(0))
        }
    }
    const handleChangeNroTarjeta = (event: any) => {
        const numeroTarjeta = replace(event.target.value, new RegExp("-", "g"), '').replace(/_/g, '').trim()
        dispatch(setFacturaNroTarjeta(numeroTarjeta))
    }
    return (
        <>
            <Stack spacing={2}>
                <SimpleCard title="Métodos de pago" Icon={<Home/>}>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={factura.codigoMetodoPago}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="1" control={<Radio/>} label="Efectivo"/>
                            <FormControlLabel value="2" control={<Radio/>} label="Tarjeta"/>
                        </RadioGroup>
                    </FormControl> <br/>
                    {
                        factura.codigoMetodoPago === 2 && (
                            <>
                                <Divider/>
                                <FormControl
                                    fullWidth
                                    style={{marginTop: 25}}
                                    size={"small"}
                                >
                                    <InputLabel htmlFor="formatted-text-mask-input">Ingrese el Número de
                                        tarjeta</InputLabel>
                                    <OutlinedInput
                                        label="Ingrese el Número de tarjeta"
                                        value={factura.numeroTarjeta || ""}
                                        onChange={handleChangeNroTarjeta}
                                        name="textmask"
                                        id="formatted-text-mask-input"
                                        inputComponent={TarjetaMask as any}
                                    />
                                    <small>primeros 4 y últimos 4 digitos</small>
                                </FormControl>
                            </>
                        )
                    }
                </SimpleCard>
                <DatosCliente/>
            </Stack>
        </>
    );
};

export default MetodosPago;
