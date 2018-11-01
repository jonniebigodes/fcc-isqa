import React from 'react'
/* eslint-disable*/
import {storiesOf} from '@storybook/react'
import {withKnobs, object, text} from '@storybook/addon-knobs/react'
/* eslint-enable */
import uuid from 'uuid'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import {StockPriceProvider} from '../../contexts/StockPriceContext'
import StockContainer from './StockContainer'

export const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})
export const DummyStocks = [
  {
    id: uuid.v4(),
    ticker: 'goog',
    tickerPrice: 185.5,
    tickerLikes: 2
  },
  {
    id: uuid.v4(),
    ticker: 'fb',
    tickerPrice: 152.5,
    tickerLikes: 200
  },
  {
    id: uuid.v4(),
    ticker: 'msft',
    tickerPrice: 250.9,
    tickerLikes: 0
  }
]
storiesOf('Stock Search Container', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>
  ))
  .addDecorator(providerStory => (
    <StockPriceProvider>{providerStory()}</StockPriceProvider>
  ))
  .add('default', () => <StockContainer />)
  .add('error', () => {
    return (
      <StockContainer
        isError
        errormessage={text('errormessage', 'something went bad really fast')}
      />
    )
  })
  .add('with data', () => {
    return <StockContainer stockData={object('stockData', [...DummyStocks])} />
  })
  .add('with data and error',()=>{
    return <StockContainer stockData={object('stockData', [...DummyStocks])} isError errormessage={text('errormessage', 'something went bad really fast')} />
  })
