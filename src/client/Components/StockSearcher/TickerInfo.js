import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'

const styles = theme => ({
  root: {
    width: 180,
    height: 150,
    display: 'block'
  },
  tickerHeader: {
    paddingTop: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
    height: 45
  },
  tickerHeaderText: {
    color: theme.palette.common.white,
    textAlign: 'center',
    fontSize: 18
  },
  information: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4
  }
})

const TickerInfo = props => {
  const {classes, tickerData} = props
  return (
    <Paper className={classes.root}>
      <div className={classes.tickerHeader}>
        <Typography className={classes.tickerHeaderText}>
          {tickerData.nameOfTicker}
        </Typography>
      </div>
      <div className={classes.information}>
        <Typography variant="body2" align="center">
          {tickerData.price}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              checked={tickerData.tickerLikes > 0}
            />
          }
          label={tickerData.tickerLikes}
        />
      </div>
      <div>
        <Typography variant="caption" align="center">
          Updated at {new Date().toISOString()}
        </Typography>
      </div>
    </Paper>
  )
}
TickerInfo.propTypes = {
  classes: PropTypes.object, // eslint-disable-line
  tickerData: PropTypes.shape({
    id: PropTypes.string,
    tickerLikes: PropTypes.number,
    price: PropTypes.number,
    nameOfTicker: PropTypes.string
  })
}
export default withStyles(styles)(TickerInfo)
