import { InputLabel, Theme } from '@mui/material'
import { InputLabelProps } from '@mui/material/InputLabel/InputLabel'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '&.MuiInputLabel-shrink': {
      background: `linear-gradient(180deg, rgba(255,0,0,0) 25%, rgba(255,0,0,0) 25% 50%, ${theme.palette.background.default} 50% 75%, rgba(255,0,0,0) 75%)`,
      paddingLeft: 6,
      paddingRight: 6,
    },
  },
}))

interface OwnProps extends InputLabelProps {}

type Props = OwnProps

export const MyInputLabel = ({ ...other }: Props): JSX.Element => {
  const classes = useStyles()
  return <InputLabel shrink className={classes.root} {...other} />
}
