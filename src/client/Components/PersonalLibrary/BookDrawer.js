import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import BookAdd from './BookAdd'

const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
}
const BookDrawer = props => {
  const {classes,bookaddVisibility,bookaddOpen} = props
  return (
    <Drawer
          anchor="bottom"
          open={bookaddOpen}
          onClose={() => bookaddVisibility()}>
          <div className={classes.fullList}>
            <BookAdd />
          </div>
        </Drawer>

  )
}
BookDrawer.propTypes = {
  classes: PropTypes.shape({}),
  bookaddOpen:PropTypes.bool,
  bookaddVisibility:PropTypes.func
}
export default withStyles(styles)(BookDrawer)
