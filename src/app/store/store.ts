import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

import ProductoSlice from '../modules/productos/slices/productos/producto.slice'
import FacturaSlice from '../modules/ventas/slices/facturacion/factura.slice'
import ClasificadorSlice from '../slices/clasificador.slice'

export const store = configureStore({
  reducer: {
    factura: FacturaSlice,
    producto: ProductoSlice,
    clasificador: ClasificadorSlice,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
