// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request';

import { AccessToken } from '../../../base/models/paramsModel';
import { NcdProps } from '../interfaces/ncdInterface';

export interface NcdRegistroInputProps {
  facturaCuf: string;
  detalle: {
    itemFactura: number;
    cantidad: number;
  }[];
}

const apiQuery = gql`
  mutation NCD_FCV_REGISTRO($input: NotaDebitoCreditoFcvInput!) {
    notaCreditoDebitoFcvRegistro(input: $input) {
      cuf
      state
      representacionGrafica {
        pdf
        rollo
        xml
        sin
      }
    }
  }
`;

/**
 * @description Registro de una nota de credito debito
 * @param inputProps
 */
export const apiNcdRegistro = async (
  inputProps: NcdRegistroInputProps,
): Promise<NcdProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL);
  const token = localStorage.getItem(AccessToken);
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`);

  const data: any = await client.request(apiQuery, { input: inputProps });
  return data.notaCreditoDebitoFcvRegistro;
};
