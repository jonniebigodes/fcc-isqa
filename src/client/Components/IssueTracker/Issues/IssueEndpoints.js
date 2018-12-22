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

const IssuesTableCell = withStyles(theme => ({
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
const IssuesEndpoint = props => {
  const {classes} = props
  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <IssuesTableCell>API</IssuesTableCell>
              <IssuesTableCell>GET</IssuesTableCell>
              <IssuesTableCell>POST</IssuesTableCell>
              <IssuesTableCell>PUT</IssuesTableCell>
              <IssuesTableCell>DELETE</IssuesTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              {
                id: uuid.v4(),
                endpoint: '/api/issues/1234',
                endpointGET: "Retrieves project's issues",
                endpointPOST: 'Posts a new issue',
                endpointPUT: 'N/A',
                endpointDELETE: 'N/A'
              },
              {
                id: uuid.v4(),
                endpoint: '/api/issues/1234?issue=1234',
                endpointGET: 'N/A',
                endpointPOST: 'N/A',
                endpointPUT: 'Updates the issue information',
                endpointDELETE: 'Removes the issue from the project'
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
IssuesEndpoint.propTypes = {
  classes: PropTypes.shape({})
}
export default withStyles(styles)(IssuesEndpoint)
