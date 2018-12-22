import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {withKnobs, object} from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-react-router'
/* eslint-enable */
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import Projects from './Projects'
import {projectsData} from '../../../DummyData/DummyIssues'

export const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})

export const actions = {
  deleteProject: action('deleteProject')
}
storiesOf('ProjectsList', module)
  .addDecorator(withKnobs)
  .addDecorator(StoryRouter())
  .addDecorator(story => (
    <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>
  ))
  .add('default', () => (
    <Projects
      {...actions}
      projectsData={object('projectsData', [...projectsData])}
    />
  ))
