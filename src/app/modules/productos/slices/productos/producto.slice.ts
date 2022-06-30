import {createSlice} from '@reduxjs/toolkit';
import {RootState} from "../../../../store/store";
import {ProductoInitialValues, ProductoInputProps} from "../../interfaces/producto.interface";

export interface ProductoState {
    producto: ProductoInputProps;
}

const initialState: ProductoInputProps = ProductoInitialValues

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