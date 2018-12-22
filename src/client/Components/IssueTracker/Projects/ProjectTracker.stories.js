import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import StoryRouter from 'storybook-react-router'
/* eslint-enable */
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import ProjectsContainer from './ProjectsContainer'
import {ProjectsProvider} from '../../../contexts/ProjectsContext'

export const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})

storiesOf('Project tracker App', module)
  .addDecorator(StoryRouter())
  .addDecorator(story => (
    <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>
  ))
  .addDecorator(providerStory => (
    <ProjectsProvider>{providerStory()}</ProjectsProvider>
  ))
  .add('default', () => <ProjectsContainer />)
