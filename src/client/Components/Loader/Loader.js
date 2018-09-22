import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  progress: {
    display: 'block',
    paddding: theme.spacing.unit,
    margin: '0 auto'
  }
})
const Loader = props => {
  const {classes} = props
  return (
    <div>
      <Typography align="center" gutterBottom variant="display2">
        Loading.....
      </Typography>
      <div>
        <CircularProgress
          className={classes.progress}
          size={100}
          thickness={5}
        />
      </div>
    </div>
  )
}
Loader.propTypes = {
  classes: PropTypes.object.isRequired // eslint-disable-line
}
export default withStyles(styles)(Loader)
