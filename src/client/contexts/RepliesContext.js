import React, {Component} from 'react'
import axios from 'axios'
import uuid from 'uuid'
import {BoardsData} from '../DummyData/DummyBoards'

export const RepliesContext = React.createContext()

const repliesLocalEndpoint = 'http://localhost:5000/api/replies'
const repliesRemoteEndpoint = 'https://fcc-isqa.herokuapp.com/api/replies'

export class RepliesProvider extends Component {
  state = {
    loadingReplies: false,
    repliesError: false,
    repliesErrorMessage: '',
    board: '',
    boardName: '',
    thread: '',
    listofReplies: []
  }

  componentDidMount() {
    if (process.env.NODE_ENV === 'stories') {
      this.fetchThreadReplies({
        board: '5ba152ad4249f236dc3ad7g7',
        thread: '5ba152ad4249f236dc3ad7a8'
      })
    } else {
      const {children} = this.props // eslint-disable-line
      const {props} = children
      const {boardData} = props
      this.fetchThreadReplies(boardData)
    }
  }

  // #region fetch_replies
  /**
   * fat arrow function to fetch the replies data
   * @param {Object} value contains the id of the board and thread
   */
  fetchThreadReplies = value => {
    if (process.env.NODE_ENV === 'stories') {
      const posBoard = BoardsData.findIndex(x => x.id === value.board)
      const boardData = BoardsData[posBoard]
      /* eslint-disable */
      const filteredThreads = [...boardData.threads].filter(
        x => x._id === value.thread
      )
      /* eslint-enable */
      this.setState({
        board: value.board,
        boardName: boardData.title,
        thread: value.thread,
        listofReplies: filteredThreads[0].replies
      })
    } else {
      axios
        .get(
          `${
            process.env.NODE_ENV !== 'production'
              ? repliesLocalEndpoint
              : repliesRemoteEndpoint
          }/cachedreplies/${value.board}?thread=${value.thread}`
        )
        .then(result => {
          const {data} = result
          const {thread} = data
          this.setState({
            loadingReplies: false,
            board: value.board,
            boardName: data.title,
            thread: value.thread,
            listofReplies: Object.keys(thread).length > 0 ? thread.replies : []
          })
        })
        .catch(err => {
          /*eslint-disable */
          console.log('====================================')
          console.log(`error fetching replies=>${err}`)
          console.log('====================================')
          this.setState({
            loadingReplies: false,
            repliesError: true,
            threadErrorMessage:
              'Something went bad...really bad when fetching replies for thread'
          })
          /* eslint-enable */
        })
    }
  }
  // #endregion

  // #region post_reply
  /**
   * es6 fat arrow function to create a new reply on the thread
   * @param {String} replytext the text reply
   * @param {String} password the password for the reply
   */
  createReply = (replytext, password) => {
    const {board, thread} = this.state

    if (process.env.NODE_ENV === 'stories') {
      this.setState(prevState => ({
        listofReplies: [
          ...prevState.listofReplies,
          {
            _id: uuid.v4(),
            reply_text: replytext,
            dateadded: new Date().toISOString(),
            reportedreply: false,
            reply_delete_password: password
          }
        ]
      }))
    } else {
      axios
        .post(
          `${
            process.env.NODE_ENV !== 'production'
              ? repliesLocalEndpoint
              : repliesRemoteEndpoint
          }/${board}`,
          {
            thread_id: thread,
            text: replytext,
            delete_password: password
          }
        )
        .then(result => {
          const {data} = result
          this.setState(prevState => ({
            listofReplies: [
              ...prevState.listofReplies,
              {
                _id: data.result,
                reply_text: replytext,
                dateadded: new Date().toISOString(),
                reportedreply: false,
                reply_delete_password: password
              }
            ]
          }))
        })
        .catch(err => {
          this.setState({
            repliesError: true,
            repliesErrorMessage:
              'Something went bad...really bad when creating a new reply on this this thread for this board'
          })
          /* eslint-disable */
          console.log('====================================')
          console.log(
            `error creating new thread:\n${JSON.stringify(err, null, 2)}`
          )
          console.log('====================================')
          /* eslint-enable */
        })
    }
  }
  // #endregion

  // #region reportreply
  /**
   * fat arrow function to report a given reply
   * @param {String} value id of the reply
   */
  reportReply = value => {
    const {board, thread, listofReplies} = this.state
    const newReplies = [...listofReplies]
    // eslint-disable-next-line no-underscore-dangle
    const posReply = newReplies.findIndex(x => x._id === value)
    if (process.env.NODE_ENV === 'stories') {
      newReplies[posReply].reportedreply = true
      this.setState({
        listofReplies: newReplies
      })
    } else {
      axios
        .put(
          `${
            process.env.NODE_ENV !== 'production'
              ? repliesLocalEndpoint
              : repliesRemoteEndpoint
            // eslint-disable-next-line no-underscore-dangle
          }/${board}?thread_id=${thread}&reply_id=${value}`
        )
        .then(() => {
          newReplies[posReply].reportedreply = true
          this.setState({
            listofReplies: newReplies
          })
        })
        .catch(err => {
          this.setState({
            threadError: true,
            threadErrorMessage:
              'Something went bad...really bad when reporting the reply for the thread on this board'
          })
          /* eslint-disable */
          console.log('====================================')
          console.log(`error reporting reply:\n${JSON.stringify(err, null, 2)}`)
          console.log('====================================')
        })
    }
  }

  // #endregion

  // #region deletereply
  /**
   * fat arrow function to delete the reply
   * @param {String} replyid unique identifier of the reply
   * @param {String} password password of the reply
   */
  removeReply = (replyid, password) => {
    const {board, thread, listofReplies} = this.state

    const newReplies = [...listofReplies]
    const posReply = newReplies.findIndex(x => x._id === replyid)
    if (process.env.NODE_ENV === 'stories') {
      newReplies[posReply].reply_text = `[deleted]`
      this.setState({listofReplies: newReplies})
    } else {
      axios
        .delete(
          `${
            process.env.NODE_ENV !== 'production'
              ? repliesLocalEndpoint
              : repliesRemoteEndpoint
          }/${board}?thread_id=${thread}&reply_id=${replyid}&delete_password=${password}`
        )
        .then(() => {
          newReplies[posReply].reply_text = `[deleted]`
          this.setState({
            listofReplies: newReplies
          })
        })
        .catch(err => {
          this.setState({
            threadError: true,
            threadErrorMessage:
              'Something went bad...really bad when deleting the reply for the thread on this board'
          })
          /* eslint-disable */
          console.log('====================================')
          console.log(`error removing reply:\n${JSON.stringify(err, null, 2)}`)
          console.log('====================================')
        })
    }
  }
  // #endregion

  render() {
    return (
      <RepliesContext.Provider
        value={{
          ...this.state,
          addNewReply: this.createReply,
          markReplyReported: this.reportReply,
          purgeReply: this.removeReply
        }}>
        {this.props.children}
      </RepliesContext.Provider>
    )
  }
}
