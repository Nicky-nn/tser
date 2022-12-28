import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

export const productoStore = configureStore({
  reducer: {},
})

export type AppDispatch = typeof productoStore.dispatch
export type RootState = ReturnType<typeof productoStore.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
