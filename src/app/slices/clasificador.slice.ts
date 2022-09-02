import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SinUnidadMedidaProps } from '../modules/sin/interfaces/sin.interface';
import { SucursalProps } from '../modules/sucursal/interfaces/sucursal';
import { RootState } from '../store/store';

interface ClasificadorProps {
  sucursal: SucursalProps[];
  unidadMedida: SinUnidadMedidaProps[];
}

const initialState: ClasificadorProps = {
  sucursal: [] as SucursalProps[],
  unidadMedida: [] as SinUnidadMedidaProps[],
};

export const clasificadorSlice = createSlice({
  name: 'clasificador',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    resetSucursal: (state) => {
      state.sucursal = initialState.sucursal;
    },
    setSucursal: (state, action: PayloadAction<SucursalProps[]>) => {
      state.sucursal = action.payload;
    },
    resetUnidadMedida: (state) => {
      state.unidadMedida = initialState.unidadMedida;
    },
    setUnidadMedida: (state, action: PayloadAction<SinUnidadMedidaProps[]>) => {
      state.unidadMedida = action.payload;
    },
  },
});

export const selectSucursal = (state: RootState): SucursalProps[] =>
  state.clasificador.sucursal;
export const selectUnidadMedida = (state: RootState): SinUnidadMedidaProps[] =>
  state.clasificador.unidadMedida;

export const { resetSucursal, setSucursal, resetUnidadMedida, setUnidadMedida } =
  clasificadorSlice.actions;

export default clasificadorSlice.reducer;
