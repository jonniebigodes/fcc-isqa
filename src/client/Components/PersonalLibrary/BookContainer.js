import React, {Component} from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import BookList from './BookList'

const LoadingRow = (
  <div className="loading-item">
    <span className="glow-checkbox" />
    <span className="glow-text">
      <span>Loading</span> <span>cool</span> <span>state</span>
    </span>
  </div>
)

class BookContainer extends Component {
  componentDidMount() {
    setTimeout(() => {
      const {getdata} = this.props
      getdata()
    }, 1000)
  }

  render() {
    const {appError, isloading} = this.props
    if (appError) {
      return (
        <div className="page lists-show">
          <div className="wrapper-message">
            <span className="icon-face-sad" />
            <div className="title-message">Oh no!</div>
            <div className="subtitle-message">Something went wrong</div>
          </div>
        </div>
      )
    }
    if (isloading) {
      return (
        <div className="list-items">
          {LoadingRow}
          {LoadingRow}
          {LoadingRow}
          {LoadingRow}
          {LoadingRow}
          {LoadingRow}
        </div>
      )
    }
    return (
      <div className="page lists-show">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Book List
            </Typography>
          </Toolbar>
        </AppBar>
        <BookList />
      </div>
    )
  }
}
BookContainer.propTypes = {
  getdata: PropTypes.func,
  appError: PropTypes.bool,
  isloading: PropTypes.bool
}
BookContainer.defaultProps = {
  appError: false
}
export default BookContainer
