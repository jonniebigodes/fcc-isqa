import React from 'react'
import Helmet from 'react-helmet'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import {MuiThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import ContactSupport from '@material-ui/icons/ContactSupport'
import NoteAdd from '@material-ui/icons/NoteAdd'
import BookContainer from './BookContainer'
import {theme} from '../../theme/MuiTheme'
import {
  PersonalLibraryProvider,
  PersonalLibraryContext
} from '../../contexts/PersonalLibraryContext'

import BookDrawerInfo from './BookDrawerInfo'
import BookDrawer from './BookDrawer'

const BookApp = () => {
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
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
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
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <BookContainer
                    appError={isError}
                    getdata={getLibraryData}
                    isloading={loading}
                  />
                </Grid>
                <Grid item xs={6}>
                  <div>
                    <Tooltip title="Show endpoints">
                      <ContactSupport
                        style={{margin: '0 auto', fontSize: 32}}
                        onClick={() => changeInfoDrawer()}
                      />
                    </Tooltip>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div>
                    <Tooltip title="Click me to add book">
                      <NoteAdd
                        style={{fontSize: 32}}
                        onClick={() => changeDrawerStatus()}
                      />
                    </Tooltip>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <BookDrawerInfo
                    onInfoOpen={changeInfoDrawer}
                    infoOpen={drawerInfoOpen}
                  />
                  <BookDrawer
                    bookaddOpen={drawerOpen}
                    bookaddVisibility={changeDrawerStatus}
                  />
                </Grid>
              </Grid>
            )}
          </PersonalLibraryContext.Consumer>
        </PersonalLibraryProvider>
      </MuiThemeProvider>
    </div>
  )
}

export default BookApp
