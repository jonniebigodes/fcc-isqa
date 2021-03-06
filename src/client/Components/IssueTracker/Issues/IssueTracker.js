import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import {MuiThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import {theme} from '../../../theme/MuiTheme'
import IssueTrackerContainer from './IssueTrackerContainer'
import {IssuesProvider} from '../../../contexts/IssuesContext'

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
