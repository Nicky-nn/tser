// noinspection GraphQLUnresolvedReference

import {gql, GraphQLClient} from "graphql-request";
import {ClasificadorProps, SinActividadesProps} from "../../../interfaces";
import {AccessToken} from "../../../base/models/paramsModel";

export interface FacturaProps {
    sinTipoMetodoPago: ClasificadorProps[],
    sinUnidadMedida: ClasificadorProps[],
    sinActividades: SinActividadesProps[],
}


const query = gql`
    query LISTADO {
        facturaCompraVentaAll(
            reverse: true,
        ) {
            docs {
                _id
                nitEmisor
                razonSocialEmisor
                numeroFactura
                tipoFactura{
                    codigoClasificador
                    descripcion
                }
                tipoEmision{
                    codigoClasificador
                    descripcion
                }
                cuf
                cufd{
                    codigo
                    codigoControl
                    direccion
                    fechaVigencia
                    fechaInicial
                }
                cuis{
                    codigo
                    fechaVigencia
                }
                sucursal{
                    codigo
                    direccion
                    telefono
                    departamento{
                        codigo
                        codigoPais
                        sigla
                        departamento
                    }
                    municipio
                }
                puntoVenta{
                    codigo
                    tipoPuntoVenta{
                        codigoClasificador
                        descripcion
                    }
                    nombre
                    descripcion
                }
                fechaEmision
                cliente{
                    razonSocial
                    codigoCliente
                    tipoDocumentoIdentidad{
                        codigoClasificador
                        descripcion
                    }
                    numeroDocumento
                    complemento
                    nombres
                    apellidos
                    email
                }
                metodoPago{
                    codigoClasificador
                    descripcion
                }
                numeroTarjeta,
                montoTotal
                montoGiftCard
                montoTotalLiteral
                montoTotalSujetoIva
                moneda{
                    codigoClasificador
                    descripcion
                }
                tipoCambio
                montoGiftCard
                detalle{
                    nroItem
                    actividadEconomica{
                        codigoCaeb
                        descripcion
                        tipoActividad
                    }
                    productoServicio{
                        codigoActividad
                        codigoProducto
                        descripcionProducto
                    }
                    producto
                    descripcion
                    cantidad
                    unidadMedida{
                        codigoClasificador
                        descripcion
                    }
                    precioUnitario
                    montoDescuento
                    subTotal
                    numeroImei
                    numeroSerie
                }
                representacionGrafica{
                    pdf
                    xml
                    rollo
                }
                usucre
            }
        }
    }
`

export const fetchFacturaListado = async (): Promise<FacturaProps> => {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query)
    return data;
}