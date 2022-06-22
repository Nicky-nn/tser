import {createSlice} from '@reduxjs/toolkit';
import {FacturaInitialValues, FacturaInputProps} from "../../interfaces/factura";
import {RootState} from "../../../../store/store";

export interface FacturaState {
    factura: FacturaInputProps;
}

const initialState: FacturaInputProps = FacturaInitialValues

export const facturaSlice = createSlice({
    name: 'factura',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setFactura: (state, action) => {
            state = action.payload;
        },
        setActividadEconomica: (state, action) => {
            state.actividadEconomica = action.payload;
        },
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
        resetFactura: (state) => {
            state = FacturaInitialValues;
        },
        setDetalleFactura: (state, action) => {
            state.detalle.push({
                ...action.payload,
                inputCantidad: 1,
                inputPrecio: action.payload.precio,
                inputDescuento: 0,
                subtotal: 0,
                detalleExtra: '',
            })
        },
        setItemModificado: (state, action) => {
            state.detalle = state.detalle.map(item => {
                return item.codigoProducto === action.payload.codigoProducto ? action.payload : item
            })
        },
        setDeleteItem: (state, action) => {
            state.detalle = state.detalle.filter(item => item.codigoProducto !== action.payload.codigoProducto)
        },
        setFacturaDescuentoAdicional: (state, action) => {
            state.descuentoAdicional = action.payload
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
        },
        setFacturaMontoPagar: (state) => {
            const subTotal: number = state.detalle.reduce((acc, cur) => acc + (cur.inputCantidad * cur.inputPrecio) - cur.inputDescuento, 0) || 0;
            const total = subTotal - state.descuentoAdicional - (state.montoGiftCard || 0)
            state.montoPagar = total
        },
        setFacturaDetalleExtra: (state, action) => {
            state.detalleExtra = action.payload
        }
    },
});

export const selectFactura = (state: RootState) => state.factura;
export const {
    setActividadEconomica,
    resetFactura,
    setFactura,
    setTipoCliente,
    setCodigoCliente,
    setEmailCliente,
    setCliente,
    setDetalleFactura,
    setItemModificado,
    setDeleteItem,
    setFacturaDescuentoAdicional,
    setFacturaMetodoPago,
    setFacturaNroTarjeta,
    setFacturaInputMontoPagar,
    setFacturaMontoPagar,
    setFacturaDetalleExtra
} = facturaSlice.actions;

export default facturaSlice.reducer;