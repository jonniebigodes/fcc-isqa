import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import IssueEditor from './IssueEditor'
import {IssuesContext} from '../../../contexts/IssuesContext'
import IssueCreator from './IssueCreator'
import Issues from './Issues'
import IssuesEndpoint from './IssueEndpoints'

const styles = theme => ({
  container: {
    minHeight: '480px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: theme.spacing.unit
  },

  progress: {
    display: 'block',
    paddding: theme.spacing.unit,
    margin: '0 auto'
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
    }
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  endpointButton: {
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
  }
})

const IssueTrackerContainer = props => {
  const {classes} = props
  return (
    <IssuesContext.Consumer>
      {({
        showEndpoints,
        endpointsVisible,
        isloading,
        appError,
        appErrorMessage,
        projectInfo,
        issueInject,
        issueIsEdit,
        editData,
        changeEditMode,
        changeIssue,
        removeIssue,
        projectCloseIssue
      }) => {
        if (isloading) {
          return (
            <div className={classes.container}>
              <Typography align="center" gutterBottom variant="display2">
                Loading Project Issues....
              </Typography>
              <div>
                <CircularProgress
                  className={classes.progress}
                  size={200}
                  thickness={4}
                />
              </div>
            </div>
          )
        }
        if (appError) {
          return (
            <div className={classes.container}>
              <Typography align="center" gutterBottom variant="display2">
                That went south real fast
              </Typography>
              <div className={classes.progress}>
                <Typography align="center" gutterBottom variant="display3">
                  {appErrorMessage}
                </Typography>
              </div>
              <div className={classes.errorButton}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => window.location.reload()}>
                  Reload
                </Button>
              </div>
            </div>
          )
        }
        return (
          <div className={classes.container}>
            <Typography align="center" gutterBottom variant="display2">
              Issue Tracker
            </Typography>
            <IssueCreator createIssue={issueInject} />
            <div>
              <Issues
                projectIssues={projectInfo}
                delIssue={removeIssue}
                closeIssue={projectCloseIssue}
                issueEdit={changeEditMode}
              />
            </div>

            <Drawer
              anchor="bottom"
              open={showEndpoints}
              onClose={() => endpointsVisible()}>
              <IssuesEndpoint />
            </Drawer>
            {/* eslint-disable */}
            <button
              className={classes.endpointButton}
              title="Show Endpoints"
              onClick={() => endpointsVisible()}>
              Endpoints
            </button>
            {/* eslint-enable */}
            <Drawer
              anchor="bottom"
              open={issueIsEdit}
              onClose={() => changeEditMode('')}>
              <IssueEditor
                issue={editData}
                editIssue={changeIssue}
                cancelEdit={changeEditMode}
              />
            </Drawer>
          </div>
        )
      }}
    </IssuesContext.Consumer>
  )
}

IssueTrackerContainer.propTypes = {
  classes: PropTypes.shape({})
}

export default withStyles(styles)(IssueTrackerContainer)
