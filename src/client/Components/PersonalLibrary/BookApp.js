import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import {withStyles} from '@material-ui/core/styles'
import ContactSupport from '@material-ui/icons/ContactSupport'
import NoteAdd from '@material-ui/icons/NoteAdd'
import BookContainer from './BookContainer'
import {
  PersonalLibraryProvider,
  PersonalLibraryContext
} from '../../contexts/PersonalLibraryContext'

import BookDrawerInfo from './BookDrawerInfo'
import BookDrawer from './BookDrawer'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit
  },
  buttonInfo: {
    zIndex: 1,
    width: 36,
    height: 36,
    margin: theme.spacing.unit,
    border: '3px solid #73AD21'
  },
  icon: {
    margin: '0 auto',
    fontSize: 32
  },
  righticon: {
    fontSize: 32
  }
})

const BookApp = props => {
  const {classes} = props
  return (
    <div>
      <Helmet
        title="Super Duper Personal library"
        meta={[
          {
            name: 'description',
            content: 'freeCodeCamp ISQA Challenges Personal Library'
          },
          {
            name: 'keywords',
            content: 'react,fcc,challenges,isqa,personal library'
          }
        ]}
      />
      <PersonalLibraryProvider>
        <PersonalLibraryContext.Consumer>
          {({
            getLibraryData,
            isError,
            changeInfoDrawer,
            drawerInfoOpen,
            drawerOpen,
            changeDrawerStatus,
            loading
          }) => (
            <div>
              <BookDrawerInfo
                onInfoOpen={changeInfoDrawer}
                infoOpen={drawerInfoOpen}
              />
              <div>
                <BookDrawer
                  bookaddOpen={drawerOpen}
                  bookaddVisibility={changeDrawerStatus}
                />
              </div>
              <div className={classes.root}>
                <BookContainer
                  appError={isError}
                  getdata={getLibraryData}
                  isloading={loading}
                />
              </div>
              <Grid
                container
                spacing={8}
                alignItems="center"
                justify="flex-end">
                <Grid item xs={8}>
                  <div>
                    <Tooltip title="Show endpoints">
                      <ContactSupport
                        className={classes.icon}
                        onClick={() => changeInfoDrawer()}
                      />
                    </Tooltip>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div>
                    <Tooltip title="Click me to add book">
                      <NoteAdd
                        className={classes.righticon}
                        onClick={() => changeDrawerStatus()}
                      />
                    </Tooltip>
                  </div>
                </Grid>
              </Grid>
            </div>
          )}
        </PersonalLibraryContext.Consumer>
      </PersonalLibraryProvider>
    </div>
  )
}
BookApp.propTypes = {
  classes: PropTypes.shape({})
}
export default withStyles(styles)(BookApp)
