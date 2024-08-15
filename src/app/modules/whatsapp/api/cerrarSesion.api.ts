import { gql, GraphQLClient } from 'graphql-request'

// Define la mutación para cerrar sesión
const gqlMutation = gql`
  mutation Logout($username: String!) {
    logout(username: $username)
  }
`

interface Props {
  username: string
}

/**
 * @description Cierra la sesión del usuario dado por nombre de usuario
 * @param props
 */
export const apiLogout = async (props: Props): Promise<void> => {
  try {
    const { username } = props
    const client = new GraphQLClient(import.meta.env.ISI_API_WHAPI_URL)

    // Realiza la solicitud de mutación
    await client.request(gqlMutation, { username })
  } catch (e: any) {
    console.error(e)
    throw new Error('Error al cerrar sesión del usuario')
  }
}
