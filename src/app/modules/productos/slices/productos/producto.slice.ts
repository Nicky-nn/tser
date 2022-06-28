import {createSlice} from '@reduxjs/toolkit';
import {RootState} from "../../../../store/store";
import {FacturaInitialValues} from "../../../ventas/interfaces/factura";

interface ProductoInputProps {
}

export interface ProductoState {
    producto: ProductoInputProps;
}

const initialState: ProductoInputProps = FacturaInitialValues

export const productoSlice = createSlice({
    name: 'producto',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        productoReset: () => initialState,
        setProducto: (state, action) => {
            state = action.payload;
        }
    },
});

export const selectProducto = (state: RootState) => state.producto;
export const {
    productoReset,
    setProducto
} = productoSlice.actions;

export default productoSlice.reducer;