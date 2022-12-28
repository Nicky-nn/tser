import { FormControl, FormHelperText, Grid, TextField } from '@mui/material'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'
import Select, { SingleValue } from 'react-select'

import AlertError from '../../../base/components/Alert/AlertError'
import AlertLoading from '../../../base/components/Alert/AlertLoading'
import { MyInputLabel } from '../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyles } from '../../../base/components/MySelect/ReactSelect'
import { genReplaceEmpty } from '../../../utils/helper'
import useQueryTiposProducto from '../hooks/useQueryTiposProducto'
import {
  TipoProductoInputProp,
  TipoProductoProps,
} from '../interfaces/tipoProducto.interface'

interface OwnProps {
  formik: FormikProps<TipoProductoInputProp>
}

type Props = OwnProps

const TipoProductoForm: FunctionComponent<Props> = (props) => {
  const { formik } = props

  const { tiposProducto, tpLoading, tpError, tpIsError } = useQueryTiposProducto()

  if (tpIsError) return <AlertError mensaje={tpError!.message!} />

  return (
    <>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            {tpLoading ? (
              <AlertLoading />
            ) : (
              <FormControl
                fullWidth
                color={'warning'}
                error={Boolean(formik.errors.codigoParent)}
              >
                <MyInputLabel shrink>Tipo Producto</MyInputLabel>
                <Select<TipoProductoProps>
                  styles={reactSelectStyles}
                  menuPosition={'fixed'}
                  name="codigoParent"
                  isClearable
                  placeholder={'Seleccione el tipo de actividad'}
                  value={
                    tiposProducto
                      ? tiposProducto.find(
                          (item) => item._id === formik.values.codigoParent,
                        )
                      : null
                  }
                  onChange={async (tipoProducto: SingleValue<TipoProductoProps>) => {
                    formik.setFieldValue(
                      'codigoParent',
                      genReplaceEmpty(tipoProducto?._id, null),
                    )
                  }}
                  isSearchable={false}
                  options={tiposProducto}
                  getOptionValue={(item) => item._id}
                  getOptionLabel={(item) => `${item.parientes}`}
                />
                <FormHelperText>{formik.errors.codigoParent}</FormHelperText>
              </FormControl>
            )}
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <TextField
              name="descripcion"
              label="Descripción"
              size="small"
              fullWidth
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
              helperText={formik.touched.descripcion && formik.errors.descripcion}
            />
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default TipoProductoForm
