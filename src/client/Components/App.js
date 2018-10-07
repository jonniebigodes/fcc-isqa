import React from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import uuid from 'uuid'
import {MuiThemeProvider, createMuiTheme,withStyles} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})

const AppTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell)



const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div>
      <Paper style={{width:'100%',marginTop:24,overflowX:'auto'}}>
        <Table style={{minWidth:'700px',minHeight:'450px'}}>
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
    </MuiThemeProvider>
    
  )
}
App.propTypes = {
  classes: PropTypes.shape({})
}
export default App
