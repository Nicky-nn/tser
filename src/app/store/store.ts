import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import FacturaSlice from "../modules/ventas/slices/facturacion/factura.slice";

export const store = configureStore({
    reducer: {
        factura: FacturaSlice,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
