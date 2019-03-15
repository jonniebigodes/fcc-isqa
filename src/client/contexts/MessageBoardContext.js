import React, {Component} from 'react'
import axios from 'axios'
import uuid from 'uuid'
import {BoardsData} from '../DummyData/DummyBoards'

export const MessageBoardContext = React.createContext()
const messageboardLocalEndpoint = 'http://localhost:5000/api/boards'
const messageboardRemoteEndpoint = 'https://fcc-isqa.herokuapp.com/api/boards'

export class MessageBoardProvider extends Component {
  state = {
    isloading: true,
    appError: false,
    showAddMessageboard: false,
    appErrorMessage: '',
    boards: []
  }

  componentDidMount() {
    setTimeout(() => {
      this.fetchDataBoards()
    }, 1500)
  }

  // #region retrieveBoards
  /**
   * fat arrow function to fetch the databoards
   */
  fetchDataBoards = () => {
    if (process.env.NODE_ENV === 'stories') {
      const result = BoardsData.map(item => {
        return {
          id: item.id,
          title: item.title
        }
      })
      this.setState({
        boards: result,
        isloading: false
      })
    } else {
      axios
        .get(
          `${
            process.env.NODE_ENV !== 'production'
              ? messageboardLocalEndpoint
              : messageboardRemoteEndpoint
          }/bcache`
        )
        .then(result => {
          const {data} = result
          const {messageboards} = data
          this.setState({boards: messageboards, isloading: false})
        })
        .catch(err => {
          /*eslint-disable */
          console.log('====================================')
          console.log(`error fetching boards=>${err}`)
          console.log('====================================')
          this.setState({
            appError: true,
            isloading: false,
            appErrorMessage:
              'Something went bad...really bad when fetching message boards'
          })
          /* eslint-enable */
        })
    }
  }
  // #endregion

  // #region create board
  /**
   * fat arrow function to create a new board
   * @param {String} value title of the messageboard
   */
  createBoards = value => {
    if (process.env.NODE_ENV === 'stories') {
      this.setState(prevstate => ({
        boards: [prevstate.boards, {id: uuid.v4(), title: value}]
      }))
    } else {
      axios
        .post(
          `${
            process.env.NODE_ENV !== 'production'
              ? messageboardLocalEndpoint
              : messageboardRemoteEndpoint
          }`,
          {title: value}
        )
        .then(result => {
          const {data} = result
          this.setState(prevstate => ({
            boards: [
              prevstate.boards,
              {id: data.id, created: data.created, title: value, threads: []}
            ]
          }))
        })
        .catch(err => {
          /*eslint-disable */
          console.log('====================================')
          console.log(`error creating board=>${err}`)
          console.log('====================================')
          this.setState({
            appError: true,
            appErrorMessage:
              'Something went bad...really bad when the board was being created'
          })
          /* eslint-enable */
        })
    }
  }
  // #endregion

  // #region visibility
  showHideEndpoints = () => {
    this.setState(prevstate => ({
      showAddMessageboard: !prevstate.showAddMessageboard
    }))
  }
  // #endregion

  render() {
    return (
      <MessageBoardContext.Provider
        value={{
          ...this.state,
          getMessageBoards: this.fetchDataBoards,
          createMessageboard: this.createBoards,
          endpointsVisible: this.showHideEndpoints,
          openEndpoints: this.showHideEndpoints
        }}>
        {/* eslint-disable */}
        {this.props.children}
        {/* eslint-enable */}
      </MessageBoardContext.Provider>
    )
  }
}
