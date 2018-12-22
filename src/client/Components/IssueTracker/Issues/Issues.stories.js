import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {withKnobs, object} from '@storybook/addon-knobs/react'
/* eslint-enable */
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import Issues from './Issues'
import {issuesdata} from '../../../DummyData/DummyIssues'

export const actions = {
  delIssue: action('delIssue'),
  closeIssue: action('closeIssue')
}

export const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})

storiesOf('Issue Tracker Issues', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>
  ))
  .add('empty', () => (
    <Issues
      projectIssues={object('projectIssues', issuesdata[1])}
      {...actions}
    />
  ))
  .add('default', () => {
    return (
      <Issues
        projectIssues={object('projectIssues', issuesdata[0])}
        {...actions}
      />
    )
  })
