import React from 'react'
import Helmet from 'react-helmet'
import {MuiThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import {theme} from '../../../theme/MuiTheme'

import {MessageBoardProvider} from '../../../contexts/MessageBoardContext'
import MessageBoardContainer from './MessageBoardContainer'

const MessageBoardApp = () => (
  <div>
    <Helmet
      title="Super Duper Anon Message Board"
      meta={[
        {
          name: 'description',
          content: 'freeCodeCamp ISQA Challenges Message Board'
        },
        {
          name: 'keywords',
          content: 'react,fcc,challenges,isqa,Message, Board'
        }
      ]}
    />
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <MessageBoardProvider>
        <MessageBoardContainer />
      </MessageBoardProvider>
    </MuiThemeProvider>
  </div>
)
export default MessageBoardApp
