import { gql, GraphQLClient } from 'graphql-request'

const gqlQuery = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      id
      username
      whatsappConnected
    }
  }
`

interface Props {
  username: string
}

/**
 * @description Obtiene los detalles del usuario por nombre de usuario
 * @param props
 */
export const apiGetUserWhatsApp = async (
  props: Props,
): Promise<{ id: string; username: string; whatsappConnected: boolean }> => {
  try {
    const { username } = props
    const client = new GraphQLClient(import.meta.env.ISI_API_WHAPI_URL)

    const data: any = await client.request(gqlQuery, {
      username,
    })

    return data.getUser
  } catch (e: any) {
    console.error(e)
    throw new Error('Error al obtener los detalles del usuario')
  }
}
