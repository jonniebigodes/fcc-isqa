import React, {Component} from 'react'
import axios from 'axios'
import uuid from 'uuid'
import {BoardsData} from '../DummyData/DummyBoards'

export const ThreadsContext = React.createContext()
const threadsLocalEndpoint = 'http://localhost:5000/api/threads'
const threadsRemoteEndpoint = 'https://fcc-isqa.herokuapp.com/api/threads'

export class ThreadsProvider extends Component {
  state = {
    loadingThreads: true,
    threadError: false,
    threadErrorMessage: '',
    selectedBoard: {}
  }

  componentDidMount() {
    if (process.env.NODE_ENV === 'stories') {
      this.fetchDataThreads('5ba152ad4249f236dc3ad7a7')
    } else {
      const {children} = this.props // eslint-disable-line
      const {props} = children
      const {boardData} = props
      this.fetchDataThreads(boardData)
    }
  }

  // #region retrieve_threads
  /**
   * fat arrow function to fetch boards thread
   * @param {String} value board id
   */
  fetchDataThreads = value => {
    if (process.env.NODE_ENV === 'stories') {
      const posBoardThreads = BoardsData.findIndex(x => x.id === value)
      this.setState({
        selectedBoard: BoardsData[posBoardThreads],
        loadingThreads: false
      })
    } else {
      axios
        .get(
          `${
            process.env.NODE_ENV !== 'production'
              ? threadsLocalEndpoint
              : threadsRemoteEndpoint
          }/cachedthread/${value}`
        )
        .then(result => {
          const {data} = result

          this.setState({
            selectedBoard: {
              id: value,
              title: data.title,
              creationdate: data.creationdate,
              threads: data.threads
            },
            loadingThreads: false
          })
        })
        .catch(err => {
          /*eslint-disable */
          console.log('====================================')
          console.log(`error fetching threads=>${err}`)
          console.log('====================================')
          this.setState({
            loadingThreads: false,
            threadError: true,
            threadErrorMessage:
              'Something went bad...really bad when fetching threads for board'
          })
          /* eslint-enable */
        })
    }
  }
  // #endregion

  // #region create_thread
  /**
   * fat arrow function to generate a new thread
   * @param {String} deletepassword the thread password
   * @param {String} threadText the contents of the thread
   *
   */
  createThread = ({deletepassword, threadText}) => {
    const {selectedBoard} = this.state
    const {threads, id} = selectedBoard
    if (process.env.NODE_ENV === 'stories') {
      const newThreads = [
        ...threads,
        {
          _id: uuid.v4(),
          created_on: new Date().toISOString(),
          bumped_on: new Date().toISOString(),
          reported: false,
          board_id: id,
          thread_delete_password: deletepassword,
          thread_text: threadText,
          replies: []
        }
      ]
      this.setState(prevstate => ({
        selectedBoard: {
          ...prevstate.selectedBoard,
          threads: newThreads
        }
      }))
    } else {
      axios
        .post(
          `${
            process.env.NODE_ENV !== 'production'
              ? threadsLocalEndpoint
              : threadsRemoteEndpoint
          }/${selectedBoard.id}`,
          {
            delete_password: deletepassword,
            text: threadText
          }
        )
        .then(result => {
          const {data} = result
          const newThreads = [
            ...threads,
            {
              _id: data.id,
              created_on: data.created,
              bumped_on: data.bumped,
              reported: false,
              board_id: id,
              thread_text: threadText,
              thread_delete_password: deletepassword,
              replies: []
            }
          ]
          this.setState(prevstate => ({
            selectedBoard: {
              ...prevstate.selectedBoard,
              threads: newThreads
            }
          }))
        })
        .catch(err => {
          this.setState({
            threadError: true,
            threadErrorMessage:
              'Something went bad...really bad when creating a new thread for this board'
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

  // #region report_thread
  /**
   * fat arrow function to repor a given thread
   * @param {String} value id of the thread
   */
  reportThread = value => {
    const {selectedBoard} = this.state
    const {threads, id} = selectedBoard

    if (process.env.NODE_ENV === 'stories') {
      const posThread = threads.findIndex(x => x._id === value) // eslint-disable-line
      const newThreads = [...threads]
      newThreads[posThread].reported = true
      this.setState(prevstate => ({
        selectedBoard: {
          ...prevstate.selectedBoard,
          threads: newThreads
        }
      }))
    } else {
      axios
        .put(
          `${
            process.env.NODE_ENV !== 'production'
              ? threadsLocalEndpoint
              : threadsRemoteEndpoint
          }/${id}?thread_id=${value}`
        )
        .then(() => {
          const posThread = threads.findIndex(x => x._id === value) // eslint-disable-line
          const newThreads = [...threads]
          newThreads[posThread].reported = true
          this.setState(prevstate => ({
            selectedBoard: {
              ...prevstate.selectedBoard,
              threads: newThreads
            }
          }))
        })
        .catch(err => {
          this.setState({
            threadError: true,
            threadErrorMessage:
              'Something went bad...really bad when reporting a new thread for this board'
          })
          /* eslint-disable */
          console.log('====================================')
          console.log(
            `error reporting thread:\n${JSON.stringify(err, null, 2)}`
          )
          console.log('====================================')
          // eslint-enable
          return null
        })
    }
  }
  // #endregion

  // #region delete_{thread
  /**
   * fat arrow function to remove a given thread
   * @param {String} threadid the id of the thread
   * @param {String} password password of the thread
   */
  removeThread = (threadid, password) => {
    const {selectedBoard} = this.state
    const {threads, id} = selectedBoard
    if (process.env.NODE_ENV !== 'stories') {
      axios
        .delete(
          `${
            process.env.NODE_ENV !== 'production'
              ? threadsLocalEndpoint
              : threadsRemoteEndpoint
          }/${id}?thread_id=${threadid}&delete_password=${password}`
        )
        .then(() => {})
        .catch(err => {
          this.setState({
            threadError: true,
            threadErrorMessage:
              'Something went bad...really bad when deleting a new thread for this board'
          })
          // eslint-disable
          console.log('====================================')
          console.log(`error removing thread:\n${JSON.stringify(err, null, 2)}`)
          console.log('====================================')
          // eslint-enable
          return null // prevents removing remote error
        })
    }
    const newThreads = threads.filter(x => x._id !== threadid) // eslint-disable-line

    this.setState(prevstate => ({
      selectedBoard: {
        ...prevstate.selectedBoard,
        threads: newThreads
      }
    }))
  }
  // #endregion

  render() {
    return (
      <ThreadsContext.Provider
        value={{
          ...this.state,
          getThreads: this.fetchDataThreads,
          makeNewThread: this.createThread,
          markThreadReported: this.reportThread,
          purgeThread: this.removeThread
        }}>
        {/* eslint-disable */}
        {this.props.children}
        {/* eslint-enable */}
      </ThreadsContext.Provider>
    )
  }
}
