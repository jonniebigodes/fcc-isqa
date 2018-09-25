import React from 'react'
import PropTypes from 'prop-types'
import Book from './Book'
import {PersonalLibraryContext} from '../../contexts/PersonalLibraryContext'

import '../../Assets/css/app.css'

/* const LoadingRow = (
  <div className="loading-item">
    <span className="glow-checkbox" />
    <span className="glow-text">
      <span>Loading</span> <span>cool</span> <span>state</span>
    </span>
  </div>
) */

/* const showLoadingStatus = () => {
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
} */
/* const EmptyBooks = () => {
  ;<div className="list-items">
    <div className="wrapper-message">
      <span className="icon-check" />
      <div className="title-message">You have no books added yet</div>
      <div className="subtitle-message">Sit back and relax</div>
    </div>
  </div>
} */
const BookList = () => {
  return (
    <PersonalLibraryContext.Consumer>
      {({books, expandBook, bookDelete,CommentAdd}) => (
        <div className="list-items">
          {books.map(book => (
            <Book
              key={book.id}
              bookdata={book}
              DeleteBook={bookDelete}
              ShowComments={expandBook}
              AddBookComment={CommentAdd}
            />
          ))}
        </div>
      )}
    </PersonalLibraryContext.Consumer>
  )
}

export default BookList
