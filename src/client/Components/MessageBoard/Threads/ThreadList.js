import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import ReportIcon from '@material-ui/icons/Report'
import ReportOff from '@material-ui/icons/ReportOff'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {withRouter} from 'react-router-dom'
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  layout: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 500
  },
  thread_text: {
    fontWeight: 600,
    '&:hover': {
      cursor: 'pointer'
    }
  }
})

const ThreadTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell)

const ThreadList = props => {
  const {threadInfo, classes, reportThread, deleteThread, history} = props
  const {threads} = threadInfo
  if (!threads.length) {
    return (
      <Typography variant="h3" gutterBottom align="center" color="primary">
        No threads yet...Create one
      </Typography>
    )
  }

  return (
    <div className={classes.layout}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <ThreadTableCell>Delete</ThreadTableCell>
            <ThreadTableCell>Report</ThreadTableCell>
            <ThreadTableCell>Title</ThreadTableCell>
            <ThreadTableCell>Creation date</ThreadTableCell>
            <ThreadTableCell>Bump date</ThreadTableCell>
            <ThreadTableCell>Replies</ThreadTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {threads.map(item => {
            return (
              // eslint-disable-next-line no-underscore-dangle
              <TableRow key={`thread_item_${item._id}`}>
                <TableCell>
                  <IconButton
                    className={classes.button}
                    aria-label="Delete"
                    onClick={() =>
                      // eslint-disable-next-line no-underscore-dangle
                      deleteThread(item._id, item.thread_delete_password)
                    }>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  {item.reported ? (
                    <IconButton aria-label="Reported">
                      <ReportOff />
                    </IconButton>
                  ) : (
                    <IconButton
                      className={classes.button}
                      aria-label="Report"
                      // eslint-disable-next-line no-underscore-dangle
                      onClick={() => reportThread(item._id)}>
                      <ReportIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color="primary"
                    className={classes.thread_text}
                    onClick={() =>
                      // eslint-disable-next-line no-underscore-dangle
                      history.push(`/t/${threadInfo.id}/${item._id}`)
                    }>
                    {item.thread_text}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" gutterBottom>
                    {new Date(item.created_on).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" gutterBottom>
                    {new Date(item.bumped_on).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" gutterBottom>
                    {item.replies.length}
                  </Typography>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

ThreadList.propTypes = {
  threadInfo: PropTypes.shape({}),
  classes: PropTypes.shape({}),
  reportThread: PropTypes.func,
  deleteThread: PropTypes.func,
  history: PropTypes.shape({})
}
export default withRouter(withStyles(styles)(ThreadList))
