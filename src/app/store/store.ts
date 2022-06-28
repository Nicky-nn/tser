import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import FacturaSlice from "../modules/ventas/slices/facturacion/factura.slice";
import ProductoSlice from "../modules/productos/slices/productos/producto.slice";

export const store = configureStore({
    reducer: {
        factura: FacturaSlice,
        producto: ProductoSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
