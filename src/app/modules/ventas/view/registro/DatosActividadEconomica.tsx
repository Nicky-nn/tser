import React, {FunctionComponent, useEffect} from 'react';
import {FormControl} from "@mui/material";
import {setFactura} from "../../slices/facturacion/factura.slice";
import {useAppSelector} from "../../../../hooks";
import {useDispatch} from "react-redux";
import {SinActividadesProps} from "../../../sin/interfaces/sin.interface";
import SimpleCard from "../../../../base/components/Template/Cards/SimpleCard";
import {SelectInputLabel} from "../../../../base/components/ReactSelect/SelectInputLabel";
import {reactSelectStyles} from "../../../../base/components/MySelect/ReactSelect";
import Select from "react-select";
import {genReplaceEmpty} from "../../../../utils/helper";
import useQueryActividades from "../../../sin/hooks/useQueryActividades";
import AlertError from "../../../../base/components/Alert/AlertError";
import AlertLoading from "../../../../base/components/Alert/AlertLoading";
import useAuth from "../../../../base/hooks/useAuth";

interface OwnProps {
}

type Props = OwnProps;

const DatosActividadEconomica: FunctionComponent<Props> = () => {
    const factura = useAppSelector(state => state.factura);
    const {user} = useAuth()
    const dispatch = useDispatch();
    const {actividades, actIsError, actError, actLoading} = useQueryActividades()

    // Inicializacion de actividad economica dado por el usuario activo
    useEffect(() => {
        dispatch(setFactura({...factura, actividadEconomica: user.actividadEconomica}))
    }, []);

    if (actIsError) {
        return <AlertError mensaje={actError?.message!}/>
    }

    return (
        <>
            <SimpleCard>
                {
                    actLoading ? <AlertLoading/> :
                        (
                            <FormControl fullWidth>
                                <SelectInputLabel shrink>
                                    Actividad Económica
                                </SelectInputLabel>
                                <Select<SinActividadesProps>
                                    styles={reactSelectStyles}
                                    menuPosition={'fixed'}
                                    name="actividadEconomica"
                                    placeholder={'Seleccione la actividad económica'}
                                    value={genReplaceEmpty(factura.actividadEconomica, null)}
                                    onChange={async (val: any) => {
                                        dispatch(setFactura({
                                            ...factura,
                                            actividadEconomica: val,
                                            detalle: []
                                        }))
                                    }}
                                    isSearchable={false}
                                    options={actividades}
                                    getOptionValue={(item) => item.codigoCaeb}
                                    getOptionLabel={(item) => `${item.tipoActividad} - ${item.codigoCaeb} - ${item.descripcion}`}
                                />
                            </FormControl>
                        )
                }

            </SimpleCard>

        </>
    );
};

export default DatosActividadEconomica;
