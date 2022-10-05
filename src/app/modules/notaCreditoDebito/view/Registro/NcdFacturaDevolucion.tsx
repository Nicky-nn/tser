import { Grid } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput';
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard';
import { NcdInputProps } from '../../interfaces/ncdInterface';
import InputNumber from 'rc-input-number';

interface OwnProps {
  form: UseFormReturn<NcdInputProps>;
}

type Props = OwnProps;

const NcdFacturaDevolucion: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      getValues,
      formState: { errors },
    },
  } = props;

  const { update } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'detalleFactura', // unique name for your Field Array
  });
  return (
    <>
      <SimpleCard title={'DATOS DE LA DEVOLUCIÓN'}>
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} xs={12} sx={{ pt: 10 }}>
            <div className="responsive-table" style={{ marginTop: 20 }}>
              <table>
                <thead>
                  <tr>
                    <th scope="col" style={{ width: 100 }}>
                      NRO. ITEM
                    </th>
                    <th scope="col" style={{ width: 160 }}>
                      CANTIDAD
                    </th>
                    <th scope="col">DESCRIPCION</th>
                    <th scope="col" style={{ width: 160 }}>
                      PRECIO UNITARIO
                    </th>
                    <th scope="col" style={{ width: 160 }}>
                      DESCUENTO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getValues('detalleFactura').length > 0 &&
                    getValues('detalleFactura').map((item, index) => {
                      return (
                        <tr key={item.nroItem}>
                          <td data-label="NRO.ITEM">{item.nroItem}</td>
                          <td data-label="CANTIDAD">
                            <InputNumber
                              min={0.1}
                              max={item.cantidadOriginal}
                              value={item.cantidad}
                              onChange={(cantidad: number | null) => {
                                if (cantidad) {
                                  if (cantidad >= 0) {
                                    update(index, {
                                      ...item,
                                      cantidad,
                                    });
                                  }
                                }
                              }}
                              formatter={numberWithCommas}
                            />
                          </td>
                          <td data-label="DESCRIPCIÓN">{item.descripcion}</td>
                          <td data-label="PRECIO" style={{ textAlign: 'right' }}>
                            {numberWithCommas(item.precioUnitario, {})}
                          </td>
                          <td data-label="DESCUENTO" style={{ textAlign: 'right' }}>
                            {numberWithCommas(item.montoDescuento, {})}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Grid>
        </Grid>
      </SimpleCard>
    </>
  );
};

export default NcdFacturaDevolucion;
