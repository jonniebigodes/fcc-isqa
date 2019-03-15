import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import ReportIcon from '@material-ui/icons/Report'

import ReportOff from '@material-ui/icons/ReportOff'
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  emptyItems: {
    width: 'auto',
    [theme.breakpoints.between('xs', 'sm')]: {
      height: '8em'
    },
    [theme.breakpoints.up('md')]: {
      height: '16rem'
    },
    backgroundColor: '#008240',
    border: 'solid 1px #779C74'
  },
  layout: {
    width: 'auto',
    margin: '0.85rem',
    border: 'solid 1px #779C74'
  },
  reply: {
    border: 'solid 1px #5D8465',
    '&:nth-child(odd)': {
      margin: theme.spacing.unit * 2,
      backgroundColor: '#5D8465'
    },
    '&:nth-child(even)': {
      margin: theme.spacing.unit * 3,
      backgroundColor: '#008240'
    }
  },
  innerContent: {
    display: 'inline-flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  replyText: {
    color: theme.palette.common.white,
    lineHeight: 2,
    padding: theme.spacing.unit
  },
  buttonsContainer: {
    display: 'inline-flex',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
})
const ReplyList = props => {
  const {replies, reportReply, deleteReply, classes} = props
  if (replies.length === 0) {
    return (
      <div className={classes.emptyItems}>
        <Typography variant="h3" className={classes.replyText} align="center">
          Nothing so far
        </Typography>
      </div>
    )
  }
  return (
    <div className={classes.layout} key="container">
      {replies.map(item => {
        return (
          // eslint-disable-next-line no-underscore-dangle
          <div key={`container_item${item._id}`} className={classes.reply}>
            <div className={classes.innerContent}>
              <Typography
                className={classes.replyText}
                variant="body1"
                align="left"
                gutterBottom>
                {item.reply_text}
              </Typography>
              <div>
                <Typography
                  variant="subtitle2"
                  align="left"
                  className={classes.replyText}
                  gutterBottom>
                  Added in {new Date(item.dateadded).toLocaleDateString()}
                </Typography>
              </div>
              <div className={classes.buttonsContainer}>
                <IconButton
                  aria-label="Delete"
                  onClick={() =>
                    // eslint-disable-next-line no-underscore-dangle
                    deleteReply(item._id, item.reply_delete_password)
                  }>
                  <DeleteIcon style={{color: 'white'}} />
                </IconButton>
                <div>
                  {item.reportedreply ? (
                    <IconButton aria-label="Reported">
                      <ReportOff style={{color: 'white'}} />
                    </IconButton>
                  ) : (
                    <IconButton
                      className={classes.button}
                      aria-label="Report"
                      // eslint-disable-next-line no-underscore-dangle
                      onClick={() => reportReply(item._id)}>
                      <ReportIcon style={{color: 'white'}} />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

ReplyList.propTypes = {
  reportReply: PropTypes.func,
  deleteReply: PropTypes.func,
  replies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      reply_text: PropTypes.string,
      dateadded: PropTypes.string,
      reportedreply: PropTypes.bool,
      reply_delete_password: PropTypes.string
    })
  ),
  classes: PropTypes.shape({})
}
export default withStyles(styles)(ReplyList)
