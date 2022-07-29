import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from "../../../../store/store";
import {
    ProductoInitialValues,
    ProductoInputProps,
    ProductoVarianteInputProps
} from "../../interfaces/producto.interface";
import {genRandomString} from "../../../../utils/helper";

const initialState: ProductoInputProps = ProductoInitialValues

export const productoSlice = createSlice({
    name: 'producto',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        productoReset: () => ({...initialState, variante: {...initialState.variante, id: genRandomString(10)}}),
        setProducto: (state, action) => action.payload,
        setActividadEconomica: (state, action) => {
            state.actividadEconomica = action.payload
        },
        setCodigoProductoSin: (state, action) => {
            state.sinProductoServicio = action.payload
        },
        setNombreProducto: (state, action) => {
            state.titulo = action.payload
        },
        setDescripcionProducto: (state, action) => {
            state.descripcion = action.payload
        },
        setProdOpciones: (state, action) => {
            state.opcionesProducto = action.payload
        },
        setProdTipo: (state, action) => {
            state.tipoProducto = action.payload
        },
        setProdTipoPersonalizado: (state, action) => {
            state.tipoProductoPersonalizado = action.payload
        },
        setProdProveedor: (state, action) => {
            state.proveedor = action.payload
        }
    },
});

export const selectProducto = (state: RootState): ProductoInputProps => state.producto;
export const {
    productoReset,
    setProducto,
    setProdOpciones,
    setActividadEconomica,
    setCodigoProductoSin,
    setNombreProducto,
    setDescripcionProducto,
    setProdTipo,
    setProdTipoPersonalizado,
    setProdProveedor
} = productoSlice.actions;

export default productoSlice.reducer;