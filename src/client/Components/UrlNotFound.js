import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles'
import notfoundmap from '../Assets/images/404map_opt.png'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  image: {
    [theme.breakpoints.down('sm')]: {
      width: '32px',
      height: '32px'
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '128px',
      height: '128px'
    },
    [theme.breakpoints.up('md')]: {
      width: '512px',
      height: '512px'
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      height: '100%'
    }
  },
  notFoundText: {
    textAlign: 'center',

    [theme.breakpoints.down('sm')]: {
      fontSize: 8,
      fontWeight: 600
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: 12,
      fontWeight: 800
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 24,
      fontWeight: 800
    }
  }
})

const UrlNotFound = props => {
  const {classes} = props
  return (
    <Grid
      container
      spacing={8}
      direction="column"
      justify="center"
      alignItems="center">
      <Grid item xs={12}>
        <figure>
          <img src={notfoundmap} alt="wrong turn" className={classes.image} />
        </figure>
      </Grid>
      <Grid item xs={12}>
        <p className={classes.notFoundText}>404</p>
        <p className={classes.notFoundText}>
          Upsy daisy the item was not found :(
        </p>
      </Grid>
    </Grid>
  )
}
UrlNotFound.propTypes = {
  classes: PropTypes.object.isRequired // eslint-disable-line
}
export default withStyles(styles)(UrlNotFound)
