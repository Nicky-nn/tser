import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

export const ventaStore = configureStore({
  reducer: {},
})

export type AppDispatch = typeof ventaStore.dispatch
export type RootState = ReturnType<typeof ventaStore.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
