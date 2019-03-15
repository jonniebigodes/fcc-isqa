import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import {withStyles} from '@material-ui/core/styles'
import {RepliesContext} from '../../../contexts/RepliesContext'
import ReplyCreator from './ReplyCreator'
import ReplyList from './ReplyList'

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

const RepliesContainer = props => {
  const {classes} = props
  return (
    <RepliesContext.Consumer>
      {({
        loadingReplies,
        repliesError,
        repliesErrorMessage,
        boardName,
        listofReplies,
        addNewReply,
        markReplyReported,
        purgeReply
      }) => {
        if (loadingReplies) {
          return (
            <div className={classes.container}>
              <Typography align="center" gutterBottom component="h2">
                Anonymous Message Board
              </Typography>
              <div className={classes.loadingMessage}>
                <Typography align="center" gutterBottom variant="h4">
                  Loading Replies
                </Typography>
              </div>
            </div>
          )
        }
        if (repliesError) {
          return (
            <div className={classes.container}>
              <Typography align="center" gutterBottom component="h2">
                Anonymous Message Board
              </Typography>
              <div className={classes.errorMessage}>
                <Typography align="center" gutterBottom component="h3">
                  That went south real fast
                </Typography>
              </div>
              <div>
                <Typography align="center" gutterBottom variant="h3">
                  {repliesErrorMessage}
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
              /b/ - {boardName}
            </Typography>
            <Divider />
            <ReplyCreator addReply={addNewReply} />
            <Divider />
            <ReplyList
              replies={listofReplies}
              reportReply={markReplyReported}
              deleteReply={purgeReply}
            />
          </div>
        )
      }}
    </RepliesContext.Consumer>
  )
}
RepliesContainer.propTypes = {
  classes: PropTypes.shape({}),
  boardData: PropTypes.shape({}) // eslint-disable-line
}
export default withStyles(styles)(RepliesContainer)
