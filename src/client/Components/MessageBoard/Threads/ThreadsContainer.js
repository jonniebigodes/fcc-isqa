import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import ThreadCreator from './ThreadCreator'
import ThreadList from './ThreadList'
import {ThreadsContext} from '../../../contexts/ThreadsContext'

const styles = theme => ({
  container: {
    minHeight: '480px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  errorButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingMessage: {
    marginTop: theme.spacing.unit * 4
  }
})

const ThreadsContainer = props => {
  const {classes} = props
  return (
    <ThreadsContext.Consumer>
      {({
        loadingThreads,
        threadError,
        threadErrorMessage,
        selectedBoard,
        makeNewThread,
        markThreadReported,
        purgeThread
      }) => {
        if (loadingThreads) {
          return (
            <div className={classes.container}>
              <Typography align="center" gutterBottom variant="h2">
                Anonymous Message Board
              </Typography>
              <div className={classes.loadingMessage}>
                <Typography align="center" gutterBottom variant="h3">
                  Loading Threads
                </Typography>
              </div>
            </div>
          )
        }
        if (threadError) {
          return (
            <div className={classes.container}>
              <Typography align="center" gutterBottom variant="display2">
                Anonymous Message Board
              </Typography>
              <div className={classes.errorMessage}>
                <Typography align="center" gutterBottom variant="display2">
                  That went south real fast
                </Typography>
              </div>
              <div>
                <Typography align="center" gutterBottom variant="h3">
                  {threadErrorMessage}
                </Typography>
                <div className={classes.errorButton}>
                  <Button
                    variant="outlined"
                    size="small"
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
            <Typography align="center" gutterBottom variant="h2">
              /b/ - {selectedBoard.title}
            </Typography>
            <Divider />
            <ThreadCreator add={makeNewThread} />
            <Divider />
            <ThreadList
              threadInfo={selectedBoard}
              reportThread={markThreadReported}
              deleteThread={purgeThread}
            />
          </div>
        )
      }}
    </ThreadsContext.Consumer>
  )
}
ThreadsContainer.propTypes = {
  classes: PropTypes.shape({}),
  boardData: PropTypes.string // eslint-disable-line
}
export default withStyles(styles)(ThreadsContainer)
