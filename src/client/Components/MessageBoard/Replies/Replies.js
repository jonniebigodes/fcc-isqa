import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import {MuiThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import {theme} from '../../../theme/MuiTheme'

import {RepliesProvider} from '../../../contexts/RepliesContext'
import RepliesContainer from './RepliesContainer'

const Replies = props => {
  const {match} = props
  const {params} = match
  return (
    <div>
      <Helmet
        title="Super Duper Anon Message Board"
        meta={[
          {
            name: 'description',
            content: 'freeCodeCamp ISQA challenges anonymous Messageboard'
          },
          {
            name: 'keywords',
            content: 'react, fcc, challenges,isqa,threads,message board'
          }
        ]}
      />
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <RepliesProvider>
          <RepliesContainer
            boardData={{board: params.board, thread: params.thread}}
          />
        </RepliesProvider>
      </MuiThemeProvider>
    </div>
  )
}
Replies.propTypes = {
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.shape({
      board: PropTypes.string
    }),
    path: PropTypes.string,
    url: PropTypes.string
  })
}

export default Replies
