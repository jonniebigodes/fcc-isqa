import React from 'react'
import Helmet from 'react-helmet'
import {MuiThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import {
  StockPriceProvider,
  StockPriceContext
} from '../../contexts/StockPriceContext'
import {theme} from '../../theme/MuiTheme'
import StockContainer from './StockContainer'

const StockApp = () => (
  <div style={{minHeight: '500px', marginLeft: 'auto', marginRight: 'auto'}}>
    <Helmet
      title="Super Duper Stock Search"
      meta={[
        {
          name: 'description',
          content: 'freeCodeCamp ISQA Challenges Stock search'
        },
        {
          name: 'keywords',
          content: 'react,fcc,challenges,isqa,stocks,search'
        }
      ]}
    />
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <StockPriceProvider>
        <StockPriceContext.Consumer>
          {({results, stockError, stockErrorMessage, ErrorReset}) => (
            <StockContainer
              stockData={results}
              isError={stockError}
              errormessage={stockErrorMessage}
              resetError={ErrorReset}
            />
          )}
        </StockPriceContext.Consumer>
      </StockPriceProvider>
    </MuiThemeProvider>
  </div>
)
export default StockApp
