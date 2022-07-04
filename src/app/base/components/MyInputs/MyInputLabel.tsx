import {InputLabel, Theme} from "@mui/material";
import {styled} from "@mui/system";
import React, {FunctionComponent} from "react";
import {InputLabelProps} from "@mui/material/InputLabel/InputLabel";


export const MyInputLabel: FunctionComponent<InputLabelProps> = styled(InputLabel)(({theme}: { theme: Theme }) => ({
    backgroundColor: theme.palette.primary.contrastText,
    paddingRight: 7,
    paddingLeft: 5,
    fontSize: 17,
}))

