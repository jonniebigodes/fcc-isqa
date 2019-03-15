import React from 'react'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Drawer from '@material-ui/core/Drawer'
import MessageBoardEndpoints from './MessageBoardEndpoints'
import {MessageBoardContext} from '../../../contexts/MessageBoardContext'

const styles = theme => ({
  container: {
    height: '480px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  explainContainer: {
    width: '85%',
    margin: '0 auto',
    border: `1px solid ${theme.palette.primary.main}`
  },
  errorMessage: {
    marginTop: theme.spacing.unit * 16,
    marginBottom: theme.spacing.unit * 8
  },
  loadingMessage: {
    marginTop: theme.spacing.unit * 4
  },
  textMessage: {
    color: 'white',
    lineHeight: '32px'
  },
  linkText: {
    padding: theme.spacing.unit,
    cursor: 'pointer'
  },
  explainContainerHead: {
    paddingLeft: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
    lineHeight: '16px'
  },
  GridBoards: {
    marginTop: theme.spacing.unit * 4,
    paddding: theme.spacing.unit * 4,
    margin: '0 auto',
    border: `1px solid ${theme.palette.primary.main}`,
    width: '85%'
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
    },
    '&:hover': {
      cursor: 'pointer'
    }
  },
  errorButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonEndPoints: {
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
  }
})

const MessageBoardContainer = props => {
  const {classes, history} = props
  return (
    <MessageBoardContext.Consumer>
      {({
        isloading,
        appError,
        appErrorMessage,
        boards,
        showAddMessageboard,
        openEndpoints
      }) => {
        if (isloading) {
          return (
            <div className={classes.container}>
              <Typography align="center" gutterBottom variant="display2">
                Anonymous Message Board
              </Typography>
              <div className={classes.loadingMessage}>
                <Typography align="center" gutterBottom variant="display1">
                  Loading Boards
                </Typography>
              </div>
              <div>
                <CircularProgress
                  className={classes.progress}
                  size={200}
                  thickness={2}
                />
              </div>
            </div>
          )
        }
        if (appError) {
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
                <Typography align="center" gutterBottom variant="display1">
                  {appErrorMessage}
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
            <Typography align="center" gutterBottom variant="display2">
              Anonymous Message Board
            </Typography>
            <div className={classes.explainContainer}>
              <div className={classes.explainContainerHead}>
                <Typography className={classes.textMessage}>
                  What is Anonymous Message Board
                </Typography>
              </div>
              <Typography variant="body1" gutterBottom align="justify">
                {`
                  Anonymous Message Board is a simple text based bulletin board where everyone can post comments.
                  There are boards dedicated to a variety of topics. 
                  Users do not need to register an account for participating in the community.
                  Feel free to click on a board bellow that interests you and jump into it!
                `}
              </Typography>
            </div>
            <div className={classes.GridBoards}>
              <Grid
                container
                spacing={24}
                alignItems="center"
                justify="space-evenly"
                wrap="wrap">
                {boards.map(item => (
                  <Grid item xs={6} sm={3} key={`grid_item_${item.id}`}>
                    <Typography
                      className={classes.linkText}
                      onClick={() => history.push(`/b/${item.id}`)}>
                      {item.title}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </div>
            {/* eslint-disable */}
            <Drawer
              anchor="bottom"
              open={showAddMessageboard}
              onClose={() => openEndpoints()}>
              <MessageBoardEndpoints />
            </Drawer>
            <button
              className={classes.buttonEndPoints}
              title="Show Endpoints"
              onClick={() => openEndpoints()}>
              Endpoints
            </button>
            {/* eslint-enable */}
          </div>
        )
      }}
    </MessageBoardContext.Consumer>
  )
}

MessageBoardContainer.propTypes = {
  classes: PropTypes.shape({}),
  history: PropTypes.shape({})
}

export default withRouter(withStyles(styles)(MessageBoardContainer))
