import {createMuiTheme} from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'

export const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})
