import React from 'react'
import Book from './Book'
import {PersonalLibraryContext} from '../../contexts/PersonalLibraryContext'



const BookList = () => {
  return (
    <PersonalLibraryContext.Consumer>
      {({books, expandBook, bookDelete, CommentAdd}) => (
        <div style={{
          background:'white',
          minHeight:'288px'
        }}>
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
