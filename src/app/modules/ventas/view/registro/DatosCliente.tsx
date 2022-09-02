import { Home } from '@mui/icons-material';
import { List, ListItem, ListItemText } from '@mui/material';
import React, { FunctionComponent } from 'react';

import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard';
import { useAppSelector } from '../../../../hooks';

interface OwnProps {}

type Props = OwnProps;

const DatosCliente: FunctionComponent<Props> = (props) => {
  const factura = useAppSelector((state) => state.factura);
  return <></>;
};

export default DatosCliente;
