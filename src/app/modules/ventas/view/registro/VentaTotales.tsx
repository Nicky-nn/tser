// noinspection GraphQLUnresolvedReference

import React, {FunctionComponent, useState} from 'react';
import {Button, Divider, Grid, Link, List, ListItem, ListItemText, Typography} from "@mui/material";
import {Home, MonetizationOn, Paid} from "@mui/icons-material";
import {useAppSelector} from "../../../../hooks";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import InputNumber from "rc-input-number";
import {DescuentoAdicionalDialog} from "./ventaTotales/DescuentoAdicionalDialog";
import {
    facturaReset,
    setFactura,
    setFacturaDescuentoAdicional,
    setFacturaInputMontoPagar,
    setFacturaMontoPagar
} from "../../slices/facturacion/factura.slice";
import {useDispatch} from "react-redux";
import {composeFactura, composeFacturaValidator} from "../../utils/composeFactura";
import Swal from 'sweetalert2';
import {swalConfirm, swalErrorMsg, swalException} from "../../../../utils/swal";
import {fetchFacturaCreate} from "../../api/facturaCreate.api";
import {openInNewTab} from "../../../../utils/helper";
import {FacturaResetValues} from "../../interfaces/factura";

interface OwnProps {
}

type Props = OwnProps;


const VentaTotales: FunctionComponent<Props> = (props) => {
    const factura = useAppSelector(state => state.factura);
    const [openDescuentoAdicional, setOpenDescuentoAdicional] = useState(false);
    const handleFocus = (event: any) => event.target.select();
    const dispatch = useDispatch();
    const handleDescuentoAdicional = (event: any) => {
        setOpenDescuentoAdicional(true);
    }
    const handleCloseDescuentoAdicional = (newValue?: number) => {
        setOpenDescuentoAdicional(false);
        if (newValue || newValue === 0) {
            dispatch(setFacturaDescuentoAdicional(newValue))
            dispatch(setFacturaMontoPagar())
        }
    };
    const handeRealizarPago = async () => {
        const inputFactura = composeFactura(factura)
        console.log(inputFactura)
        const validator = await composeFacturaValidator(inputFactura).catch((err: Error) => {
            swalErrorMsg(err.message)
        })
        if (validator) {
            Swal.fire({
                ...swalConfirm,
                text: '¿Confirma que desea emitir el documento fiscal?',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    return fetchFacturaCreate(inputFactura)
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    const {value}: any = result
                    dispatch(setFactura({
                        ...factura,
                        ...FacturaResetValues
                    }))
                    openInNewTab(value.representacionGrafica.pdf)
                    Swal.fire({
                        title: `Documento generado correctamente`,
                        text: `${value.representacionGrafica.pdf}`,
                    }).then()
                }
            }).catch(err => {
                swalException(err)
            })
        }
    }
    return (
        <>
            <SimpleCard title="Cálculo de los totales" childIcon={<MonetizationOn/>}>
                <List dense>
                    <ListItem style={{padding: 0}}
                              secondaryAction={
                                  <Typography variant="subtitle1" gutterBottom>
                                      {numberWithCommas(factura.montoSubTotal, {})}
                                  </Typography>
                              }
                    >
                        <ListItemText primary={<strong>SUB-TOTAL</strong>}/>
                    </ListItem>
                    <ListItem style={{padding: 0}}
                              secondaryAction={
                                  <>
                                      <Link href="#" onClick={handleDescuentoAdicional} variant="subtitle1"
                                            underline="hover">
                                          {numberWithCommas(factura.descuentoAdicional || 0, {})}
                                      </Link>
                                      <DescuentoAdicionalDialog
                                          id="ringtone-menu"
                                          keepMounted
                                          open={openDescuentoAdicional}
                                          onClose={handleCloseDescuentoAdicional}
                                          value={factura.descuentoAdicional || 0}
                                      />
                                  </>
                              }
                    >
                        <ListItemText primary={<strong>DESCUENTO ADICIONAL</strong>}/>
                    </ListItem>
                    <ListItem style={{padding: 0}}
                              secondaryAction={
                                  <>
                                      <Link href="#" variant="subtitle1"
                                            underline="hover">
                                          {numberWithCommas(factura.descuentoAdicional || 0, {})}
                                      </Link>
                                      <DescuentoAdicionalDialog
                                          id="ringtone-menu"
                                          keepMounted
                                          open={openDescuentoAdicional}
                                          onClose={handleCloseDescuentoAdicional}
                                          value={factura.descuentoAdicional || 0}
                                      />
                                  </>
                              }
                    >
                        <ListItemText primary={<strong>MONTO GIFT-CARD</strong>}/>
                    </ListItem>
                    <ListItem style={{padding: 0}}
                              secondaryAction={
                                  <Typography variant="subtitle1" gutterBottom>
                                      {numberWithCommas(factura.montoSubTotal - factura.descuentoAdicional, {})}
                                  </Typography>
                              }
                    >
                        <ListItemText primary={<strong>TOTAL</strong>}/>
                    </ListItem>
                    <Divider variant="inset" component="li" style={{marginTop: 10, marginBottom: 20}}/>
                    <ListItem style={{padding: 0}}
                              secondaryAction={
                                  <Typography variant="h6" gutterBottom>
                                      {numberWithCommas(factura.montoPagar, {})}
                                  </Typography>
                              }
                    >
                        <ListItemText primary={<strong>MONTO A PAGAR</strong>}/>
                    </ListItem>
                </List>

                <Divider style={{marginTop: 10, marginBottom: 20}} color={'red'}/>
                <Grid sx={{flexGrow: 1}} container spacing={3}>
                    <Grid item xs={12} md={7} lg={7}>
                        <small>Ingrese Monto</small><br/>
                        <InputNumber
                            min={0}
                            id={'montoPagar'}
                            className="inputMontoPagar"
                            value={factura.inputMontoPagar}
                            onFocus={handleFocus}
                            onChange={(value: number) => {
                                dispatch(setFacturaInputMontoPagar(value))
                            }}
                            formatter={numberWithCommas}
                        />
                    </Grid>
                    <Grid item xs={12} md={5} lg={5}>
                        <small>Vuelto / Saldo</small>
                        <Typography variant="h6" gutterBottom mr={2} align={'right'} color={'red'}>
                            {numberWithCommas(factura.inputVuelto, {})}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <Button variant="contained" onClick={handeRealizarPago} fullWidth={true} color="success"
                                startIcon={<Paid/>}>
                            REALIZAR PAGO
                        </Button>
                    </Grid>
                </Grid>
            </SimpleCard>
        </>
    );
}
export default VentaTotales;