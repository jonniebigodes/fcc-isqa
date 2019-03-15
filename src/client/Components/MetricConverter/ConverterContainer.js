import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Converter from './Converter'

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  inputMessage: {
    marginTop: theme.spacing.unit * 2
  }
})

const ConverterContainer = props => {
  const {classes, metricError, metricErrorMessage, metricresult} = props
  return (
    <React.Fragment>
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography gutterBottom variant="headline" align="center">
            Super Duper Metric Converter
          </Typography>
          <Converter />
          <div className={classes.inputMessage}>
            {/* eslint-disable */}
            <Typography
              gutterBottom
              align="center"
              variant={metricError ? 'headline' : 'caption'}>
              {metricError
                ? metricErrorMessage
                : metricresult.initUnit
                ? JSON.stringify(metricresult)
                : ''}{' '}
              {/* eslint-enable */}
            </Typography>
          </div>
        </Paper>
      </div>
    </React.Fragment>
  )
}

ConverterContainer.propTypes = {
  classes: PropTypes.shape({}),
  metricError: PropTypes.bool,
  metricErrorMessage: PropTypes.string,
  metricresult: PropTypes.shape({
    initUnit: PropTypes.string,
    initNum: PropTypes.number,
    returnNum: PropTypes.number,
    returnUnit: PropTypes.string,
    stringresult: PropTypes.string
  })
}
ConverterContainer.defaultProps = {
  metricError: false,
  metricErrorMessage: ''
}
export default withStyles(styles)(ConverterContainer)
