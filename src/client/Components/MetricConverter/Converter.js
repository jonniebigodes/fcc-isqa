import React from 'react'
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import {MetricConverterContext} from '../../contexts/MetricConverterContext'

const styles = theme => ({
  root: {
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 350,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit
  }
})
const Converter = props => {
  const {classes} = props
  return (
    <MetricConverterContext.Consumer>
      {({convertInput, convert,addInputConvert}) => (
        <div className={classes.root}>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Units to convert</InputLabel>
              <Input
                value={convertInput}
                onChange={event => addInputConvert(event.target.value)}
                inputProps={{
                  'aria-label': 'Convert Units'
                }}
              />
            </FormControl>
          </form>
          <Tooltip title="Make the conversion">
            <Button
              className={classes.button}
              onClick={() => convert()}
              type="submit"
              fullWidth
              variant="raised"
              color="primary">
              Convert
            </Button>
          </Tooltip>
        </div>
      )}
    </MetricConverterContext.Consumer>
  )
}
Converter.propTypes={
  classes:PropTypes.object.isRequired // eslint-disable-line
}
export default withStyles(styles)(Converter)
