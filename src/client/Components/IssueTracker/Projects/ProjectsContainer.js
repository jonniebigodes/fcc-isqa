import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import {ProjectsContext} from '../../../contexts/ProjectsContext'
import ProjectCreator from './ProjectCreator'
import Projects from './Projects'
import ProjectEndpoints from './ProjectEndpoints'

const styles = theme => ({
  container: {
    minHeight: '480px',
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },

  progress: {
    display: 'block',
    paddding: theme.spacing.unit,
    margin: '0 auto'
  },
  buttonEndpoints: {
    position: 'fixed',
    bottom: '25px',
    right: '30px',
    zIndex: 99,
    fontSize: '18px',
    border: 'none',
    outline: 'none',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    cursor: 'pointer',
    padding: '15px',
    borderRadius: '4px'
  },
  errorButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  root: {
    backgroundColor: 'transparent',
    padding: theme.spacing.unit,
    textAlign: 'center',
    marginTop: theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      fontSize: 10
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: 24
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 60
    },
    layoutProjects: {
      paddingTop: theme.spacing.unit
    }
  }
})

const ProjectsContainer = props => {
  const {classes} = props
  return (
    <ProjectsContext.Consumer>
      {({
        endpointsVisible,
        showEndpoints,
        isloading,
        appIsError,
        appErrorMessage,
        projects,
        addProject,
        removeProject
      }) => {
        if (isloading) {
          return (
            <div className={classes.container}>
              <Typography align="center" gutterBottom variant="display2">
                Loading.....
              </Typography>
              <div>
                <CircularProgress
                  className={classes.progress}
                  size={200}
                  thickness={5}
                />
              </div>
            </div>
          )
        }
        if (appIsError) {
          return (
            <div className={classes.container}>
              <Typography align="center" gutterBottom variant="display2">
                That went south real fast
              </Typography>
              <div className={classes.progress}>
                <Typography align="center" gutterBottom variant="display3">
                  {appErrorMessage}
                </Typography>
                <div className={classes.errorButton}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => window.location.reload()}>
                    Reload
                  </Button>
                </div>
              </div>
            </div>
          )
        }

        return (
          <div className={classes.container}>
            <Typography align="center" gutterBottom variant="display2">
              Project Tracker
            </Typography>
            <ProjectCreator projectCreate={addProject} />
            <div className={classes.layoutProjects}>
              <Projects projectsData={projects} deleteProject={removeProject} />
            </div>
            <Drawer
              anchor="bottom"
              open={showEndpoints}
              onClose={() => endpointsVisible()}>
              <ProjectEndpoints />
            </Drawer>
            {/* eslint-disable */}
            <button
              className={classes.buttonEndpoints}
              title="Show Endpoints"
              onClick={() => endpointsVisible()}>
              Endpoints
            </button>
            {/* eslint-enable */}
          </div>
        )
      }}
    </ProjectsContext.Consumer>
  )
}

ProjectsContainer.propTypes = {
  classes: PropTypes.shape({})
}
export default withStyles(styles)(ProjectsContainer)
