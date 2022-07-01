import {createSlice} from '@reduxjs/toolkit';
import {RootState} from "../../../../store/store";
import {ProductoInitialValues, ProductoInputProps} from "../../interfaces/producto.interface";

const initialState: ProductoInputProps = ProductoInitialValues

export const productoSlice = createSlice({
    name: 'producto',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        productoReset: () => initialState,
        setProducto: (state, action) => {
            state = action.payload;
        },
        setOpcionesProducto: (state, action) => {
            state.opcionesProducto = action.payload
        },
        setVarianteUnica: (state, action) => {
            state.varianteUnica = action.payload
        },
        setVariantesProducto: (state, action) => {
            state.variantes = action.payload
        }
    },
});

export const selectProducto = (state: RootState): ProductoInputProps => state.producto;
export const {
    productoReset,
    setProducto,
    setVarianteUnica,
    setOpcionesProducto,
    setVariantesProducto
} = productoSlice.actions;

export default productoSlice.reducer;