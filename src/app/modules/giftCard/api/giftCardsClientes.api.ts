// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request';

import { AccessToken } from '../../../base/models/paramsModel';
import { PageInfoProps, PageInputProps } from '../../../interfaces';
import { GiftCardProps } from '../interfaces/giftCard.interface';
import { GiftCardClienteProps } from '../interfaces/giftCardCliente.interface';

/**
 * Respuesta de productos
 */
export interface ApiGiftCardClientesResponse {
  docs: Array<GiftCardClienteProps>;
  pageInfo: PageInfoProps;
}

const query = gql`
  query GIFT_CARDS_CLIENTES(
    $limit: Int!
    $reverse: Boolean
    $page: Int!
    $query: String
  ) {
    giftCardClientes(limit: $limit, reverse: $reverse, page: $page, query: $query) {
      pageInfo {
        hasNextPage
        hasPrevPage
        limit
        page
        totalDocs
      }
      docs {
        cuf
        codigo
        metodoPago {
          codigoClasificador
          descripcion
        }
        numeroTarjeta
        codigoProducto
        titulo
        nombre
        codigoBarras
        precio
        precioComparacion
        costo
        moneda {
          codigoClasificador
          descripcion
        }
        tipoCambio
        saldos {
          cuf
          notaVenta
          sucursal {
            codigo
            direccion
            telefono
            departamento {
              codigo
              codigoPais
              sigla
              departamento
            }
            municipio
          }
          puntoVenta {
            codigo
            tipoPuntoVenta {
              codigoClasificador
              descripcion
            }
            nombre
            descripcion
          }
          cliente {
            _id
            razonSocial
            codigoCliente
            tipoDocumentoIdentidad {
              codigoClasificador
              descripcion
            }
            numeroDocumento
            complemento
            nombres
            apellidos
            email
          }
        }
        cliente {
          _id
          razonSocial
          tipoDocumentoIdentidad {
            codigoClasificador
            descripcion
          }
          razonSocial
        }
        saldo
        unidadMedida {
          codigoClasificador
          descripcion
        }
        state
      }
    }
  }
`;

export const apiGiftCardClientes = async (
  pageInfo: PageInputProps,
): Promise<ApiGiftCardClientesResponse> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL);
  const token = localStorage.getItem(AccessToken);
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`);

  const data: any = await client.request(query, pageInfo);
  return data.giftCardClientes;
};
