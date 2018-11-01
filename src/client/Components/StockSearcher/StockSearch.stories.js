import React from 'react'
import {storiesOf} from '@storybook/react' // eslint-disable-line

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'

import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import StockSearch from './StockSearch'
import {StockPriceProvider} from '../../contexts/StockPriceContext'

export const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})
storiesOf('StockSearch', module)
  .addDecorator(story => (
    <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>
  ))
  .addDecorator(providestory => (
    <StockPriceProvider>{providestory()}</StockPriceProvider>
  ))
  .add('default', () => <StockSearch />)
