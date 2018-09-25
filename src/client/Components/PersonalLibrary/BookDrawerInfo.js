import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import BookEndpoints from './BookEndpoints'

const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
}

const BookDrawerInfo = props => {
  const {classes, infoOpen, onInfoOpen} = props
  return (
    <Drawer anchor="bottom" open={infoOpen} onClose={() => onInfoOpen()}>
      <div className={classes.fullList}>
        <BookEndpoints />
        <Divider />
        <Typography gutterBottom align="center" variant="headline">
          List of endpoints available
        </Typography>
      </div>
    </Drawer>
  )
}
BookDrawerInfo.propTypes = {
  classes: PropTypes.shape({}),
  infoOpen: PropTypes.bool,
  onInfoOpen: PropTypes.func
}
export default withStyles(styles)(BookDrawerInfo)
