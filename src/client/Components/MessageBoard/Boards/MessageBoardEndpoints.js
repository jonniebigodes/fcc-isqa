import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles'

const MessageBoardTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 500
  }
})
const MessageBoardEndpoints = props => {
  const {classes} = props
  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <MessageBoardTableCell>API</MessageBoardTableCell>
              <MessageBoardTableCell>GET</MessageBoardTableCell>
              <MessageBoardTableCell>POST</MessageBoardTableCell>
              <MessageBoardTableCell>PUT</MessageBoardTableCell>
              <MessageBoardTableCell>DELETE</MessageBoardTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              {
                id: uuid.v4(),
                endpoint: '/api/boards',
                endpointGET: 'Retrieves messageboards',
                endpointPOST: 'Creates a new messageboard',
                endpointPUT: 'N/A',
                endpointDELETE: 'N/A'
              },
              {
                id: uuid.v4(),
                endpoint: '/api/threads/1234',
                endpointGET: 'Lists the recent threads',
                endpointPOST: 'Creates a new thread',
                endpointPUT: 'Reports a thread',
                endpointDELETE: 'Removes thread with password'
              },
              {
                id: uuid.v4(),
                endpoint: '/api/replies/1234',
                endpointGET: 'Lists the the replies for a thread',
                endpointPOST: 'Creates a new reply',
                endpointPUT: 'Reports a a reply in the thread',
                endpointDELETE: 'Change text of reply to \'[deleted]\''
              }
            ].map(item => {
              return (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.endpoint}
                  </TableCell>
                  <TableCell>{item.endpointGET}</TableCell>
                  <TableCell>{item.endpointPOST}</TableCell>
                  <TableCell>{item.endpointPUT}</TableCell>
                  <TableCell>{item.endpointDELETE}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}
MessageBoardEndpoints.propTypes = {
  classes: PropTypes.shape({})
}
export default withStyles(styles)(MessageBoardEndpoints)
