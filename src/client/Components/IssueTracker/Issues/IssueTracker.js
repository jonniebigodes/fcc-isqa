import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import IssueTrackerContainer from './IssueTrackerContainer'
import {IssuesProvider} from '../../../contexts/IssuesContext'

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})

const IssueTrackerApp = props => {
  const {match} = props
  const {params} = match

  return (
    <div>
      <Helmet
        title="Super Duper Issue Tracker"
        meta={[
          {
            name: 'description',
            content: 'freeCodeCamp ISQA challenges Issue Tracker'
          },
          {
            name: 'keywords',
            content: 'react, fcc, challenges,isqa,issue tracker'
          }
        ]}
      />
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <IssuesProvider>
          <IssueTrackerContainer projectID={params.project} />
        </IssuesProvider>
      </MuiThemeProvider>
    </div>
  )
}
IssueTrackerApp.propTypes = {
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.shape({
      project: PropTypes.string
    }),
    path: PropTypes.string,
    url: PropTypes.string
  })
}
export default IssueTrackerApp
