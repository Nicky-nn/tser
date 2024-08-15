import { gql, GraphQLClient } from 'graphql-request'

const gqlQuery = gql`
  query NeedsQRCode($username: String!) {
    needsQRCode(username: $username)
  }
`

interface Props {
  username: string
}

/**
 * @description Verifica si se necesita un código QR para el usuario
 * @param props
 */
export const apiNeedsQRCodeWhatsApp = async (props: Props): Promise<boolean> => {
  try {
    const { username } = props
    const client = new GraphQLClient(import.meta.env.ISI_API_WHAPI_URL)

    const data: any = await client.request(gqlQuery, {
      username,
    })

    return data.needsQRCode
  } catch (e: any) {
    console.error(e)
    throw new Error('Error al verificar la necesidad de un código QR')
  }
}
