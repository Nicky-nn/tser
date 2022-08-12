import React, {FunctionComponent} from 'react';
import {StandardTextFieldProps, TextField} from "@mui/material";

interface OwnProps extends StandardTextFieldProps {
}

type Props = OwnProps;

const FormTextField: FunctionComponent<Props> = (props) => {

    return (
        <TextField
            variant={'outlined'}
            size={'small'}
            fullWidth
            {...props}
        >
            {props.children}
        </TextField>
    );
};

export default FormTextField;
