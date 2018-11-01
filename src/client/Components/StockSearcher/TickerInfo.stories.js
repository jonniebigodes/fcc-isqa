import React from 'react'
import uuid from 'uuid'
import {storiesOf} from '@storybook/react' // eslint-disable-line
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import TickerInfo from './TickerInfo'

export const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})

storiesOf('TickerInfo', module)
  .addDecorator(story => (
    <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>
  ))
  .add('default', () => (
    <TickerInfo
      tickerData={{
        id: uuid.v4(),
        tickerLikes: 0,
        price: 250.444,
        nameOfTicker: 'dummy ticker'
      }}
    />
  ))
  .add('with likes', () => (
    <TickerInfo
      tickerData={{
        id: uuid.v4(),
        tickerLikes: 2,
        price: 250.444,
        nameOfTicker: 'dummy ticker'
      }}
    />
  ))
