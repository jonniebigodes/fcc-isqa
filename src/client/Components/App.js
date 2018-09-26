import React from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import uuid from 'uuid'
import {withStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const AppTableCell = withStyles(theme => ({
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
    minWidth: 700,
    minHeight: 450
  }
})

const App = props => {
  const {classes} = props
  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <AppTableCell>Name</AppTableCell>
              <AppTableCell>Description</AppTableCell>
              <AppTableCell>Location</AppTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              {
                id: uuid.v4(),
                name: 'Metric-Imperial Converter',
                description:
                  'implementation of the metric imperial converter project',
                location: '/metrics'
              },
              {
                id: uuid.v4(),
                name: 'Issue Tracker',
                description: 'implementation of the issue tracker project',
                location: '/issuetracker'
              },
              {
                id: uuid.v4(),
                name: 'Personal Library',
                description: 'implementation of the personal library project',
                location: '/books'
              },
              {
                id: uuid.v4(),
                name: 'Stock Price Checker',
                description:
                  'implementation of the stock prices checker project',
                location: '/stockdata'
              },
              {
                id: uuid.v4(),
                name: 'Anonymous Message board',
                description: 'implementation of the message board project',
                location: '/messageboards'
              }
            ].map(row => {
              return (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    <Link to={row.location}>{row.name}</Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}
App.propTypes = {
  classes: PropTypes.shape({})
}
export default withStyles(styles)(App)
