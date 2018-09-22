import React from 'react'
import PropTypes from 'prop-types'
import Book from './Book'
import '../../Assets/css/app.css'

const LoadingRow = (
  <div className="loading-item">
    <span className="glow-checkbox" />
    <span className="glow-text">
      <span>Loading</span> <span>cool</span> <span>state</span>
    </span>
  </div>
)

const BookList = ({loading, Books}) => {
  if (loading) {
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
  if (Books.length === 0) {
    return (
      <div className="list-items">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no books added yet</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    )
  }
  return (
    <div className="list-items">
      {Books.map(book => (
        <Book key={book.id} bookdata={book} />
      ))}
    </div>
  )
}

BookList.propTypes = {
  loading: PropTypes.bool,
  Books: PropTypes.arrayOf(
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
BookList.defaultProps = {
  loading: false,
  Books: []
}
export default BookList
