import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import StockSearch from './StockSearch'
import TickerInfo from './TickerInfo'

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block'
  },

  errorMessage: {
    ...theme.typography.button,
    paddingTop: theme.spacing.unit * 3
  },
  itemsGrid: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    width: 'auto'
  }
})

const StockContainer = props => {
  const {classes, isError, errormessage, stockData, resetError} = props
  return (
    <div className={classes.layout}>
      <Typography gutterBottom variant="headline" align="center">
        Super Duper Stock Searcher
      </Typography>
      <StockSearch />
      <div>
        {isError && (
          <Tooltip title="Click me to dismiss">
            {/* eslint-disable */}
            <div className={classes.errorMessage} onClick={resetError}>
              <Typography align="center" gutterBottom variant="display1">
                That went south real fast
              </Typography>
              <Typography align="center" gutterBottom variant="body2">
                {errormessage}
              </Typography>
            </div>
            {/* eslint-enable */}
          </Tooltip>
        )}
      </div>
      <div className={classes.itemsGrid}>
        <Grid container justify="center" spacing={16}>
          {stockData.map(item => (
            <Grid
              key={`grid_item_${item.id}`}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}>
              <TickerInfo
                key={`ticker_item_${item.id}`}
                tickerData={{
                  id: item.id,
                  tickerLikes: item.tickerLikes,
                  price: item.tickerPrice,
                  nameOfTicker: item.ticker
                }}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  )
}
StockContainer.propTypes = {
  classes: PropTypes.shape({}),
  isError: PropTypes.bool,
  errormessage: PropTypes.string,
  stockData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      ticker: PropTypes.string,
      tickerPrice: PropTypes.number,
      tickerLikes: PropTypes.number
    })
  ),
  resetError: PropTypes.func
}
StockContainer.defaultProps = {
  isError: false,
  errormessage: '',
  stockData: []
}
export default withStyles(styles)(StockContainer)
