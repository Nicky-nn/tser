// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request';

import { AccessToken } from '../../../base/models/paramsModel';
import { GiftCardProps } from '../interfaces/giftCard.interface';

const query = gql`
  query GIFT_CARD($id: ID!) {
    giftCard(id: $id) {
      _id
      titulo
      state
      usucre
      createdAt
      usumod
      createdAt
      actividadEconomica {
        codigoCaeb
        descripcion
        tipoActividad
      }
      variantes {
        titulo
        _id
        sinProductoServicio {
          codigoActividad
          codigoProducto
          descripcionProducto
        }
        precio
        codigoProducto
        imagen {
          altText
          url
        }
        unidadMedida {
          codigoClasificador
          descripcion
        }
      }
    }
  }
`;

export const apiGiftCard = async (id: string): Promise<GiftCardProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL);
  const token = localStorage.getItem(AccessToken);
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`);

  const data: any = await client.request(query, { id });
  return data.giftCard;
};
