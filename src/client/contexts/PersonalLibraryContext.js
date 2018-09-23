import React, {Component} from 'react'
import axios from 'axios'
import uuid from 'uuid'
import {dummyData} from '../DummyData/DummyLibrary'

export const PersonalLibraryContext = React.createContext()
const endpointLocal = 'http://localhost:5000/api/books/'
const endpointRemote = 'https://fcc-isqa.herokuapp.com/api/books/'

export class PersonalLibraryProvider extends Component {
  // #region personal library state
  state = {
    books: [],
    selectedBook: {},
    bookName: '',
    addCommentText: '',
    isError: false,
    loading: true,
    drawerOpen: false,
    drawerInfoOpen: false
  }
  // #endregion

  // #region set comment
  /**
   * fat arrow function to define the contents of the comment to the specific book
   * @param {String} value contains the comment text
   */
  setComment = value => {
    const {selectedBook} = this.state
    if (selectedBook.id) {
      this.setState({addCommentText: value})
    }
  }
  // #endregion

  // #region addbookname
  /**
   * fat arrow function to define the name of the book
   * @param {String} value contains the comment text
   */
  addBookName = value => {
    this.setState({bookName: value})
  }
  // #endregion

  // #region addbookcollection
  /**
   * fat arrow function to inject the book in the collection
   */
  addBookCollection = () => {
    console.log('====================================');
    console.log(`node env=>${process.env.NODE_ENV}`);
    console.log('====================================');
    const {bookName} = this.state
    if (bookName !== '') {
      if (
        process.env.NODE_ENV === 'stories'
      ) {
        this.UIaddBookCollection()
      } else {
        axios
          .post(
            `${
              process.env.NODE_ENV !== 'production'
                ? endpointLocal
                : endpointRemote
            }`,
            {
              title: bookName
            }
          )
          .then(result => {
            const {data} = result
            this.setState(prevState => ({
              books: [
                ...prevState.books,
                {
                  id: data.id,
                  title: data.title,
                  expanded: false,
                  comments: []
                }
              ],
              bookName:'',
              drawerOpen:false
            }))
          })
          .catch(err => {
            /* eslint-disable */
            console.log('====================================')
            console.log(
              `error posting book to the collection:\n${err}`
            )
            console.log('====================================')
            /* eslint-enable */
            this.setState({isError: true})
          })
      }
    }
  }

  /**
   * fat arrow function to inject book on ui testing
   */
  UIaddBookCollection = () => {
    this.setState(prevState => ({
      books: [
        ...prevState.books,
        {
          _id: uuid.v4(),
          title: prevState.bookName,
          expanded: false,
          comments: []
        }
      ],
      bookName:'',
      drawerOpen:false

    }))
  }
  // #endregion

  // #region add comment to book
  /**
   * click handler for submition to the server
   */
  AddCommentServer = () => {
    const {selectedBook, addCommentText, books} = this.state

    if (selectedBook.id) {
      if (
        process.env.NODE_ENV === 'stories'
      ) {
        const {comments} = selectedBook
        const newdata = [
          ...comments,
          {commentText: addCommentText, dateadded: new Date()}
        ]
        selectedBook.comments = newdata
        const bookpos = books.findIndex(x => x.id === selectedBook.id)
        books[bookpos] = selectedBook
      } else {
        axios
          .post(
            `${
              process.env.NODE_ENV !== 'production'
                ? endpointLocal
                : endpointRemote
            }/${selectedBook.id}`,
            {
              comment: addCommentText
            }
          )
          .then(result => {
            const {data} = result
            const {book} = data
            selectedBook.comments = book.comments
            const bookpos = books.findIndex(x => x.id === selectedBook.id)
            books[bookpos] = selectedBook
          })
          .catch(err => {
            /* eslint-disable */
            console.log('====================================')
            console.log(`error adding the comment to the book=>${err}`)
            console.log('====================================')
            /* eslint-enable */
          })
      }
    }
  }
  // #endregion

