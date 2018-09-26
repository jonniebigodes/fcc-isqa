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

const EndpointTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

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
const BookEndpoints = props => {
  const {classes} = props
  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <EndpointTableCell>API</EndpointTableCell>
              <EndpointTableCell>GET</EndpointTableCell>
              <EndpointTableCell>POST</EndpointTableCell>
              <EndpointTableCell>DELETE</EndpointTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              {
                id: uuid.v4(),
                endpoint: '/api/books',
                endpointGET: 'retrieves all books',
                endpointPOST: 'posts a book',
                endpointDELETE: 'clears the collection'
              },
              {
                id: uuid.v4(),
                endpoint: '/api/books/1234',
                endpointGET: 'retrieves specified book information',
                endpointPOST: 'posts comment to book',
                endpointDELETE: 'removes book from collection'
              }
            ].map(item => {
              return (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.endpoint}
                  </TableCell>
                  <TableCell>{item.endpointGET}</TableCell>
                  <TableCell>{item.endpointPOST}</TableCell>
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
BookEndpoints.propTypes = {
  classes: PropTypes.shape({})
}
export default withStyles(styles)(BookEndpoints)
