import React from 'react'
import Helmet from 'react-helmet'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import {ProjectsProvider} from '../../../contexts/ProjectsContext'
import ProjectsContainer from './ProjectsContainer'

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})

const Projects = () => (
  <div>
    <Helmet
      title="Super Duper Project Issue Tracker"
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
      <ProjectsProvider>
        <ProjectsContainer />
      </ProjectsProvider>
    </MuiThemeProvider>
  </div>
)
export default Projects
