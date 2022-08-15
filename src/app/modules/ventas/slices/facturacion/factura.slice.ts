import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FacturaDetalleInputProps, FacturaInitialValues, FacturaInputProps} from "../../interfaces/factura";
import {RootState} from "../../../../store/store";
import {montoInputVuelto, montoPagarService, montoSubTotal} from "../../services/operacionesService";

export interface FacturaState {
    factura: FacturaInputProps;
}

const initialState: FacturaInputProps = FacturaInitialValues

export const facturaSlice = createSlice({
    name: 'factura',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        facturaReset: () => initialState,
        setFactura: (state, action) => ({
            ...action.payload,
            montoSubTotal: montoSubTotal(action.payload),
            montoPagar: montoPagarService(action.payload),
            inputVuelto: montoInputVuelto(action.payload)
        }),
        setTipoCliente: (state, action) => {
            state.tipoCliente = action.payload;
        },
        setCliente: (state, action) => {
            state.cliente = action.payload;
            state.emailCliente = action.payload.email || ''
        },
        setCodigoCliente: (state, action) => {
            state.codigoCliente = action.payload;
        },
        setEmailCliente: (state, action) => {
            state.emailCliente = action.payload;
        },
        setItemModificado: (state, action: PayloadAction<FacturaDetalleInputProps>) => {
            state.detalle = state.detalle.map(item => {
                return item.codigoProducto === action.payload.codigoProducto ? action.payload : item
            })
            state.montoSubTotal = montoSubTotal(state)
            state.montoPagar = montoPagarService(state)
            state.inputVuelto = montoInputVuelto(state)
        },
        setDeleteItem: (state, action: PayloadAction<FacturaDetalleInputProps>) => {
            state.detalle = state.detalle.filter(item => item.codigoProducto !== action.payload.codigoProducto)
            state.montoSubTotal = montoSubTotal(state)
            state.montoPagar = montoPagarService(state)
            state.inputVuelto = montoInputVuelto(state)
        },
        setFacturaDescuentoAdicional: (state, action) => {
            state.descuentoAdicional = action.payload
            state.montoSubTotal = montoSubTotal(state)
            state.montoPagar = montoPagarService(state)
            state.inputVuelto = montoInputVuelto(state)
        },
        setFacturaMetodoPago: (state, action) => {
            state.codigoMetodoPago = parseInt(action.payload)
            state.numeroTarjeta = null
        },
        setFacturaNroTarjeta: (state, action) => {
            state.numeroTarjeta = action.payload
        },
        setFacturaInputMontoPagar: (state, action) => {
            state.inputMontoPagar = action.payload
            state.inputVuelto = montoInputVuelto(state)
        },
        setFacturaMontoPagar: (state) => {
            state.montoSubTotal = montoSubTotal(state)
            state.montoPagar = montoPagarService(state)
            state.inputVuelto = montoInputVuelto(state)
        }
    },
});

export const selectFactura = (state: RootState) => state.factura;
export const {
    facturaReset,
    setFactura,
    setCodigoCliente,
    setEmailCliente,
    setCliente,
    setItemModificado,
    setDeleteItem,
    setFacturaDescuentoAdicional,
    setFacturaMetodoPago,
    setFacturaNroTarjeta,
    setFacturaInputMontoPagar,
    setFacturaMontoPagar,
} = facturaSlice.actions;

export default facturaSlice.reducer;