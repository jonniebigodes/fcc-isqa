import React from 'react'
import Helmet from 'react-helmet'
import {MuiThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import {theme} from '../../../theme/MuiTheme'
import {ProjectsProvider} from '../../../contexts/ProjectsContext'
import ProjectsContainer from './ProjectsContainer'

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
