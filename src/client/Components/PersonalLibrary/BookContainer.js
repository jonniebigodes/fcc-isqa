import React, {Component} from 'react'
import PropTypes from 'prop-types'
import BookList from './BookList'
import BookDrawer from './BookDrawer'


class BookContainer extends Component {
  componentDidMount() {
    const {getdata} = this.props
    getdata()
  }

  render() {
    const {appError, BooksData} = this.props
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
    return (
      <div className="page lists-show">
        <nav>
          <h1 className="title-page">
            <span className="title-wrapper">Book List</span>
          </h1>
        </nav>
        <BookList Books={BooksData} />
        <div>
          <BookDrawer />
        </div>
      </div>
    )
  }
}
BookContainer.propTypes = {
  getdata: PropTypes.func,
  appError: PropTypes.bool,
  BooksData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      expanded: PropTypes.bool,
      title: PropTypes.string,
      comments: PropTypes.arrayOf(
        PropTypes.shape({
          commentText: PropTypes.string,
          dateadded: PropTypes.instanceOf(Date)
        })
      )
    })
  )
}
BookContainer.defaultProps = {
  appError: false,
  BooksData: []
}
export default BookContainer
