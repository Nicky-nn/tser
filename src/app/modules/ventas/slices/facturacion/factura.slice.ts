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
    setCliente
} = facturaSlice.actions;

export default facturaSlice.reducer;