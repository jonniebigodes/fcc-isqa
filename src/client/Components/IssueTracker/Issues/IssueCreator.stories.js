import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import {withKnobs, text} from '@storybook/addon-knobs/react'
import {action} from '@storybook/addon-actions'
/* eslint-enable */
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'

import IssueCreator from './IssueCreator'

export const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})
export const actions = {
  createIssue: action('createIssue'),
  discardIssue: action('discardIssue')
}
storiesOf('Issuetracker issue creator', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>
  ))
  .add('default', () => {
    return <IssueCreator {...actions} project={text('project', 'Dummy')} />
  })
