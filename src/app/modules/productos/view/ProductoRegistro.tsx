import React, {FunctionComponent} from 'react';
import SimpleContainer from "../../../base/components/Container/SimpleContainer";
import Breadcrumb from "../../../base/components/Template/Breadcrumb/Breadcrumb";

interface OwnProps {
}

type Props = OwnProps;

const ProductoRegistro: FunctionComponent<Props> = (props) => {

    return (
        <SimpleContainer>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Productos', path: '/productos/gestion'},
                        {name: 'Nuevo Producto'},
                    ]}
                />
            </div>
        </SimpleContainer>
    );
};

export default ProductoRegistro;
