import { FormControl, FormHelperText, Grid, TextField } from '@mui/material'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'
import Select, { SingleValue } from 'react-select'

import AlertError from '../../../base/components/Alert/AlertError'
import AlertLoading from '../../../base/components/Alert/AlertLoading'
import { MyInputLabel } from '../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyles } from '../../../base/components/MySelect/ReactSelect'
import { SelectInputLabel } from '../../../base/components/ReactSelect/SelectInputLabel'
import { genReplaceEmpty, isEmptyValue } from '../../../utils/helper'
import useQueryTipoDocumentoIdentidad from '../../sin/hooks/useQueryTipoDocumento'
import { SinTipoDocumentoIdentidadProps } from '../../sin/interfaces/sin.interface'
import { ClienteInputProps } from '../interfaces/cliente'

interface OwnProps {
  formik: FormikProps<ClienteInputProps>
}

type Props = OwnProps

const ClienteForm: FunctionComponent<Props> = (props) => {
  const { formik, ...other } = props

  const { tiposDocumentoIdentidad, tdiLoading, tdiIsError, tdiError } =
    useQueryTipoDocumentoIdentidad()

  if (tdiIsError) {
    return <AlertError mensaje={tdiError?.message!} />
  }

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
          {tdiLoading ? (
            <AlertLoading />
          ) : (
            <FormControl
              fullWidth
              error={Boolean(formik.errors.codigoTipoDocumentoIdentidad)}
            >
              <MyInputLabel shrink>Tipo Documento Identidad</MyInputLabel>

              <Select<SinTipoDocumentoIdentidadProps>
                menuPosition={'fixed'}
                styles={reactSelectStyles}
                options={tiposDocumentoIdentidad}
                name="codigoTipoDocumentoIdentidad"
                placeholder={'Seleccione el tipo documento identidad'}
                value={
                  tiposDocumentoIdentidad
                    ? tiposDocumentoIdentidad.find(
                        (option) =>
                          option.codigoClasificador.toString() ===
                          genReplaceEmpty(
                            formik.values.codigoTipoDocumentoIdentidad?.toString(),
                            '',
                          ),
                      )
                    : null
                }
                onChange={(
                  tipoDocumento: SingleValue<SinTipoDocumentoIdentidadProps>,
                ) => {
                  formik.setFieldValue(
                    'codigoTipoDocumentoIdentidad',
                    genReplaceEmpty(tipoDocumento?.codigoClasificador, null),
                  )
                }}
                isSearchable={false}
                getOptionValue={(item) => item.codigoClasificador.toString()}
                getOptionLabel={(item) => `${item.descripcion}`}
              />
              <FormHelperText>
                {formik.errors.codigoTipoDocumentoIdentidad}
              </FormHelperText>
            </FormControl>
          )}
        </Grid>

        <Grid item lg={12} md={12} xs={12}>
          <TextField
            id="razonSocial"
            name="razonSocial"
            label="Razon Social"
            size="small"
            fullWidth
            value={formik.values.razonSocial}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.razonSocial && Boolean(formik.errors.razonSocial)}
            helperText={formik.touched.razonSocial && formik.errors.razonSocial}
          />
        </Grid>

        <Grid item lg={7} md={7} xs={12}>
          <TextField
            id="numeroDocumento"
            name="numeroDocumento"
            label="Número de documento"
            size="small"
            fullWidth
            value={formik.values.numeroDocumento}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.numeroDocumento && Boolean(formik.errors.numeroDocumento)
            }
            helperText={formik.touched.numeroDocumento && formik.errors.numeroDocumento}
          />
        </Grid>

        <Grid item lg={5} md={5} xs={12}>
          <TextField
            id="complemento"
            name="complemento"
            label="Complemento"
            size="small"
            fullWidth
            value={formik.values.complemento}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.complemento && Boolean(formik.errors.complemento)}
            helperText={formik.touched.complemento && formik.errors.complemento}
          />
        </Grid>

        <Grid item lg={12} md={12} xs={12}>
          <TextField
            id="email"
            name="email"
            label="Correo Electrónico"
            size="small"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
      </Grid>
    </form>
  )
}

export default ClienteForm
