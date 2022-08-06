import {InputLabel, Theme} from "@mui/material";
import {styled} from "@mui/styles";


export const MyInputLabel = styled(InputLabel)(({theme}: { theme: Theme }) => ({
    backgroundColor: theme.palette.primary.contrastText,
    paddingRight: 7,
    paddingLeft: 5,
    fontSize: 17,
}))