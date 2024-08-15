import { gql, GraphQLClient } from 'graphql-request'

const gqlQuery = gql`
  query GetQRCode($username: String!) {
    getQRCode(username: $username)
  }
`

interface Props {
  username: string
}

interface GetQRCodeResponse {
  getQRCode: string | null
}

export const apiGetQRCode = async (props: Props): Promise<string> => {
  const { username } = props
  const url = import.meta.env.ISI_API_WHAPI_URL
  const client = new GraphQLClient(url)

  try {
    const data: GetQRCodeResponse = await client.request(gqlQuery, { username })

    // Verificar si se obtuvo el código QR
    if (data.getQRCode) {
      return data.getQRCode
    } else {
      throw new Error('No se pudo obtener el código QR')
    }
  } catch (e: any) {
    // Manejar errores de GraphQL
    if (e.response?.errors && e.response.errors.length > 0) {
      const graphqlError = e.response.errors[0]
      console.error('Error GraphQL:', graphqlError.message)
      throw new Error(graphqlError.message)
    } else {
      // Manejar otros tipos de errores
      console.error('Error inesperado:', e.message)
      throw new Error('Error al obtener el código QR')
    }
  }
}
