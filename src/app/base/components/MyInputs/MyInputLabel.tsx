import React from 'react';
import {InputLabel, Theme} from "@mui/material";
import {InputLabelProps} from "@mui/material/InputLabel/InputLabel";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles((theme:Theme) => ({
    root: {
        "&.MuiInputLabel-shrink": {
            backgroundColor: theme.palette.primary.contrastText,
            paddingLeft: 6,
            paddingRight: 6,
        }
    }
}));

interface OwnProps extends InputLabelProps {
}

type Props = OwnProps;

export const MyInputLabel = ({...other}: Props): JSX.Element => {
    const classes = useStyles();
    return (
        <InputLabel
            shrink
            className={classes.root}
            {...other}
        />
    );
};