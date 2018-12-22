import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import {withKnobs, object, text} from '@storybook/addon-knobs/react'
import {action} from '@storybook/addon-actions'
/* eslint-enable */

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import {issuesdata} from '../../../DummyData/DummyIssues'
import IssueEditor from './IssueEditor'

export const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})

export const actions = {
  editIssue: action('editIssue')
}
storiesOf('Issuetracker issue editor', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>
  ))
  .add('default', () => {
    return (
      <IssueEditor
        {...actions}
        issue={object('issue', {...issuesdata[0].issues[0]})}
        projectName={text('projectName', 'Dummy')}
      />
    )
  })
