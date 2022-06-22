import React, {FunctionComponent, useState} from 'react';
import {Button, Divider, Grid, Link, List, ListItem, ListItemText, Typography} from "@mui/material";
import {Home, Paid} from "@mui/icons-material";
import {useAppSelector} from "../../../../hooks";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {numberWithCommas} from "../../../../base/components/MyInputs/NumberInput";
import InputNumber from "rc-input-number";
import {DescuentoAdicionalDialog} from "./ventaTotales/DescuentoAdicionalDialog";
import {
    setDeleteItem,
    setFacturaDescuentoAdicional,
    setFacturaInputMontoPagar, setFacturaMontoPagar
} from "../../slices/facturacion/factura.slice";
import {useDispatch} from "react-redux";

interface OwnProps {
}

type Props = OwnProps;


const VentaTotales: FunctionComponent<Props> = (props) => {
    const factura = useAppSelector(state => state.factura);
    const [openDescuentoAdicional, setOpenDescuentoAdicional] = useState(false);
    const subTotal: number = factura.detalle.reduce((acc, cur) => acc + (cur.inputCantidad * cur.inputPrecio) - cur.inputDescuento, 0) || 0;
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
    return (
        <>
            <SimpleCard title="Cálculo de los totales" Icon={<Home/>}>
                <List dense>
                    <ListItem style={{padding: 0}}
                              secondaryAction={
                                  <Typography variant="subtitle1" gutterBottom>
                                      {numberWithCommas(subTotal || 0, {})}
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
                                      {numberWithCommas(subTotal - factura.descuentoAdicional, {})}
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
                            {"0.00"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <Button variant="contained" fullWidth={true} color="success" startIcon={<Paid/>}>
                            REALIZAR PAGO
                        </Button>
                    </Grid>
                </Grid>
            </SimpleCard>
        </>
    );
};

export default VentaTotales;