  // #region data fetch from server
  /**
   * fat arrow function to get the data from the server
   */
  fetchData = () => {
    if (
      process.env.NODE_ENV === 'stories'
    ) {
      this.setState({books: dummyData, loading: false})
    } else {
      axios
        .get(
          `${
            process.env.NODE_ENV !== 'production'
              ? endpointLocal
              : endpointRemote
          }`
        )
        .then(result => {
          const {data} = result
          const {bookdata} = data

          const bookItems = bookdata.map(item => {
            return {
              id: item.id,
              title: item.title,
              expanded: false,
              comments: item.comments
            }
          })

          this.setState({books: bookItems, loading: false})
        })
        .catch(err => {
          /* eslint-disable */
          console.log('====================================')
          console.log(`error fetching data=>\n${err}`)
          console.log('====================================')
          /* eslint-enable */
          this.setState({isError: true, loading: false})
        })
    }
  }
  // #endregion

  // #region expand book comments
  /**
   * click handler to handle the expansion on the book component
   */
  expandBookInfo = value => {
    const {books} = this.state
    const indexBook = books.findIndex(x => x.id === value)
    if (indexBook) {
      books[indexBook].expanded = !books[indexBook].expanded
      this.setState({selectedBook: books[indexBook], addCommentText: ''})
    }
  }
  // #endregion

  // #region clear books
  /**
   * fat arrow function to remove the book from collection
   */
  deleteSingleBook = () => {
    const {selectedBook} = this.state
    if (selectedBook.id) {
      if (
        process.env.NODE_ENV === 'stories' 
      ) {
        this.setState(prevState => ({
          books: prevState.books.filter(x => x.id !== selectedBook.id),
          selectedBook: {}
        }))
      } else {
        axios
          .delete(
            `${
              process.env.NODE_ENV !== 'production'
                ? endpointLocal
                : endpointRemote
            }/${selectedBook.id}`
          )
          .then(res => {
            const {data} = res
            if (data.message === 'book was removed') {
              this.setState(prevState => ({
                books: prevState.books.filter(x => x.id !== selectedBook.id),
                selectedBook: {}
              }))
            }
          })
          .catch(err => {
            /* eslint-disable */
            console.log('====================================')
            console.log(`error removing book=>${err.response}`)
            console.log('====================================')
            /* eslint-enable */
          })
      }
    }
  }

  // #region clear all data
  /**
   * fat arrow function to clear the book collection
   */
  deleteAllBooks = () => {
    if (
      process.env.NODE_ENV === 'stories' 
    ) {
      this.setState({books: [], selectedBook: {}})
    } else {
      axios
        .delete(
          `${
            process.env.NODE_ENV !== 'production'
              ? endpointLocal
              : endpointRemote
          }`
        )
        .then(res => {
          const {data} = res
          if (data.message === 'complete delete successful') {
            this.setState({books: [], selectedBook: {}})
          }
        })
        .catch(err => {
          /* eslint-disable */
          console.log('====================================')
          console.log(`error removing all book=>${err}`)
          console.log('====================================')
          /* eslint-enable */
        })
    }
  }

  // #endregion

  // #endregion

  // #region change drawerStatus
  changeDrawer = () => {
    this.setState(prevState => ({
      drawerOpen: !prevState.drawerOpen
    }))
  }
  // #endregion

  // #region change drawer info Status
  changeDrawerInfo = () => {
    this.setState(prevState => ({
      drawerInfoOpen: !prevState.drawerInfoOpen
    }))
  }
  // #endregion

  //
  render() {
    return (
      <PersonalLibraryContext.Provider
        value={{
          ...this.state,
          getLibraryData: this.fetchData,
          expandBook: this.expandBookInfo,
          CommentAdd: this.AddCommentServer,
          bookDelete: this.deleteSingleBook,
          BookAdd: this.addBookCollection,
          setBookName: this.addBookName,
          addCommentText: this.setComment,
          changeDrawerStatus: this.changeDrawer,
          changeInfoDrawer: this.changeDrawerInfo
        }}>
        {this.props.children} {/* eslint-disable-line */}
      </PersonalLibraryContext.Provider>
    )
  }
}
