import React, { FunctionComponent } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard';
import {
  GIFT_CARD_VARIANTE_INITIAL_VALUES,
  GiftCardInputProps,
} from '../../interfaces/giftCard.interface';
import GiftCardVariante from './denominacion/GiftCardVariante';
import { Button, Grid } from '@mui/material';
import { genRandomString } from '../../../../utils/helper';

interface OwnProps {
  form: UseFormReturn<GiftCardInputProps>;
}

type Props = OwnProps;

const GiftCardDenominacion: FunctionComponent<Props> = (props) => {
  const { form } = props;
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const [variantesWatch] = watch(['variantes']);
  const variantesField = useFieldArray({
    control,
    name: 'variantes',
  });
  const agregarDenominacion = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    variantesField.append({
      ...GIFT_CARD_VARIANTE_INITIAL_VALUES,
      id: genRandomString(10),
    });
  };

  return (
    <SimpleCard title={'DENOMINACIONES'}>
      <Grid container item rowSpacing={2}>
        {variantesField.fields.map((item, index) => (
          <GiftCardVariante
            key={item.id}
            form={form}
            itemField={item}
            varianteField={variantesField}
            index={index}
          />
        ))}
      </Grid>
      <Grid container item sx={{ mt: 2, mr: 20 }} direction={'row-reverse'}>
        <Button
          variant={'outlined'}
          size={'small'}
          onClick={(event) => agregarDenominacion(event)}
        >
          Agregar Denominación
        </Button>
      </Grid>
    </SimpleCard>
  );
};

export default GiftCardDenominacion;
