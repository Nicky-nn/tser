// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { GiftCardApiInputProps, GiftCardProps } from '../interfaces/giftCard.interface'

const gqlQuery = gql`
  mutation GIFT_CARD_ACTUALIZAR($id: ID!, $input: GiftCardActualizarInput!) {
    giftCardActualizar(id: $id, input: $input) {
      _id
    }
  }
`

export const apiGiftCardActualizar = async (
  id: string,
  input: GiftCardApiInputProps,
): Promise<GiftCardProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, { id, input })
  return data.giftCardActualizar
}
