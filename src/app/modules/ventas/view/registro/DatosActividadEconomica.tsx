import { FormControl, FormHelperText } from '@mui/material';
import React, { FunctionComponent, useEffect } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import Select from 'react-select';

import AlertError from '../../../../base/components/Alert/AlertError';
import AlertLoading from '../../../../base/components/Alert/AlertLoading';
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel';
import { reactSelectStyles } from '../../../../base/components/MySelect/ReactSelect';
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard';
import useAuth from '../../../../base/hooks/useAuth';
import useQueryActividades from '../../../sin/hooks/useQueryActividades';
import { SinActividadesProps } from '../../../sin/interfaces/sin.interface';
import { FacturaInputProps } from '../../interfaces/factura';

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>;
}

type Props = OwnProps;

const DatosActividadEconomica: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      reset,
      getValues,
      formState: { errors, isSubmitted, isSubmitSuccessful },
    },
  } = props;
  const { user } = useAuth();
  const { actividades, actIsError, actError, actLoading } = useQueryActividades();

  useEffect(() => {
    setValue('actividadEconomica', user.actividadEconomica);
  }, []);

  if (actIsError) {
    return <AlertError mensaje={actError?.message!} />;
  }

  return (
    <>
      <SimpleCard>
        {actLoading ? (
          <AlertLoading />
        ) : (
          <Controller
            name="actividadEconomica"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.actividadEconomica)}>
                <MyInputLabel shrink>Actividad Económica</MyInputLabel>
                <Select<SinActividadesProps>
                  {...field}
                  styles={reactSelectStyles}
                  name="actividadEconomica"
                  placeholder={'Seleccione la actividad económica'}
                  value={field.value}
                  onChange={async (val: any) => {
                    field.onChange(val);
                  }}
                  onBlur={async (val) => {
                    field.onBlur();
                  }}
                  isSearchable={false}
                  options={actividades}
                  getOptionValue={(item) => item.codigoCaeb}
                  getOptionLabel={(item) =>
                    `${item.tipoActividad} - ${item.codigoCaeb} - ${item.descripcion}`
                  }
                />
                {errors.actividadEconomica && (
                  <FormHelperText>{errors.actividadEconomica?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}
      </SimpleCard>
    </>
  );
};

export default DatosActividadEconomica;
