import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import StoryRouter from 'storybook-react-router'
/* eslint-enable */
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import IssueTrackerContainer from './IssueTrackerContainer'
import {IssuesProvider} from '../../../contexts/IssuesContext'

export const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})

storiesOf('Issuetracker container', module)
  .addDecorator(StoryRouter())
  .addDecorator(story => (
    <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>
  ))
  .addDecorator(providerStory => (
    <IssuesProvider>{providerStory()}</IssuesProvider>
  ))
  .add('default', () => (
    <IssueTrackerContainer projectID="5b918753e42b2800ec674e40" />
  ))
